import React from 'react';
import { WizardNav } from '@patternfly/react-core';
import WizardNavItem from '../ui/WizardNavItem';
import { wizardStepNames } from './constants';
import ClusterDeploymentWizardContext from './ClusterDeploymentWizardContext';
import { ClusterDeploymentWizardStepsType } from './types';

const wizardSteps = Object.keys(wizardStepNames) as ClusterDeploymentWizardStepsType[];

const ClusterDeploymentWizardNavigation: React.FC<{
  // cluster?: Cluster
}> = () => {
  const { currentStepId, setCurrentStepId } = React.useContext(ClusterDeploymentWizardContext);

  return (
    <WizardNav>
      <WizardNavItem
        key="cluster-details"
        content={wizardStepNames['cluster-details']}
        isCurrent={currentStepId === 'cluster-details'}
        isValid={() => true /* TOOD(mlibra) */}
        isDisabled={false}
        step={0}
        onNavItemClick={() => setCurrentStepId('cluster-details')}
      />
      <WizardNavItem
        key="networking"
        content={wizardStepNames['networking']}
        isDisabled={!wizardSteps.slice(1).includes(currentStepId)}
        isValid={
          () => true /* TODO(mlibra)*/ /* () => !cluster || canNextHostDiscovery({ cluster })*/
        }
        isCurrent={currentStepId === 'networking'}
        step={1}
        onNavItemClick={() => setCurrentStepId('networking')}
      />
      {/*
      <WizardNavItem
        content={wizardStepNames['networking']}
        step={2}
        isDisabled={!wizardSteps.slice(2).includes(currentStepId)}
        isValid={() => !cluster || canNextNetwork({ cluster })}
        key="networking"
        isCurrent={currentStepId === 'networking'}
        onNavItemClick={() => setCurrentStepId('networking')}
      />
      <WizardNavItem
        content={wizardStepNames['review']}
        step={3}
        isDisabled={!wizardSteps.slice(3).includes(currentStepId)}
        key="review"
        isCurrent={currentStepId === 'review'}
        onNavItemClick={() => setCurrentStepId('review')}
      /> */}
    </WizardNav>
  );
};

export default ClusterDeploymentWizardNavigation;
