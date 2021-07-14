import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { Cluster } from '../../../common';
import { StatusCondition } from './shared';

export type AgentClusterInstallStatusConditionType =
  | 'SpecSynced'
  | 'Validated'
  | 'RequirementsMet'
  | 'Completed'
  | 'Failed'
  | 'Stopped';

export type AgentClusterInstallStatusCondition = StatusCondition<
  AgentClusterInstallStatusConditionType
>;

export type AgentClusterInstallK8sResource = K8sResourceCommon & {
  spec?: {
    clusterDeploymentRef: {
      name: string;
    };
    apiVIP?: string;
    ingressVIP?: string;
    sshPublicKey?: string;
    imageSetRef?: {
      name?: string;
    };
    provisionRequirements: {
      controlPlaneAgents: number;
    };
    networking: {
      clusterNetwork?: {
        cidr: string;
        hostPrefix: number;
      }[];
      serviceNetwork?: string[];
      machineNetwork?: {
        cidr: string;
      }[];
    };
  };
  status?: {
    connectivityMajorityGroups?: string;
    conditions?: AgentClusterInstallStatusCondition[];
    debugInfo?: {
      eventsUrl: string;
      logsUrl: string;
      state: Cluster['status'];
      stateInfo: Cluster['statusInfo'];
    };
  };
};
