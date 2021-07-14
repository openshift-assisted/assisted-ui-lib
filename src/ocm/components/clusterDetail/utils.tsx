import { saveAs } from 'file-saver';
import { get } from 'lodash';
import {
  ocmClient,
  getPresignedFileUrl,
  handleApiError,
  getErrorMessage,
  getClusterLogsDownloadUrl,
} from '../../api';
import {
  Cluster,
  Host,
  HostRole,
  Inventory,
  Presigned,
  stringToJSON,
  AlertsContextType,
} from '../../../common';

export const downloadClusterInstallationLogs = async (
  addAlert: AlertsContextType['addAlert'],
  clusterId: string,
) => {
  if (ocmClient) {
    try {
      const { data } = await getPresignedFileUrl({
        clusterId,
        fileName: 'logs',
        hostId: undefined,
        logsType: 'all',
      });
      saveAs(data.url);
    } catch (e) {
      handleApiError<Presigned>(e, async (e) => {
        addAlert({
          title: 'Could not download cluster installation logs.',
          message: getErrorMessage(e),
        });
      });
    }
  } else {
    saveAs(getClusterLogsDownloadUrl(clusterId));
  }
};

const getHostRoleCount = (hosts: Host[], role: HostRole) =>
  hosts.filter((host) => host.status !== 'disabled' && host.role === role).length;

export const getMasterCount = (hosts: Host[]) => getHostRoleCount(hosts, 'master');

export const getWorkerCount = (hosts: Host[]) => getHostRoleCount(hosts, 'worker');

const getClusterResources = (cluster: Cluster, resourcePath: string): number => {
  if (!cluster.hosts) {
    return 0;
  }

  const masterCount = getMasterCount(cluster.hosts);
  const workerCount = getWorkerCount(cluster.hosts);

  // Cluster contain only master hosts
  const countMastersOnly = masterCount >= 3 && workerCount === 0;

  // Cluster contain master and worker hosts
  const countWorkersOnly = masterCount >= 3 && workerCount >= 2;

  const singleNodeMode = masterCount === 1;

  const result = cluster.hosts
    .filter((host) => 'inventory' in host)
    .filter(
      (host) =>
        (host.role === 'worker' && countWorkersOnly) ||
        (host.role === 'master' && countMastersOnly) ||
        (host.role === 'master' && singleNodeMode),
    )
    .map((host) => stringToJSON<Inventory>(host.inventory) || {})
    .map((inventory) => get(inventory, resourcePath, 0))
    .reduce((total, value) => total + value, 0);

  return result;
};

export const getClustervCPUCount = (cluster: Cluster): number =>
  getClusterResources(cluster, 'cpu.count');

export const getClusterMemoryAmount = (cluster: Cluster): number =>
  getClusterResources(cluster, 'memory.usableBytes');

export const getClusterDetailId = (suffix: string) => `cluster-detail-${suffix}`;
