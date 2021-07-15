import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ConnectedIcon } from '@patternfly/react-icons';
import { expandable, IRowData, sortable } from '@patternfly/react-table';
import { DiscoveryImageModalButton } from '../clusterConfiguration/discoveryImageModal';
import {
  canEditDisks as canEditDisksUtil,
  canEditRole as canEditRoleUtil,
  canInstallHost as canInstallHostUtil,
  canEnable as canEnableUtil,
  canDisable as canDisableUtil,
  canDelete as canDeleteUtil,
  canEditHost as canEditHostUtil,
  canDownloadHostLogs,
  canReset as canResetUtil,
  HostsTable,
  EditHostModal,
} from '../../../common/components/hosts';
import {
  AlertsContext,
  Cluster,
  ClusterHostsTableProps,
  ClusterUpdateParams,
  Disk,
  DiskConfigParams,
  DiskRole,
  EmptyState,
  Host,
  HostRoleUpdateParams,
  Inventory,
  WithTestID,
  HostsNotShowingLink,
  HostsNotShowingLinkProps,
  HostsCount,
} from '../../../common';
import { forceReload, updateCluster, updateHost } from '../../reducers/clusters';
import { EventsModal } from '../ui/eventsModal';
import { useModalDialogsContext } from './ModalDialogsContext';
import ResetHostModal from './ResetHostModal';
import DeleteHostModal from './DeleteHostModal';
import {
  deleteClusterHost,
  disableClusterHost,
  enableClusterHost,
  getErrorMessage,
  handleApiError,
  installHost,
  patchCluster,
  resetClusterHost,
} from '../../api';
import { downloadHostInstallationLogs, onAdditionalNtpSourceAction } from './utils';
import { ValidationInfoActionProps } from '../../../common/components/hosts/HostValidationGroups';
import { AdditionalNTPSourcesDialog } from '../../../common/components/hosts/AdditionalNTPSourcesDialog';
import { AdditionalNTPSourcesDialogToggle } from './AdditionaNTPSourceDialogToggle';
import { HostUpdateParams } from '../../../common/components/hosts/EditHostForm';

type HostsTableEmptyStateProps = {
  cluster: Cluster;
  setDiscoveryHintModalOpen?: HostsNotShowingLinkProps['setDiscoveryHintModalOpen'];
};

const HostsTableEmptyState: React.FC<HostsTableEmptyStateProps> = ({
  cluster,
  setDiscoveryHintModalOpen,
}) => (
  <EmptyState
    icon={ConnectedIcon}
    title="Waiting for hosts..."
    content="Hosts may take a few minutes to appear here after booting."
    primaryAction={<DiscoveryImageModalButton cluster={cluster} idPrefix="host-table-empty" />}
    secondaryActions={
      setDiscoveryHintModalOpen && [
        <HostsNotShowingLink
          key="hosts-not-showing"
          setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
        />,
      ]
    }
  />
);

