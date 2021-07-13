import React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import EventsList from './EventsList';
import { EventList, Cluster } from '../../../common';
import ClusterEventsToolbar, {
  ClusterEventsFiltersType,
  getInitialClusterEventsFilters,
} from './ClusterEventsToolbar';
import { EmptyState } from './uiState';

export type ClusterEventsListProps = {
  events: EventList;
  cluster: Cluster;
};

const filterEvents = (
  filters: ClusterEventsFiltersType,
  events: EventList = [],
  clusterHosts: Cluster['hosts'],
) => {
  return events
    .filter((event) => filters.severity.length === 0 || filters.severity.includes(event.severity))
    .filter(
      (event) =>
        !event.hostId ||
        filters.hosts.includes(event.hostId) ||
        (filters.orphanedHosts && !(clusterHosts || []).find((host) => host.id === event.hostId)),
    )
    .filter((event) => event.hostId || filters.clusterLevel)
    .filter(
      (event) =>
        !filters.fulltext ||
        (event.message || '').toLowerCase().includes(filters.fulltext.toLowerCase()),
    );
};

const ClusterEventsList: React.FC<ClusterEventsListProps> = ({ events, cluster }) => {
  const [filters, setFilters] = React.useState<ClusterEventsFiltersType>(() =>
    getInitialClusterEventsFilters(cluster),
  );

  const filteredEvents = React.useMemo(() => filterEvents(filters, events, cluster.hosts), [
    filters,
    events,
    cluster.hosts,
  ]);

  return (
    <>
      <ClusterEventsToolbar
        filters={filters}
        setFilters={setFilters}
        cluster={cluster}
        events={events}
      />
      {filteredEvents.length === 0 && events.length > 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No matching events"
          content="There are no events that match the current filters. Adjust or clear the filters to view events."
          primaryAction={
            <Button
              variant={ButtonVariant.primary}
              onClick={() => setFilters(getInitialClusterEventsFilters(cluster))}
              id="empty-state-cluster-events-clear-filters-button"
              data-ouia-id="button-clear-events-filter"
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <EventsList events={filteredEvents} />
      )}
    </>
  );
};

export default ClusterEventsList;
