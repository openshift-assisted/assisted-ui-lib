import { AgentK8sResource } from '../../types/k8s/agent';
import { AgentClusterInstallK8sResource } from '../../types/k8s/agent-cluster-install';

export const getHostNetworks = (
  agents: AgentK8sResource[],
  agentClusterInstall?: AgentClusterInstallK8sResource,
) => {
  if (!agents?.length || !agentClusterInstall?.status?.connectivityMajorityGroups) {
    return [];
  }

  const connectivityMajorityGroups = JSON.parse(
    agentClusterInstall.status.connectivityMajorityGroups,
  );

  // Format: '{"192.168.122.0/24":["4ae8f799-7d60-4d13-be7b-f9c93ddec28e","c891ff23-9b0d-4b8e-be05-c9bcc145e823","cd188ad8-8290-4e7f-a86f-b85fef0e63aa"]}'
  return Object.keys(connectivityMajorityGroups).map((cidr) => {
    const hostIds: string[] = [];
    connectivityMajorityGroups[cidr].forEach((hostName: string) => {
      const agent: AgentK8sResource | undefined = agents.find(
        (agent) => agent.metadata?.name === hostName,
      );
      if (!agent?.metadata?.uid) {
        console.warn(`Can not find agent of ${hostName} name.`);
      } else {
        hostIds.push(agent.metadata.uid);
      }
    });

    return {
      cidr,
      hostIds,
    };
  });
};
