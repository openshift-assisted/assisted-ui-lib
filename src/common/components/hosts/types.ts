import { ICell } from '@patternfly/react-table';
import { Cluster } from '../../api';
import { HostsNotShowingLinkProps } from '../clusterConfiguration';
import { HostsTableProps } from './HostsTable';

export type ClusterHostsTableProps = {
  cluster: Cluster;
  columns?: (string | ICell)[];
  hostToHostTableRow?: HostsTableProps['hostToHostTableRow'];
  skipDisabled?: boolean;
  setDiscoveryHintModalOpen?: HostsNotShowingLinkProps['setDiscoveryHintModalOpen'];
};

export type HostUpdateParams = {
  hostId: string; // identifier, uuid
  hostname: string; // requested change
};
