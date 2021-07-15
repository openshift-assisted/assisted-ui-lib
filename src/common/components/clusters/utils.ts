import { Cluster } from '../../api';

export const isSingleNodeCluster = (cluster: Cluster) => cluster.highAvailabilityMode === 'None';
