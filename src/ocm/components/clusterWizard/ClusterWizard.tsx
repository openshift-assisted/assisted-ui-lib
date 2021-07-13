import React from 'react';
import { useHistory } from 'react-router-dom';
import { Cluster } from '../../../common';
import NetworkConfigurationForm from '../clusterConfiguration/NetworkConfigurationForm';
import ReviewStep from '../clusterConfiguration/ReviewStep';
import ClusterWizardContext from './ClusterWizardContext';
import {
  ClusterWizardFlowStateType,
  ClusterWizardStepsType,
  getClusterWizardFirstStep,
} from './wizardTransition';
import ClusterDetails from './ClusterDetails';
import HostDiscovery from './HostDiscovery';

type ClusterWizardProps = {
  cluster: Cluster;
};

const ClusterWizard: React.FC<ClusterWizardProps> = ({ cluster }) => {
  const history = useHistory();
  const [currentStepId, setCurrentStepId] = React.useState<ClusterWizardStepsType>(() =>
    getClusterWizardFirstStep(history.location.state as ClusterWizardFlowStateType),
  );

  const renderCurrentStep = React.useCallback(() => {
    switch (currentStepId) {
      case 'host-discovery':
        return <HostDiscovery cluster={cluster} />;
      case 'networking':
        return <NetworkConfigurationForm cluster={cluster} />;
      case 'review':
        return <ReviewStep cluster={cluster} />;
      case 'cluster-details':
      default:
        return <ClusterDetails cluster={cluster} />;
    }
  }, [currentStepId, cluster]);

  return (
    <>
      <ClusterWizardContext.Provider value={{ currentStepId, setCurrentStepId }}>
        <div className="pf-c-wizard">{renderCurrentStep()}</div>
      </ClusterWizardContext.Provider>
    </>
  );
};

export default ClusterWizard;
