import { HostRole, Inventory } from '../../api/types';
import { ValidationsInfo } from '../../types/hosts';

export type OwnerReference = {
  name: string;
  kind: string;
  uid: string;
  apiVersion: string;
  controller?: boolean;
  blockOwnerDeletion?: boolean;
};

export type ObjectMetadata = {
  annotations?: { [key: string]: string };
  clusterName?: string;
  creationTimestamp?: string;
  deletionGracePeriodSeconds?: number;
  deletionTimestamp?: string;
  finalizers?: string[];
  generateName?: string;
  generation?: number;
  labels?: { [key: string]: string };
  // eslint-disable-next-line
  managedFields?: any[];
  name?: string;
  namespace?: string;
  ownerReferences?: OwnerReference[];
  resourceVersion?: string;
  uid?: string;
};

// Properties common to (almost) all Kubernetes resources.
export type K8sResourceCommon = {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMetadata;
};

export type StatusCondition<ConditionType> = {
  lastTransitionTime: string;
  message: string;
  reason: string;
  status: 'True' | 'False';
  type: ConditionType;
};

export type AgentStatusConditionType =
  | 'SpecSynced'
  | 'Validated'
  | 'Connected'
  | 'ReadyForInstallation'
  | 'Installed';

export type AgentStatusCondition = StatusCondition<AgentStatusConditionType>;

export type Agent = K8sResourceCommon & {
  spec: {
    approved: boolean;
    clusterDeploymentName: {
      name: string;
      namespace: string;
    };
    role: HostRole;
    hostname: string;
  };
  status: {
    // eslint-disable-next-line
    conditions: AgentStatusCondition[];
    hostValidationInfo: ValidationsInfo;
    inventory: Inventory;
  };
};
