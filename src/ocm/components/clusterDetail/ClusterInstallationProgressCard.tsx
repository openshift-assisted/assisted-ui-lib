import React from 'react';
import {
  Card,
  Title,
  CardBody,
  CardHeader,
  CardExpandableContent,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { Cluster, ClusterProgress } from '../../../common';
import ClusterHostsTable from '../hosts/ClusterHostsTable';
import ClusterDetailsButtonGroup from './ClusterDetailsButtonGroup';
import { ClusterStatusIcon } from '../clusters/ClusterStatus';
import ClusterDetailStatusVarieties, {
  useClusterStatusVarieties,
} from './ClusterDetailStatusVarieties';
import { onFetchEvents } from '../fetching/fetchEvents';

const ClusterInstallationProgressCard: React.FC<{ cluster: Cluster }> = ({ cluster }) => {
  const [isCardExpanded, setIsCardExpanded] = React.useState(cluster.status !== 'installed');
  const clusterVarieties = useClusterStatusVarieties(cluster);

  return (
    <Card data-testid="ai-cluster-details-card" isExpanded={isCardExpanded}>
      <CardHeader
        onExpand={() => setIsCardExpanded(!isCardExpanded)}
        toggleButtonProps={{
          'data-testid': 'toggle-ai-cluster-details',
          'aria-label': 'AI Cluster Details',
          'aria-labelledby': 'titleId toggle-button',
          'aria-expanded': isCardExpanded,
        }}
      >
        <Title headingLevel="h1" size="lg" className="card-title">
          Installation progress
        </Title>
        {!isCardExpanded && (
          <div className="pf-u-ml-md">
            <ClusterStatusIcon status={cluster.status} />
          </div>
        )}
      </CardHeader>
      <CardBody>
        <ClusterProgress
          cluster={cluster}
          minimizedView={!isCardExpanded}
          onFetchEvents={onFetchEvents}
        />
        <ClusterDetailsButtonGroup cluster={cluster} />
      </CardBody>
      <CardExpandableContent>
        <CardBody>
          <Grid hasGutter>
            <ClusterDetailStatusVarieties cluster={cluster} clusterVarieties={clusterVarieties} />
            <GridItem>
              <ClusterHostsTable cluster={cluster} skipDisabled />
            </GridItem>
          </Grid>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

export default ClusterInstallationProgressCard;
