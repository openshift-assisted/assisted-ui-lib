import { ClusterWizardStepsType } from './wizardTransition';

export const wizardStepNames: { [key in ClusterWizardStepsType]: string } = {
  'cluster-details': 'Cluster details',
  'host-discovery': 'Host discovery',
  networking: 'Networking',
  review: 'Review and create',
};
