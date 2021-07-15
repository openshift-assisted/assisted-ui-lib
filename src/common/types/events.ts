import { Cluster, Event, EventList, Host } from '../api';

export type EventsEntityKind = 'cluster' | 'host';

export type ClusterEventsFiltersType = {
  fulltext: string;
  hosts: Host['id'][];
  severity: Event['severity'][];
  clusterLevel: boolean;
  orphanedHosts: boolean;
  selectAll: boolean;
};

export type EventFetchProps = {
  hostId: Event['hostId'];
  cluster: Cluster;
};

export type EventListFetchProps = EventFetchProps & {
  entityKind: EventsEntityKind;
  onFetchEvents: (
    params: {
      clusterId: Cluster['id'];
      hostId?: Host['id'];
    },
    onSuccess: (data: EventList) => void,
    onError: (message: string) => void,
  ) => Promise<void>;
};
