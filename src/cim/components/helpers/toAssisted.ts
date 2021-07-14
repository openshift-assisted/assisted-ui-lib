import _ from 'lodash';
import { AgentK8sResource } from '../../types/k8s/agent';
import { Cluster, Host, Inventory } from '../../../common';
import { getAgentStatus, getClusterStatus } from './status';
import { ClusterDeploymentK8sResource } from '../../types/k8s/cluster-deployment';
import { AgentClusterInstallK8sResource } from '../../types/k8s/agent-cluster-install';
import { getHostNetworks } from './network';

export const getAIHosts = (agents: AgentK8sResource[] = []) =>
  agents.map(
    (agent): Host => {
      const [status, statusInfo] = getAgentStatus(agent);
      // TODO(mlibra) Remove that workaround once https://issues.redhat.com/browse/MGMT-7052 is fixed
      const inventory: Inventory = _.cloneDeep(agent.status?.inventory || {});
      inventory.interfaces?.forEach((intf) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        intf.ipv4Addresses = _.cloneDeep(intf.ipV4Addresses);
      });

      const {
        currentStage = 'Starting installation',
        progressInfo,
        stageStartTime,
        stageUpdateTime,
      } = agent.status?.progress || {};
      return {
        kind: 'Host',
        id: agent.metadata?.uid || '',
        href: '',
        status,
        statusInfo,
        role: agent.spec.role,
        requestedHostname: agent.spec.hostname || inventory.hostname,
        // validationsInfo: JSON.stringify(agent.status.hostValidationInfo),
        createdAt: agent.metadata?.creationTimestamp,
        validationsInfo: JSON.stringify({ hardware: [] }),
        inventory: JSON.stringify(inventory),
        progress: {
          currentStage,
          progressInfo,
          stageStartedAt: stageStartTime,
          stageUpdatedAt: stageUpdateTime,
        },
        progressStages: [
          'Starting installation',
          'Waiting for control plane',
          'Installing',
          'Writing image to disk',
          'Rebooting',
          'Waiting for ignition',
          'Configuring',
          'Joined',
          'Done',
        ],
      };
    },
  );

export const getAICluster = ({
  clusterDeployment,
  agentClusterInstall,
  agents = [],
  pullSecretSet = false,
}: {
  clusterDeployment: ClusterDeploymentK8sResource;
  agentClusterInstall?: AgentClusterInstallK8sResource;
  agents?: AgentK8sResource[];
  pullSecretSet?: boolean;
}): Cluster => {
  const [status, statusInfo] = getClusterStatus(agentClusterInstall);
  const aiCluster: Cluster = {
    id: clusterDeployment.metadata?.uid || '',
    kind: 'Cluster',
    href: '',
    name: clusterDeployment.spec?.clusterName,
    baseDnsDomain: clusterDeployment.spec?.baseDomain,
    openshiftVersion: agentClusterInstall?.spec?.imageSetRef?.name,
    apiVip: agentClusterInstall?.spec?.apiVIP,
    ingressVip: agentClusterInstall?.spec?.ingressVIP,
    status,
    statusInfo,
    imageInfo: {
      sshPublicKey: agentClusterInstall?.spec?.sshPublicKey,
    },
    sshPublicKey: agentClusterInstall?.spec?.sshPublicKey,
    clusterNetworkHostPrefix:
      agentClusterInstall?.spec?.networking?.clusterNetwork?.[0]?.hostPrefix,
    clusterNetworkCidr: agentClusterInstall?.spec?.networking?.clusterNetwork?.[0]?.cidr,
    serviceNetworkCidr: agentClusterInstall?.spec?.networking?.serviceNetwork?.[0],
    machineNetworkCidr: agentClusterInstall?.spec?.networking?.machineNetwork?.[0]?.cidr,
    monitoredOperators: [],
    pullSecretSet,
    vipDhcpAllocation: false,
    userManagedNetworking: false,
    hostNetworks: getHostNetworks(agents, agentClusterInstall),
    totalHostCount: agents?.length,
    hosts: getAIHosts(agents),
    installStartedAt: clusterDeployment.status?.installStartedTimestamp,
    installCompletedAt: clusterDeployment.status?.installedTimestamp,
  };

  return aiCluster;
};
