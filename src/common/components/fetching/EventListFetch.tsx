import React, { useEffect, useState } from 'react';
import { EventList } from '../../api';
import { EVENTS_POLLING_INTERVAL } from '../../config';
import { EventListFetchProps } from '../../types';

// avoid circular dep
import { ErrorState, LoadingState } from '../ui/uiState';
import EventsList from '../ui/EventsList';
import ClusterEventsList from '../ui/ClusterEventsList';

export const EventListFetch: React.FC<EventListFetchProps> = ({ onFetchEvents, ...props }) => {
  const [events, setEvents] = useState<EventList>();
  const [lastPolling, setLastPolling] = useState(0);
  const [error, setError] = useState('');

  const { cluster, hostId, entityKind } = props;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    onFetchEvents(
      {
        clusterId: cluster.id,
        hostId,
      },
      (events: EventList) => {
        setEvents(events);
        setError('');
        timer = setTimeout(() => setLastPolling(Date.now()), EVENTS_POLLING_INTERVAL);
      },
      setError,
    );

    return () => clearTimeout(timer);
  }, [lastPolling, cluster.id, hostId, onFetchEvents]);

  const forceRefetch = React.useCallback(() => {
    setLastPolling(Date.now());
  }, [setLastPolling]);

  if (error) {
    return <ErrorState title={error} fetchData={forceRefetch} />;
  }

  if (!events) {
    return <LoadingState />;
  }

  if (entityKind === 'cluster') {
    return <ClusterEventsList events={events} cluster={cluster} />;
  }

  return <EventsList events={events} />;
};
