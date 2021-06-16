import { expandable, ICell, IRow, sortable } from '@patternfly/react-table';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import {
  Cluster,
  ClusterUpdateParams,
  deleteClusterHost,
  disableClusterHost,
  enableClusterHost,
  getErrorMessage,
  handleApiError,
  Host,
  HostRoleUpdateParams,
  installHost,
  patchCluster,
  resetClusterHost,
  stringToJSON,
} from '../../api';
import { forceReload, updateCluster, updateHost } from '../../reducers/clusters';
import { WithTestID } from '../../types';
import { AlertsContext } from '../AlertsContextProvider';
import {
  HostsNotShowingLink,
  HostsNotShowingLinkProps,
} from '../clusterConfiguration/DiscoveryTroubleshootingModal';
import HostsTable, { OpenRows } from './HostsTable';
import { useModalDialogsContext } from './ModalDialogsContext';
import { EmptyState } from '../ui/uiState';
import { ConnectedIcon } from '@patternfly/react-icons';
import { DiscoveryImageModalButton } from '../clusterConfiguration/discoveryImageModal';
import {
  canEditDisks,
  canEditRole,
  canInstallHost,
  downloadHostInstallationLogs,
  canEnable,
  canDisable,
  canDelete,
  canEditHost,
  canDownloadHostLogs,
  canReset,
  getHostname,
  getHostRole,
  getInventory,
} from './utils';
import {
  installHost as installHostAction,
  editHost,
  enableHost,
  disableHost,
  resetHost,
  viewHostEvents,
  downloadHostLogs,
  deleteHost,
} from './HostsTableActions';
import EditHostModal from './EditHostModal';
import { EventsModal } from '../ui/eventsModal';
import ResetHostModal from './ResetHostModal';
import DeleteHostModal from './DeleteHostModal';
import { AdditionalNTPSourcesDialog } from './AdditionalNTPSourcesDialog';
import HostsCount from './HostsCount';
import { HostUpdateParams } from './EditHostForm';
import { getDateTimeCell } from '../ui/table/utils';
import Hostname from './Hostname';
import RoleCell from './RoleCell';
import HostStatus from './HostStatus';
import HostPropertyValidationPopover from './HostPropertyValidationPopover';
import { HostDetail } from './HostRowDetail';
import { ValidationsInfo } from '../../types/hosts';
import { getHostRowHardwareInfo } from './hardwareInfo';

const defaultHostToHostTableRow: ClusterHostsTableProps['hostToHostTableRow'] = (
  host,
  openRows,
  cluster,
  onEditHostname,
  onEditRole,
) => {
  const { id, status, createdAt } = host;
  const inventory = getInventory(host);
  const { cores, memory, disk } = getHostRowHardwareInfo(inventory);
  const validationsInfo = stringToJSON<ValidationsInfo>(host.validationsInfo) || {};
  const memoryValidation = validationsInfo?.hardware?.find((v) => v.id === 'has-memory-for-role');
  const diskValidation = validationsInfo?.hardware?.find((v) => v.id === 'has-min-valid-disks');
  const cpuCoresValidation = validationsInfo?.hardware?.find(
    (v) => v.id === 'has-cpu-cores-for-role',
  );
  const computedHostname = getHostname(host);
  const hostRole = getHostRole(host);
  const dateTimeCell = getDateTimeCell(createdAt);

  const editHostname = onEditHostname ? () => onEditHostname(host) : undefined;
  const editRole = onEditRole ? (role?: string) => onEditRole(host, role) : undefined;

  return [
    {
      // visible row
      isOpen: !!openRows[id],
      cells: [
        {
          title: <Hostname host={host} onEditHostname={editHostname} />,
          props: { 'data-testid': 'host-name' },
          sortableValue: computedHostname || '',
        },
        {
          title: (
            <RoleCell
              host={host}
              readonly={!canEditRole(cluster, host.status)}
              role={hostRole}
              onEditRole={editRole}
            />
          ),
          props: { 'data-testid': 'host-role' },
          sortableValue: hostRole,
        },
        {
          title: (
            <HostStatus
              host={host}
              onEditHostname={editHostname}
              validationsInfo={validationsInfo}
            />
          ),
          props: { 'data-testid': 'host-status' },
          sortableValue: status,
        },
        {
          title: dateTimeCell.title,
          props: { 'data-testid': 'host-discovered-time' },
          sortableValue: dateTimeCell.sortableValue,
        },
        {
          title: (
            <HostPropertyValidationPopover validation={cpuCoresValidation}>
              {cores.title}
            </HostPropertyValidationPopover>
          ),
          props: { 'data-testid': 'host-cpu-cores' },
          sortableValue: cores.sortableValue,
        },
        {
          title: (
            <HostPropertyValidationPopover validation={memoryValidation}>
              {memory.title}
            </HostPropertyValidationPopover>
          ),
          props: { 'data-testid': 'host-memory' },
          sortableValue: memory.sortableValue,
        },
        {
          title: (
            <HostPropertyValidationPopover validation={diskValidation}>
              {disk.title}
            </HostPropertyValidationPopover>
          ),
          props: { 'data-testid': 'host-disks' },
          sortableValue: disk.sortableValue,
        },
      ],
      host,
      key: `${host.id}-master`,
    },
    {
      // expandable detail
      // parent will be set after sorting
      fullWidth: true,
      cells: [
        {
          title: (
            <HostDetail
              key={id}
              canEditDisks={() => canEditDisks(cluster.status, host.status)}
              inventory={inventory}
              host={host}
              validationsInfo={validationsInfo}
            />
          ),
        },
      ],
      host,
      key: `${host.id}-detail`,
    },
  ];
};

