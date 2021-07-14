import React, { useEffect, useState } from 'react';
import EventsList from '../ui/EventsList';
import {
  EventList,
  Event,
  Cluster,
  EVENTS_POLLING_INTERVAL,
  ErrorState,
  LoadingState,
} from '../../../common';
import { getEvents } from '../../api/clusters';
import ClusterEventsList from '../ui/ClusterEventsList';
import { handleApiError } from '../../api';

export type EventFetchProps = {
  hostId: Event['hostId'];
  cluster: Cluster;
};

export type EventsEntityKind = 'cluster' | 'host';

type EventListFetchProps = EventFetchProps & {
  entityKind: EventsEntityKind;
};

const EventListFetch: React.FC<EventListFetchProps> = ({ cluster, hostId, entityKind }) => {
  const [events, setEvents] = useState<EventList>();
  const [lastPolling, setLastPolling] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetch = async () => {
      try {
        const { data } = await getEvents(cluster.id, hostId);
        setEvents(data);
        setError('');
      } catch (error) {
        handleApiError(error, () => {
          setError('Failed to load events');
        });
      }
      timer = setTimeout(() => setLastPolling(Date.now()), EVENTS_POLLING_INTERVAL);
    };
    fetch();
    return () => clearTimeout(timer);
  }, [cluster.id, hostId, lastPolling, entityKind]);

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

export default EventListFetch;
