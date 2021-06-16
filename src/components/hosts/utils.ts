import { saveAs } from 'file-saver';
import { Host, Cluster, Presigned, Inventory } from '../../api/types';
import { HOST_ROLES, TIME_ZERO } from '../../config';
import {
  getHostLogsDownloadUrl,
  ocmClient,
  handleApiError,
  getErrorMessage,
  getPresignedFileUrl,
  stringToJSON,
} from '../../api';
import { AlertsContextType } from '../AlertsContextProvider';
import { DASH } from '../constants';
import filesize from 'filesize.js';
import { isSingleNodeCluster } from '../clusters/utils';

export const canEnable = (clusterStatus: Cluster['status'], status: Host['status']) =>
  ['pending-for-input', 'insufficient', 'ready', 'adding-hosts'].includes(clusterStatus) &&
  ['disabled'].includes(status);

export const canDisable = (clusterStatus: Cluster['status'], status: Host['status']) =>
  ['pending-for-input', 'insufficient', 'ready', 'adding-hosts'].includes(clusterStatus) &&
  ['discovering', 'disconnected', 'known', 'insufficient', 'pending-for-input'].includes(status);

export const canDelete = (clusterStatus: Cluster['status'], status: Host['status']) =>
  ['pending-for-input', 'insufficient', 'ready', 'adding-hosts'].includes(clusterStatus) &&
  [
    'discovering',
    'known',
    'disconnected',
    'disabled',
    'insufficient',
    'resetting',
    'resetting-pending-user-input',
    'resetting-pending-user-action',
    'installing-pending-user-action',
    'pending-for-input',
    'added-to-existing-cluster',
  ].includes(status);

export const canReset = (clusterStatus: Cluster['status'], status: Host['status']) =>
  ['adding-hosts'].includes(clusterStatus) &&
  ['error', 'installing-pending-user-action'].includes(status);

export const canEditRole = (cluster: Cluster, hostStatus: Host['status']) =>
  !isSingleNodeCluster(cluster) &&
  ['pending-for-input', 'insufficient', 'ready'].includes(cluster.status) &&
  [
    'discovering',
    'known',
    'disconnected',
    'disabled',
    'insufficient',
    'pending-for-input',
  ].includes(hostStatus);

export const canEditHost = (clusterStatus: Cluster['status'], status: Host['status']) =>
  ['pending-for-input', 'insufficient', 'ready'].includes(clusterStatus) &&
  [
    'discovering',
    'known',
    'disconnected',
    'disabled',
    'insufficient',
    'pending-for-input',
  ].includes(status);

export const canEditDisks = canEditHost;

export const canDownloadKubeconfig = (clusterStatus: Cluster['status']) =>
  ['installing', 'finalizing', 'error', 'cancelled', 'installed'].includes(clusterStatus);

export const canInstallHost = (cluster: Cluster, hostStatus: Host['status']) =>
  cluster.kind === 'AddHostsCluster' && cluster.status === 'adding-hosts' && hostStatus === 'known';

export const getHostProgressStages = (host: Host) => host.progressStages || [];

export const getHostProgress = (host: Host) =>
  host.progress || { currentStage: 'Preparing installation', progressInfo: undefined };

export const getHostProgressStageNumber = (host: Host) => {
  const stages = getHostProgressStages(host);
  const progress = getHostProgress(host);
  // TODO(jkilzi): progress cannot be undefined! This condition seems to be redundant.
  if (progress) {
    const currentStage = progress.currentStage;
    return stages.findIndex((s) => currentStage.match(s)) + 1;
  }
  return 0;
};

export const canHostnameBeChanged = (hostStatus: Host['status']) =>
  ['discovering', 'known', 'disconnected', 'insufficient', 'pending-for-input'].includes(
    hostStatus,
  );

export const getHostRole = (host: Host): string =>
  `${HOST_ROLES.find((role) => role.value === host.role)?.label || HOST_ROLES[0].label}${
    host.bootstrap ? ' (bootstrap)' : ''
  }`;

export const canDownloadHostLogs = (host: Host) =>
  !!host.logsCollectedAt && host.logsCollectedAt != TIME_ZERO;

export const canDownloadClusterLogs = (cluster: Cluster) =>
  !!(cluster.hosts || []).find((host) => canDownloadHostLogs(host));

export const downloadHostInstallationLogs = async (
  addAlert: AlertsContextType['addAlert'],
  host: Host,
) => {
  if (ocmClient) {
    try {
      const { data } = await getPresignedFileUrl({
        clusterId: host.clusterId || 'UNKNOWN_CLUSTER',
        fileName: 'logs',
        hostId: host.id,
        logsType: 'host',
      });
      saveAs(data.url);
    } catch (e) {
      handleApiError<Presigned>(e, async (e) => {
        addAlert({ title: 'Could not download host logs.', message: getErrorMessage(e) });
      });
    }
  } else {
    saveAs(getHostLogsDownloadUrl(host.id, host.clusterId));
  }
};

export const getReadyHostCount = (cluster: Cluster) => cluster.readyHostCount || 0;
export const getEnabledHostCount = (cluster: Cluster) => cluster.enabledHostCount || 0;
export const getTotalHostCount = (cluster: Cluster) => cluster.totalHostCount || 0;

export const getEnabledHosts = (hosts: Host[] = []) =>
  hosts.filter((host) => host.status !== 'disabled');

export const getInventory = (host?: Host): Inventory =>
  stringToJSON<Inventory>(host?.inventory) || {};

export const getHostname = (host: Host) => host.requestedHostname || getInventory(host).hostname;

export const getHardwareTypeText = (inventory: Inventory) => {
  let hardwareTypeText = DASH;
  const { systemVendor } = inventory;

  if (systemVendor !== undefined) {
    if (systemVendor.virtual) {
      hardwareTypeText = 'Virtual machine';
    } else {
      hardwareTypeText = 'Bare metal';
    }
  }

  return hardwareTypeText;
};

export const fileSize: typeof filesize = (...args) =>
  filesize
    .call(null, ...args)
    .toUpperCase()
    .replace(/I/, 'i');
