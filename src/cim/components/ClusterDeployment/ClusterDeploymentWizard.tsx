import * as React from 'react';
import { AlertsContextProvider } from '../AlertsContextProvider';
import { ClusterDeploymentWizardProps, ClusterDeploymentWizardStepsType } from './types';
import ClusterDeploymentWizardContext from './ClusterDeploymentWizardContext';
import ClusterDeploymentDetailsStep from './ClusterDeploymentDetailsStep';
import ClusterDeploymentNetworkingStep from './ClusterDeploymentNetworkingStep';

const ClusterDeploymentWizard: React.FC<ClusterDeploymentWizardProps> = ({
  className = '',
  onSaveDetails,
  onSaveNetworking,
  onClose,
  onEditHost,
  canEditHost,
  onEditRole,
  canEditRole,
  cluster,
  ocpVersions,
  defaultPullSecret,
  usedClusterNames,
}) => {
  const [currentStepId, setCurrentStepId] = React.useState<ClusterDeploymentWizardStepsType>(
    'cluster-details',
  );
  const renderCurrentStep = React.useCallback(() => {
    switch (currentStepId) {
      case 'networking':
        if (cluster) {
          return (
            <ClusterDeploymentNetworkingStep
              cluster={cluster}
              onSaveNetworking={onSaveNetworking}
              onClose={onClose}
              onEditHost={onEditHost}
              canEditHost={canEditHost}
              onEditRole={onEditRole}
              canEditRole={canEditRole}
              // TODO(mlibra) Add more networking-table actions here
            />
          );
        }

        console.log(`Missing the AI Cluster object for the ${currentStepId} step, waiting ...`);
      // falls through to default
      case 'cluster-details':
      default:
        return (
          <ClusterDeploymentDetailsStep
            defaultPullSecret={defaultPullSecret}
            ocpVersions={ocpVersions}
            usedClusterNames={usedClusterNames}
            cluster={cluster}
            onSaveDetails={onSaveDetails}
            onClose={onClose}
          />
        );
    }
  }, [
    currentStepId,
    cluster,
    defaultPullSecret,
    ocpVersions,
    usedClusterNames,
    onSaveDetails,
    onSaveNetworking,
    onClose,
    onEditHost,
    canEditHost,
    onEditRole,
    canEditRole,
  ]);

  return (
    <AlertsContextProvider>
      <ClusterDeploymentWizardContext.Provider value={{ currentStepId, setCurrentStepId }}>
        <div className={`pf-c-wizard ${className}`}>{renderCurrentStep()}</div>
      </ClusterDeploymentWizardContext.Provider>
    </AlertsContextProvider>
  );
};

export default ClusterDeploymentWizard;
