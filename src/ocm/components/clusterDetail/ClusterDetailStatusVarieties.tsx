import React from 'react';
import { GridItem } from '@patternfly/react-core';
import {
  Cluster,
  Credentials,
  getOlmOperators,
  MonitoredOperator,
  MonitoredOperatorsList,
} from '../../../common';
import ClusterCredentials from './ClusterCredentials';
import ClusterInstallationError from './ClusterInstallationError';
import FailedHostsWarning from './FailedHostsWarning';
import FailedOperatorsWarning from './FailedOperatorsWarning';
import { getClusterDetailId } from './utils';
import { getClusterCredentials } from '../../api';

type ClusterStatusVarieties = {
  credentials?: Credentials;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  credentialsError?: any;
  olmOperators: MonitoredOperatorsList;
  failedOlmOperators: MonitoredOperatorsList;
  consoleOperator?: MonitoredOperator;
  fetchCredentials: () => void;
};

export const useClusterStatusVarieties = (cluster: Cluster): ClusterStatusVarieties => {
  const [credentials, setCredentials] = React.useState<Credentials>();
  const [credentialsError, setCredentialsError] = React.useState();

  const olmOperators = getOlmOperators(cluster.monitoredOperators);
  const failedOlmOperators = olmOperators.filter((o) => o.status === 'failed');
  const consoleOperator = React.useMemo(
    () => cluster.monitoredOperators?.find((o) => o.name === 'console'),
    [cluster.monitoredOperators],
  );

  const fetchCredentials = React.useCallback(() => {
    const fetch = async () => {
      setCredentialsError(undefined);
      try {
        const response = await getClusterCredentials(cluster.id);
        setCredentials(response.data);
      } catch (err) {
        setCredentialsError(err);
      }
    };
    fetch();
  }, [cluster.id]);

  React.useEffect(() => {
    if (
      (!consoleOperator && cluster.status === 'installed') || // Retain backwards compatibility with clusters which don't have monitored clusters
      consoleOperator?.status === 'available'
    ) {
      fetchCredentials();
    }
  }, [cluster.status, consoleOperator, fetchCredentials]);

  return {
    credentials,
    credentialsError,
    olmOperators,
    failedOlmOperators,
    consoleOperator,
    fetchCredentials,
  };
};

const ClusterDetailStatusVarieties: React.FC<{
  cluster: Cluster;
  clusterVarieties: ClusterStatusVarieties;
}> = ({ cluster, clusterVarieties }) => {
  const {
    credentials,
    credentialsError,
    failedOlmOperators,
    consoleOperator,
    fetchCredentials,
  } = clusterVarieties;

  const showClusterCredentials =
    consoleOperator?.status === 'available' || (!consoleOperator && cluster.status === 'installed'); // Retain backwards compatibility with clusters which don't have monitored clusters

  return (
    <>
      {['installed', 'installing', 'installing-pending-user-action', 'finalizing'].includes(
        cluster.status,
      ) && <FailedHostsWarning cluster={cluster} />}
      {!!failedOlmOperators.length && (
        <GridItem>
          <FailedOperatorsWarning failedOperators={failedOlmOperators} />
        </GridItem>
      )}
      {cluster.status === 'error' && <ClusterInstallationError cluster={cluster} />}
      {cluster.status === 'cancelled' && (
        <ClusterInstallationError title="Cluster installation was cancelled" cluster={cluster} />
      )}
      {showClusterCredentials && (
        <ClusterCredentials
          cluster={cluster}
          credentials={credentials}
          error={!!credentialsError}
          retry={fetchCredentials}
          idPrefix={getClusterDetailId('cluster-creds')}
        />
      )}
    </>
  );
};

export default ClusterDetailStatusVarieties;
