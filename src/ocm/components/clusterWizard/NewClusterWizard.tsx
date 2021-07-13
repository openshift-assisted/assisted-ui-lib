import React from 'react';
import ClusterWizardContext from './ClusterWizardContext';
import { ClusterWizardStepsType } from './wizardTransition';
import ClusterDetails from './ClusterDetails';

const NewClusterWizard: React.FC = () => {
  const [currentStepId, setCurrentStepId] = React.useState<ClusterWizardStepsType>(
    'cluster-details',
  );

  const renderCurrentStep = React.useCallback(() => {
    switch (currentStepId) {
      // case 'welcome':
      //   return <Welcome />;
      case 'cluster-details':
      default:
        return <ClusterDetails />;
    }
  }, [currentStepId]);

  return (
    <>
      <ClusterWizardContext.Provider value={{ currentStepId, setCurrentStepId }}>
        <div className="pf-c-wizard">{renderCurrentStep()}</div>
      </ClusterWizardContext.Provider>
    </>
  );
};

export default NewClusterWizard;
