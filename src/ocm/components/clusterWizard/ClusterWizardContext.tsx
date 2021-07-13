import React from 'react';
import { ClusterWizardStepsType } from './wizardTransition';

type ClusterWizardContextType = {
  currentStepId: ClusterWizardStepsType;
  setCurrentStepId: (stepId: ClusterWizardStepsType) => void;
};

const ClusterWizardContext = React.createContext<ClusterWizardContextType>({
  currentStepId: 'cluster-details',
  setCurrentStepId: () => {
    console.warn('Tried to use ClusterWizardContext but there was no provider rendered.');
  },
});

export default ClusterWizardContext;
