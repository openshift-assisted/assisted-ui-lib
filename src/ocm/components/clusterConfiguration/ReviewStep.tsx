import React from 'react';
import { useDispatch } from 'react-redux';
import { ButtonVariant, Grid, GridItem } from '@patternfly/react-core';
import { Cluster, ToolbarButton } from '../../../common';
import ClusterWizardStep from '../clusterWizard/ClusterWizardStep';
import { useAlerts } from '../AlertsContextProvider';
import ClusterWizardContext from '../clusterWizard/ClusterWizardContext';
import { getErrorMessage, handleApiError, postInstallCluster } from '../../api';
import { updateCluster } from '../../reducers/clusters/currentClusterSlice';
import ClusterWizardStepHeader from '../clusterWizard/ClusterWizardStepHeader';
import ClusterWizardFooter from '../clusterWizard/ClusterWizardFooter';
import ClusterWizardNavigation from '../clusterWizard/ClusterWizardNavigation';
import ReviewCluster from './ReviewCluster';

const ReviewStep: React.FC<{ cluster: Cluster }> = ({ cluster }) => {
  const { addAlert } = useAlerts();
  const { setCurrentStepId } = React.useContext(ClusterWizardContext);
  const [isStartingInstallation, setIsStartingInstallation] = React.useState(false);
  const dispatch = useDispatch();

  const handleClusterInstall = async () => {
    setIsStartingInstallation(true);
    try {
      const { data } = await postInstallCluster(cluster.id);
      dispatch(updateCluster(data));
      setIsStartingInstallation(false);
      // If successful, backend changes cluster state which leads to unmounting the Wizard
      // If validation fails, the wizard stays on this step and shows alerts
    } catch (e) {
      handleApiError(e, () =>
        addAlert({
          title: 'Failed to start cluster installation',
          message: getErrorMessage(e),
        }),
      );
      setIsStartingInstallation(false);
    }
  };

  const footer = (
    <ClusterWizardFooter
      cluster={cluster}
      onBack={() => setCurrentStepId('networking')}
      isSubmitting={isStartingInstallation}
      submittingText="Starting installation..."
      additionalActions={
        <ToolbarButton
          variant={ButtonVariant.primary}
          name="install"
          onClick={handleClusterInstall}
          isDisabled={isStartingInstallation || cluster.status !== 'ready'}
        >
          Install cluster
        </ToolbarButton>
      }
    />
  );

  return (
    <ClusterWizardStep navigation={<ClusterWizardNavigation cluster={cluster} />} footer={footer}>
      <Grid hasGutter>
        <GridItem>
          <ClusterWizardStepHeader cluster={cluster}>Review and create</ClusterWizardStepHeader>
        </GridItem>
        <GridItem>
          <ReviewCluster cluster={cluster} />
        </GridItem>

        {/* TODO(mlibra): Implement in context of the initial configuration selection
        <GridItem span={12} lg={10} xl={9} xl2={7}>
          <TextContent>
            <Text component="h2">Capability level</Text>
          </TextContent>
        </GridItem>
        */}

        {/* TODO(mlibra): Show YAML manifests
         <GridItem span={12} lg={10} xl={9} xl2={7}>
         <ExpandableSection>
         </ExpandableSection>
         </GridItem>
        */}
      </Grid>
    </ClusterWizardStep>
  );
};

export default ReviewStep;
