import React from 'react';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ButtonVariant, Card, CardBody, CardHeader, Title } from '@patternfly/react-core';
import { store } from '../../store';
import { isSingleClusterMode, OCM_CLUSTER_LIST_LINK } from '../../config';
import { ResourceUIState, FeatureGateContextProvider } from '../../../common';
import { AlertsContextProvider } from '../AlertsContextProvider';
import { useClusterPolling, useFetchCluster } from '../clusters/clusterPolling';
import ClusterWizard from '../clusterWizard/ClusterWizard';
import { ClusterDefaultConfigurationProvider } from '../clusterConfiguration/ClusterDefaultConfigurationContext';
import { ModalDialogsContextProvider } from '../hosts/ModalDialogsContext';
import { ErrorState, LoadingState } from '../ui';
import { DiscoveryImageModal } from '../clusterConfiguration/discoveryImageModal';
import ClusterInstallationProgressCard from './ClusterInstallationProgressCard';
import CancelInstallationModal from './CancelInstallationModal';
import ResetClusterModal from './ResetClusterModal';

type AssistedInstallerDetailCardProps = {
  aiClusterId: string;
};

const errorStateActions: React.ReactNode[] = [];
if (!isSingleClusterMode()) {
  errorStateActions.push(
    <Button
      key="cancel"
      variant={ButtonVariant.secondary}
      component={(props) => <Link to={OCM_CLUSTER_LIST_LINK} {...props} />}
    >
      Back
    </Button>,
  );
}

const LoadingCard: React.FC = () => (
  <Card data-testid="ai-cluster-details-card">
    <CardHeader>
      <Title headingLevel="h1" size="lg" className="card-title">
        Loading additional details
      </Title>
    </CardHeader>
    <CardBody>
      <LoadingState />
    </CardBody>
  </Card>
);

const ClusterLoadFailed: React.FC<{ fetchCluster: () => void }> = ({ fetchCluster }) => (
  <Card data-testid="ai-cluster-details-card">
    <CardHeader>
      <Title headingLevel="h1" size="lg" className="card-title">
        Loading additional details
      </Title>
    </CardHeader>
    <CardBody>
      <ErrorState
        title="Failed to fetch the cluster"
        fetchData={fetchCluster}
        actions={errorStateActions}
      />
    </CardBody>
  </Card>
);

const LoadingDefaultConfigFailedCard: React.FC = () => (
  <Card data-testid="ai-cluster-details-card">
    <CardHeader>
      <Title headingLevel="h1" size="lg" className="card-title">
        Loading additional details
      </Title>
    </CardHeader>
    <CardBody>
      <ErrorState
        title="Failed to retrieve the default configuration"
        actions={errorStateActions}
      />
    </CardBody>
  </Card>
);

const AssistedInstallerDetailCard: React.FC<AssistedInstallerDetailCardProps> = ({
  aiClusterId,
}) => {
  const fetchCluster = useFetchCluster(aiClusterId);
  const { cluster, uiState } = useClusterPolling(aiClusterId);

  if (uiState === ResourceUIState.LOADING) {
    return <LoadingCard />;
  } else if (uiState === ResourceUIState.ERROR) {
    return <ClusterLoadFailed fetchCluster={fetchCluster} />;
  }

  if (!cluster) {
    return null;
  }

  if (cluster.status === 'adding-hosts') {
    // TODO(mlibra): So far the Day 2 is rendered in a separate tab. Merge it to a single smooth flow.
    return null;
  }

  let content;
  if (['insufficient', 'ready', 'pending-for-input'].includes(cluster.status)) {
    content = <ClusterWizard cluster={cluster} />;
  } else {
    content = <ClusterInstallationProgressCard cluster={cluster} />;
  }

  return (
    <FeatureGateContextProvider
      features={
        {
          /* TODO(mlibra): pass features from OCM */
        }
      }
    >
      <AlertsContextProvider>
        <ModalDialogsContextProvider>
          <ClusterDefaultConfigurationProvider
            loadingUI={<LoadingCard />}
            errorUI={<LoadingDefaultConfigFailedCard />}
          >
            {content}
            <CancelInstallationModal />
            <ResetClusterModal />
            <DiscoveryImageModal />
          </ClusterDefaultConfigurationProvider>
        </ModalDialogsContextProvider>
      </AlertsContextProvider>
    </FeatureGateContextProvider>
  );
};

const Wrapper: React.FC<AssistedInstallerDetailCardProps> = (props) => (
  <Provider store={store}>
    <AssistedInstallerDetailCard {...props} />
  </Provider>
);

// TODO(mlibra): The provider should go higher within the OCM hierarchy otherwise we do not have multiple cards/tabs with redux.
export default Wrapper;
