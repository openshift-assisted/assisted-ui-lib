import { AgentK8sResource } from '../../types/k8s/agent';
import { AgentClusterInstallK8sResource } from '../../types/k8s/agent-cluster-install';
import { StatusCondition } from '../../types/k8s/common';

export const getClusterValidatedCondition = (resource: AgentClusterInstallK8sResource) =>
  resource.status?.conditions?.find((c) => c.type === 'Validated') as StatusCondition<'Validated'>;

export const getAgentValidatedCondition = (agentClusterInstall: AgentK8sResource) =>
  agentClusterInstall.status?.conditions?.find((c) => c.type === 'Validated') as StatusCondition<
    'Validated'
  >;