export type ClusterHostsTableProps = {
  cluster: Cluster;
  columns?: (string | ICell)[];
  hostToHostTableRow?: (
    host: Host,
    openRows: OpenRows,
    cluster: Cluster,
    onEditHostname: (host: Host) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEditRole: (host: Host, role?: string) => Promise<any>,
  ) => (IRow & { host: Host })[];
  skipDisabled?: boolean;
  setDiscoveryHintModalOpen?: HostsNotShowingLinkProps['setDiscoveryHintModalOpen'];
};

const ClusterHostsTable: React.FC<ClusterHostsTableProps & WithTestID> = ({
  columns,
  cluster,
  setDiscoveryHintModalOpen,
  hostToHostTableRow,
  skipDisabled,
}) => {
  const usedHostnames = cluster?.hosts
    ?.map((h) => h.requestedHostname)
    .filter((h) => h) as string[];
  const { addAlert } = React.useContext(AlertsContext);
  const {
    eventsDialog,
    editHostDialog,
    deleteHostDialog,
    resetHostDialog,
    additionalNTPSourcesDialog,
  } = useModalDialogsContext();
  const dispatch = useDispatch();

  const EmptyTableState = React.useCallback(
    () => (
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
    ),
    [setDiscoveryHintModalOpen, cluster],
  );

  const tableColumns = React.useMemo(
    () =>
      columns || [
        { title: 'Hostname', transforms: [sortable], cellFormatters: [expandable] },
        { title: 'Role', transforms: [sortable] },
        { title: 'Status', transforms: [sortable] },
        { title: 'Discovered At', transforms: [sortable] },
        { title: 'CPU Cores', transforms: [sortable] }, // cores per machine (sockets x cores)
        { title: 'Memory', transforms: [sortable] },
        { title: 'Disk', transforms: [sortable] },
        { title: <HostsCount cluster={cluster} inParenthesis /> },
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

  const tableRows = React.useCallback(
    (host, openRows) =>
      (hostToHostTableRow || defaultHostToHostTableRow)(
        host,
        openRows,
        cluster,
        (host: Host) =>
          editHostDialog.open({
            host,
            usedHostnames,
            onSave: async (values: HostUpdateParams) => {
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
            },
          }),
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
      ),
    [hostToHostTableRow, addAlert, cluster, dispatch, editHostDialog, usedHostnames],
  );

  const actions = React.useMemo(
    () => [
      installHostAction(
        async (host) => {
          const hostId = host.id;
          try {
            const { data } = await installHost(cluster.id, hostId);
            dispatch(updateHost(data));
          } catch (e) {
            handleApiError(e, () =>
              addAlert({ title: `Failed to enable host ${hostId}`, message: getErrorMessage(e) }),
            );
          }
        },
        (host) => canInstallHost(cluster, host.status),
      ),
      editHost(
        (host) => {
          editHostDialog.open({
            host,
            usedHostnames,
            onSave: async (values: HostUpdateParams) => {
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
            },
          });
        },
        (host) => canEditHost(cluster.status, host.status),
      ),
      enableHost(
        async (host) => {
          const hostId = host.id;
          try {
            const { data } = await enableClusterHost(cluster.id, hostId);
            dispatch(updateCluster(data));
          } catch (e) {
            handleApiError(e, () =>
              addAlert({ title: `Failed to enable host ${hostId}`, message: getErrorMessage(e) }),
            );
          }
        },
        (host) => canEnable(cluster.status, host.status),
      ),
      disableHost(
        async (host) => {
          const hostId = host.id;
          try {
            const { data } = await disableClusterHost(cluster.id, hostId);
            dispatch(updateCluster(data));
          } catch (e) {
            handleApiError(e, () =>
              addAlert({ title: `Failed to disable host ${hostId}`, message: getErrorMessage(e) }),
            );
          }
        },
        (host) => canDisable(cluster.status, host.status),
      ),
      resetHost(
        (host) => {
          const hostname = host?.requestedHostname || getInventory(host).hostname || '';
          resetHostDialog.open({ hostId: host.id, hostname });
        },
        (host) => canReset(cluster.status, host.status),
      ),
      viewHostEvents((host) => {
        const { id, requestedHostname } = host;
        const hostname = requestedHostname || getInventory(host).hostname || id;
        eventsDialog.open({ hostId: id, hostname });
      }),
      downloadHostLogs((host) => downloadHostInstallationLogs(addAlert, host), canDownloadHostLogs),
      deleteHost(
        (host) => {
          deleteHostDialog.open({
            hostId: host.id,
            hostname: host?.requestedHostname || getInventory(host)?.hostname || '',
          });
        },
        (host) => canDelete(cluster.status, host.status),
      ),
    ],
    [
      addAlert,
      cluster,
      dispatch,
      editHostDialog,
      deleteHostDialog,
      eventsDialog,
      resetHostDialog,
      usedHostnames,
    ],
  );

  return (
    <>
      <HostsTable
        skipDisabled={skipDisabled}
        columns={tableColumns}
        hosts={cluster.hosts}
        EmptyState={EmptyTableState}
        hostToHostTableRow={tableRows}
        actions={actions}
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
      <EditHostModal />
      <AdditionalNTPSourcesDialog
        cluster={cluster}
        isOpen={additionalNTPSourcesDialog.isOpen}
        onClose={additionalNTPSourcesDialog.close}
      />
    </>
  );
};

export default ClusterHostsTable;
