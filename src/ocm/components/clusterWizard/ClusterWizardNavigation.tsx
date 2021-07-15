import React from 'react';
import { WizardNav } from '@patternfly/react-core';
import { Cluster, WizardNavItem } from '../../../common';
import {
  canNextHostDiscovery,
  canNextClusterDetails,
  canNextNetwork,
  ClusterWizardStepsType,
  wizardStepsValidationsMap,
} from './wizardTransition';
import ClusterWizardContext from './ClusterWizardContext';
import { wizardStepNames } from './constants';

const wizardSteps = Object.keys(wizardStepsValidationsMap) as ClusterWizardStepsType[];

const ClusterWizardNavigation: React.FC<{ cluster?: Cluster }> = ({ cluster }) => {
  const { currentStepId, setCurrentStepId } = React.useContext(ClusterWizardContext);

  return (
    <WizardNav>
      <WizardNavItem
        key="cluster-details"
        content={wizardStepNames['cluster-details']}
        isCurrent={currentStepId === 'cluster-details'}
        isValid={() => !cluster?.validationsInfo || canNextClusterDetails({ cluster })}
        isDisabled={false}
        step={0}
        onNavItemClick={() => setCurrentStepId('cluster-details')}
      />
      <WizardNavItem
        key="host-discovery"
        content={wizardStepNames['host-discovery']}
        isDisabled={!wizardSteps.slice(1).includes(currentStepId)}
        isValid={() => !cluster || canNextHostDiscovery({ cluster })}
        isCurrent={currentStepId === 'host-discovery'}
        step={1}
        onNavItemClick={() => setCurrentStepId('host-discovery')}
      />
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
      />
    </WizardNav>
  );
};

export default ClusterWizardNavigation;
