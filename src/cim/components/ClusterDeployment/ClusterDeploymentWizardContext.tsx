import React from 'react';
import { ClusterDeploymentWizardStepsType } from './types';

type ClusterDeploymentWizardContextType = {
  currentStepId: ClusterDeploymentWizardStepsType;
  setCurrentStepId: (stepId: ClusterDeploymentWizardStepsType) => void;
};

const ClusterDeploymentWizardContext = React.createContext<ClusterDeploymentWizardContextType>({
  currentStepId: 'cluster-details',
  setCurrentStepId: () => {
    console.warn('Tried to use ClusterWizardContext but there was no provider rendered.');
  },
});

export default ClusterDeploymentWizardContext;
