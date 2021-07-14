import { CLUSTER_FIELD_LABELS } from '../../../common';
import { ClusterDeploymentWizardStepsType } from './types';

export const CLUSTER_DEPLOYMENT_FIELD_LABELS: { [key in string]: string } = {
  ...CLUSTER_FIELD_LABELS,
  // Wwe do not have any specific fields
};

export const wizardStepNames: {
  [key in ClusterDeploymentWizardStepsType]: string;
} = {
  'cluster-details': 'Cluster Details',
  networking: 'Installation details',
};