const ClusterHostsTable: React.FC<ClusterHostsTableProps & WithTestID> = ({
  columns,
  cluster,
  setDiscoveryHintModalOpen,
  hostToHostTableRow,
  ...rest
}) => {
  const { addAlert } = React.useContext(AlertsContext);
  const {
    eventsDialog,
    editHostDialog,
    deleteHostDialog,
    resetHostDialog,
    additionalNTPSourcesDialog,
  } = useModalDialogsContext();
  const dispatch = useDispatch();

  const hostActions = React.useMemo(
    () => ({
      onDeleteHost: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
        deleteHostDialog.open({
          hostId: rowData.host.id,
          hostname: rowData.host?.requestedHostname || rowData.inventory?.hostname,
        }),
      onHostEnable: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
        const hostId = rowData.host.id;
        try {
          const { data } = await enableClusterHost(cluster.id, hostId);
          dispatch(updateCluster(data));
        } catch (e) {
          handleApiError(e, () =>
            addAlert({ title: `Failed to enable host ${hostId}`, message: getErrorMessage(e) }),
          );
        }
      },
      onInstallHost: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
        const hostId = rowData.host.id;
        try {
          const { data } = await installHost(cluster.id, hostId);
          dispatch(updateHost(data));
        } catch (e) {
          handleApiError(e, () =>
            addAlert({ title: `Failed to enable host ${hostId}`, message: getErrorMessage(e) }),
          );
        }
      },
      onHostDisable: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
        const hostId = rowData.host.id;
        try {
          const { data } = await disableClusterHost(cluster.id, hostId);
          dispatch(updateCluster(data));
        } catch (e) {
          handleApiError(e, () =>
            addAlert({ title: `Failed to disable host ${hostId}`, message: getErrorMessage(e) }),
          );
        }
      },
    }),
    [cluster.id, dispatch, addAlert, deleteHostDialog],
  );

  const onViewHostEvents = React.useCallback(
    (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      const host = rowData.host;
      const { id, requestedHostname } = host;
      const hostname = requestedHostname || rowData.inventory?.hostname || id;
      eventsDialog.open({ hostId: id, hostname });
    },
    [eventsDialog],
  );

  const onEditHost = React.useCallback(
    (host: Host, inventory: Inventory) => {
      editHostDialog.open({ host, inventory });
    },
    [editHostDialog],
  );

  const onHostReset = React.useCallback(
    (host: Host, inventory: Inventory) => {
      const hostname = host?.requestedHostname || inventory?.hostname || '';
      resetHostDialog.open({ hostId: host.id, hostname });
    },
    [resetHostDialog],
  );

  const onDownloadHostLogs = React.useCallback(
    (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
      downloadHostInstallationLogs(addAlert, rowData.host),
    [addAlert],
  );

  const onDiskRole = async (hostId: Host['id'], diskId: Disk['id'], role: DiskRole) => {
    const params: ClusterUpdateParams = {};
    params.disksSelectedConfig = [
      { id: hostId, disksConfig: [{ id: diskId, role } as DiskConfigParams] },
    ];

    try {
      const { data } = await patchCluster(cluster.id, params);
      dispatch(updateCluster(data));
    } catch (e) {
      handleApiError(e, () =>
        addAlert({ title: 'Failed to set disk role', message: getErrorMessage(e) }),
      );
    }
  };

  const onAdditionalNtpSource: ValidationInfoActionProps['onAdditionalNtpSource'] = async (
    ...args
  ) => await onAdditionalNtpSourceAction(dispatch, cluster.id, ...args);

  const EmptyState = React.useCallback(
    () => (
      <HostsTableEmptyState
        cluster={cluster}
        setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
      />
    ),
    [setDiscoveryHintModalOpen, cluster],
  );

  const [tableColumns, actionChecks] = React.useMemo(
    () => [
      columns || [
        { title: 'Hostname', transforms: [sortable], cellFormatters: [expandable] },
        { title: 'Role', transforms: [sortable] },
        { title: 'Status', transforms: [sortable] },
        { title: 'Discovered at', transforms: [sortable] },
        { title: 'CPU Cores', transforms: [sortable] }, // cores per machine (sockets x cores)
        { title: 'Memory', transforms: [sortable] },
        { title: 'Disk', transforms: [sortable] },
        { title: <HostsCount cluster={cluster} inParenthesis /> },
      ],
      {
        canEditRole: (host: Host) => canEditRoleUtil(cluster, host.status),
        canInstallHost: (host: Host) => canInstallHostUtil(cluster, host.status),
        canEditDisks: (host: Host) => canEditDisksUtil(cluster.status, host.status),
        canEnable: (host: Host) => canEnableUtil(cluster.status, host.status),
        canDisable: (host: Host) => canDisableUtil(cluster.status, host.status),
        canDelete: (host: Host) => canDeleteUtil(cluster.status, host.status),
        canEditHost: (host: Host) => canEditHostUtil(cluster.status, host.status),
        canReset: (host: Host) => canResetUtil(cluster.status, host.status),
      },
    ],
    [cluster, columns],
  );

  const onReset = React.useCallback(() => {
    const reset = async (hostId: string | undefined) => {
      if (hostId) {
        try {
          const { data } = await resetClusterHost(cluster.id, hostId);
          dispatch(updateHost(data));
        } catch (e) {
          return handleApiError(e, () =>
            addAlert({
              title: `Failed to reset host ${hostId}`,
              message: getErrorMessage(e),
            }),
          );
        }
      }
    };
    reset(resetHostDialog.data?.hostId);
    resetHostDialog.close();
  }, [addAlert, cluster.id, dispatch, resetHostDialog]);

  const onDelete = React.useCallback(() => {
    const deleteHost = async (hostId: string | undefined) => {
      if (hostId) {
        try {
          await deleteClusterHost(cluster.id, hostId);
          dispatch(forceReload());
        } catch (e) {
          return handleApiError(e, () =>
            addAlert({
              title: `Failed to delete host ${hostId}`,
              message: getErrorMessage(e),
            }),
          );
        }
      }
    };
    deleteHost(deleteHostDialog.data?.hostId);
    deleteHostDialog.close();
  }, [addAlert, cluster.id, dispatch, deleteHostDialog]);

  const onEditRole = React.useCallback(
    async ({ id, clusterId }: Host, role?: string) => {
      const params: ClusterUpdateParams = {};
      params.hostsRoles = [{ id, role: role as HostRoleUpdateParams }];
      try {
        const { data } = await patchCluster(clusterId as string, params);
        dispatch(updateCluster(data));
      } catch (e) {
        handleApiError(e, () =>
          addAlert({ title: 'Failed to set role', message: getErrorMessage(e) }),
        );
      }
    },
    [addAlert, dispatch],
  );

  return (
    <>
      <HostsTable
        {...rest}
        {...hostActions}
        {...actionChecks}
        columns={tableColumns}
        hosts={cluster.hosts}
        EmptyState={EmptyState}
        onHostReset={onHostReset}
        onViewHostEvents={onViewHostEvents}
        onEditHost={onEditHost}
        onDownloadHostLogs={onDownloadHostLogs}
        hostToHostTableRow={hostToHostTableRow}
        canDownloadHostLogs={canDownloadHostLogs}
        onEditRole={onEditRole}
        onDiskRole={onDiskRole}
        onAdditionalNtpSource={onAdditionalNtpSource}
        AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggle}
      />
      <EventsModal
        title={`Host Events${eventsDialog.isOpen ? `: ${eventsDialog.data?.hostname}` : ''}`}
        entityKind="host"
        cluster={cluster}
        hostId={eventsDialog.data?.hostId}
        onClose={eventsDialog.close}
        isOpen={eventsDialog.isOpen}
      />
      <ResetHostModal
        hostname={resetHostDialog.data?.hostname}
        onClose={resetHostDialog.close}
        isOpen={resetHostDialog.isOpen}
        onReset={onReset}
      />
      <DeleteHostModal
        hostname={deleteHostDialog.data?.hostname}
        onClose={deleteHostDialog.close}
        isOpen={deleteHostDialog.isOpen}
        onDelete={onDelete}
      />
      <EditHostModal
        host={editHostDialog.data?.host}
        inventory={editHostDialog.data?.inventory}
        usedHostnames={
          cluster?.hosts?.map((h: Host) => h.requestedHostname).filter((h) => h) as
            | string[]
            | undefined
        }
        onClose={editHostDialog.close}
        isOpen={editHostDialog.isOpen}
        onSave={async (values: HostUpdateParams) => {
          const params: ClusterUpdateParams = {
            hostsNames: [
              {
                id: values.hostId,
                hostname: values.hostname,
              },
            ],
          };

          const { data } = await patchCluster(cluster.id, params);
          dispatch(updateCluster(data));
          editHostDialog.close();
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFormSaveError={(e: any) => {
          let message;
          handleApiError(e, () => (message = getErrorMessage(e)));
          return message;
        }}
      />
      <AdditionalNTPSourcesDialog
        cluster={cluster}
        isOpen={additionalNTPSourcesDialog.isOpen}
        onClose={additionalNTPSourcesDialog.close}
        onAdditionalNtpSource={onAdditionalNtpSource}
      />
    </>
  );
};

export default ClusterHostsTable;
