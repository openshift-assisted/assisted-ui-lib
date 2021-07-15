import React from 'react';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import {
  PageSection,
  PageSectionVariants,
  ButtonVariant,
  Button,
  TextContent,
  Text,
} from '@patternfly/react-core';
import {
  ResourceUIState,
  Cluster,
  ErrorState,
  LoadingState,
  AlertsContextProvider,
  AddHostsContextProvider,
} from '../../../common';
import ClusterDetail from '../clusterDetail/ClusterDetail';
import CancelInstallationModal from '../clusterDetail/CancelInstallationModal';
import ResetClusterModal from '../clusterDetail/ResetClusterModal';
import { AddHosts } from '../AddHosts';
import { ClusterDefaultConfigurationProvider } from '../clusterConfiguration/ClusterDefaultConfigurationContext';
import ClusterBreadcrumbs from './ClusterBreadcrumbs';
import ClusterWizard from '../clusterWizard/ClusterWizard';
import { ModalDialogsContextProvider } from '../hosts/ModalDialogsContext';
import { useClusterPolling, useFetchCluster } from './clusterPolling';
import { DiscoveryImageModal } from '../clusterConfiguration/discoveryImageModal';
import { isSingleClusterMode, routeBasePath } from '../../config';

type MatchParams = {
  clusterId: string;
};

const ClusterPage: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const { clusterId } = match.params;
  const fetchCluster = useFetchCluster(clusterId);
  const { cluster, uiState, errorDetail } = useClusterPolling(clusterId);

  const errorStateActions = [];
  if (!isSingleClusterMode()) {
    errorStateActions.push(
      <Button
        key="cancel"
        variant={ButtonVariant.secondary}
        component={(props) => <Link to={`${routeBasePath}/clusters`} {...props} />}
      >
        Back
      </Button>,
    );
  }

  const getContent = (cluster: Cluster) => {
    if (cluster.status === 'adding-hosts') {
      return (
        <AddHostsContextProvider cluster={cluster}>
          <AddHosts />
        </AddHostsContextProvider>
      );
    } else if (
      [
        'preparing-for-installation',
        'installing',
        'installing-pending-user-action',
        'finalizing',
        'installed',
        'error',
        'cancelled',
      ].includes(cluster.status)
    ) {
      return (
        <>
          <ClusterBreadcrumbs clusterName={cluster.name} />
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">{cluster.name}</Text>
            </TextContent>
          </PageSection>
          <PageSection variant={PageSectionVariants.light} isFilled>
            <ClusterDetail cluster={cluster} />
          </PageSection>
        </>
      );
    } else {
      return (
        <>
          <ClusterBreadcrumbs clusterName={cluster.name} />
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Install OpenShift with the Assisted Installer</Text>
            </TextContent>
          </PageSection>
          <PageSection variant={PageSectionVariants.light}>
            <ClusterWizard cluster={cluster} />
          </PageSection>
        </>
      );
    }
  };

  const loadingUI = (
    <PageSection variant={PageSectionVariants.light} isFilled>
      <LoadingState />
    </PageSection>
  );

  if (uiState === ResourceUIState.LOADING) {
    return loadingUI;
  }

  if (uiState === ResourceUIState.ERROR) {
    if (Number(errorDetail?.code) === 404) {
      return <Redirect to={`${routeBasePath}/clusters`} />;
    }

    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <ErrorState
          title="Failed to fetch the cluster"
          fetchData={
            Number(errorDetail?.code) === 401 ? () => window.location.reload() : fetchCluster
          }
          actions={errorStateActions}
        />
      </PageSection>
    );
  }

  const errorUI = (
    <PageSection variant={PageSectionVariants.light} isFilled>
      <ErrorState
        title="Failed to retrieve the default configuration"
        actions={errorStateActions}
      />
    </PageSection>
  );

  if (cluster) {
    return (
      <AlertsContextProvider>
        <ModalDialogsContextProvider>
          <ClusterDefaultConfigurationProvider loadingUI={loadingUI} errorUI={errorUI}>
            {getContent(cluster)}
            <CancelInstallationModal />
            <ResetClusterModal />
            <DiscoveryImageModal />
          </ClusterDefaultConfigurationProvider>
        </ModalDialogsContextProvider>
      </AlertsContextProvider>
    );
  }

  return <Redirect to="/clusters" />;
};

export default ClusterPage;
