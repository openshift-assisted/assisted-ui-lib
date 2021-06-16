import { Host } from '../../api/types';
import { Agent } from '../types/k8s';

export const agentToHost = (agent: Agent): Host => ({
  id: agent.metadata?.uid || '',
  href: '',
  kind: 'Host',
  status: 'known',
  statusInfo: 'foo',
  inventory: JSON.stringify(agent.status.inventory),
  requestedHostname: agent.spec?.hostname,
  role: agent.spec.role,
  createdAt: agent.metadata?.creationTimestamp,
});
