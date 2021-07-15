import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { Host, HostRole, HostStage, Inventory } from '../../../api/types';
import { ValidationsInfo } from '../../../types/hosts';
import { StatusCondition } from './common';

export type AgentStatusConditionType =
  | 'SpecSynced'
  | 'Validated'
  | 'Connected'
  | 'ReadyForInstallation'
  | 'Installed';

export type AgentStatusCondition = StatusCondition<AgentStatusConditionType>;

export type AgentK8sResource = K8sResourceCommon & {
  spec: {
    approved: boolean;
    clusterDeploymentName: {
      name: string;
      namespace: string;
    };
    role: HostRole;
    hostname: string;
  };
  status?: {
    conditions?: AgentStatusCondition[];
    hostValidationInfo: ValidationsInfo;
    inventory: Inventory;
    progress: {
      currentStage: HostStage;
      progressInfo: string;
      stageStartTime: string;
      stageUpdateTime: string;
    };
    debugInfo: {
      eventsUrl: string;
      state: Host['status'];
      stateInfo: Host['statusInfo'];
    };
  };
};
