import * as React from 'react';
import { ICell } from '@patternfly/react-table';
import { ConnectedIcon } from '@patternfly/react-icons';
import { WithTestID, Cluster, EmptyState, HostsTableProps, HostsTable } from '../../../common';
import { ClusterDeploymentHostsTablePropsActions } from './types';

const HostsTableEmptyState: React.FC<{}> = () => (
  <EmptyState
    icon={ConnectedIcon}
    title="Waiting for hosts..."
    content="Hosts may take a few minutes to appear here after booting."
    // primaryAction={<DiscoveryImageModalButton cluster={cluster} idPrefix="host-table-empty" />}
    // secondaryActions={
    //   setDiscoveryHintModalOpen && [
    //     <HostsNotShowingLink
    //       key="hosts-not-showing"
    //       setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
    //     />,
    //   ]
    // }
  />
);

type ClusterDeploymentHostsTableProps = {
  cluster: Cluster;
  columns?: (string | ICell)[];
  hostToHostTableRow?: HostsTableProps['hostToHostTableRow'];
  skipDisabled?: boolean;
} & ClusterDeploymentHostsTablePropsActions &
  WithTestID;

const ClusterDeploymentHostsTable: React.FC<ClusterDeploymentHostsTableProps> = ({
  columns,
  cluster,
  hostToHostTableRow,
  ...rest
}) => {
  /* TODO(mlibra): Implement actions, pass callbacks from higher context
      onDeleteHost: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
      onHostEnable: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      onInstallHost: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      onHostDisable: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
     const onViewHostEvents = React.useCallback(
     const onHostReset = React.useCallback(
     const onDownloadHostLogs = React.useCallback(

        canEditRole: (host: Host) => canEditRoleUtil(cluster, host.status),
        canInstallHost: (host: Host) => canInstallHostUtil(cluster, host.status),
        canEditDisks: (host: Host) => canEditDisksUtil(cluster.status, host.status),
        canEnable: (host: Host) => canEnableUtil(cluster.status, host.status),
        canDisable: (host: Host) => canDisableUtil(cluster.status, host.status),
        canDelete: (host: Host) => canDeleteUtil(cluster.status, host.status),
        canEditHost: (host: Host) => canEditHostUtil(cluster.status, host.status),
        canReset: (host: Host) => canResetUtil(cluster.status, host.status),
*/
  return (
    <>
      <HostsTable
        {...rest}
        columns={columns}
        hostToHostTableRow={hostToHostTableRow}
        hosts={cluster.hosts}
        EmptyState={HostsTableEmptyState}
        onAdditionalNtpSource={async () =>
          console.info('TODO: ClusterDeploymentHostsTable, onAdditionalNtpSource')
        }
        AdditionalNTPSourcesDialogToggleComponent={() => null}
      />
    </>
  );
};

export default ClusterDeploymentHostsTable;
