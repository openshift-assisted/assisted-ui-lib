import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { PageSectionVariants, PageSection } from '@patternfly/react-core';
import { Cluster } from '../../common';
import { ErrorState, LoadingState } from './ui';
import { routeBasePath } from '../config';
import { NewClusterPage } from './clusters';
import { getClusters, handleApiError } from '../api';

type SingleClusterProps = RouteComponentProps;

const SingleCluster: React.FC<SingleClusterProps> = () => {
  const [error, setError] = React.useState('');
  const [clusters, setClusters] = React.useState<Cluster[]>();

  const fetchClusters = React.useCallback(async () => {
    try {
      const { data } = await getClusters();
      setClusters(data);
    } catch (e) {
      return handleApiError(e, () => setError('Failed to fetch cluster.'));
    }
  }, [setClusters]);

  React.useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  if (error) {
    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <ErrorState title="Failed to fetch cluster." fetchData={fetchClusters} />
      </PageSection>
    );
  }

  if (!clusters) {
    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <LoadingState />
      </PageSection>
    );
  }

  if (clusters.length === 0) {
    return <NewClusterPage />;
  }

  if (clusters.length > 1) {
    // TODO(mlibra): What about Day2 cluster in single-cluster flow?
    console.warn('More than one cluster found!', clusters);
  }

  return <Redirect to={`${routeBasePath}/clusters/${clusters[0].id}`} />;
};

export default SingleCluster;
