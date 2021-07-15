import React from 'react';
import _ from 'lodash';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  IRow,
  expandable,
  IRowData,
  SortByDirection,
  ISortBy,
  OnSort,
  ICell,
  RowWrapperProps,
  RowWrapper,
} from '@patternfly/react-table';
import { ExtraParamsType } from '@patternfly/react-table/dist/js/components/Table/base';
import classnames from 'classnames';
import { EmptyState as DefaultEmptyState } from '../ui/uiState';
import { getColSpanRow, rowSorter, getDateTimeCell } from '../ui/table/utils';
import { sortable } from '../ui';
import { Host, Inventory, stringToJSON } from '../../api';
import { WithTestID } from '../../types';
import HostStatus from './HostStatus';
import { HostDetail } from './HostRowDetail';
import { getHostRowHardwareInfo } from './hardwareInfo';
import RoleCell from './RoleCell';
import Hostname from './Hostname';
import HostPropertyValidationPopover from './HostPropertyValidationPopover';
import { getHostname, getHostRole } from './utils';
import { onDiskRoleType } from './DiskRole';

import './HostsTable.css';
import { ValidationInfoActionProps } from './HostValidationGroups';
import { ValidationsInfo } from '../../types/hosts';

export type OpenRows = {
  [id: string]: boolean;
};

const defaultColumns = [
  { title: 'Hostname', transforms: [sortable], cellFormatters: [expandable] },
  { title: 'Role', transforms: [sortable] },
  { title: 'Status', transforms: [sortable] },
  { title: 'Discovered at', transforms: [sortable] },
  { title: 'CPU Cores', transforms: [sortable] }, // cores per machine (sockets x cores)
  { title: 'Memory', transforms: [sortable] },
  { title: 'Disk', transforms: [sortable] },
];

const defaultHostToHostTableRow = (
  openRows: OpenRows,
  onAdditionalNtpSource: ValidationInfoActionProps['onAdditionalNtpSource'],
  AdditionalNTPSourcesDialogToggleComponent: ValidationInfoActionProps['AdditionalNTPSourcesDialogToggleComponent'],
  canEditDisks?: (host: Host) => boolean,
  onEditHostname?: (host: Host, inventory: Inventory) => void,
  canEditRole?: (host: Host) => boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditRole?: (host: Host, role?: string) => Promise<any>,
  onDiskRole?: onDiskRoleType,
) => (host: Host): IRow => {
  const { id, status, createdAt, inventory: inventoryString = '' } = host;
  const inventory = stringToJSON<Inventory>(inventoryString) || {};
  const { cores, memory, disk } = getHostRowHardwareInfo(inventory);
  const validationsInfo = stringToJSON<ValidationsInfo>(host.validationsInfo) || {};
  const memoryValidation = validationsInfo?.hardware?.find((v) => v.id === 'has-memory-for-role');
  const diskValidation = validationsInfo?.hardware?.find((v) => v.id === 'has-min-valid-disks');
  const cpuCoresValidation = validationsInfo?.hardware?.find(
    (v) => v.id === 'has-cpu-cores-for-role',
  );
  const computedHostname = getHostname(host, inventory);
  const hostRole = getHostRole(host);
  const dateTimeCell = getDateTimeCell(createdAt);

  const editHostname = onEditHostname ? () => onEditHostname(host, inventory) : undefined;
  const editRole = onEditRole ? (role?: string) => onEditRole(host, role) : undefined;

  return [
    {
      // visible row
      isOpen: !!openRows[id],
      cells: [
        {
          title: <Hostname host={host} inventory={inventory} onEditHostname={editHostname} />,
          props: { 'data-testid': 'host-name' },
          sortableValue: computedHostname || '',
        },
        {
          title: (
            <RoleCell
              host={host}
              readonly={!canEditRole?.(host)}
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
              AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggleComponent}
              onAdditionalNtpSource={onAdditionalNtpSource}
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
      inventory,
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
              canEditDisks={canEditDisks}
              onDiskRole={onDiskRole}
              inventory={inventory}
              host={host}
              validationsInfo={validationsInfo}
              AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggleComponent}
            />
          ),
        },
      ],
      key: `${host.id}-detail`,
      inventory,
    },
  ];
};

const rowKey = ({ rowData }: ExtraParamsType) => rowData?.key;
const isHostShown = (skipDisabled: boolean) => (host: Host) =>
  !skipDisabled || host.status != 'disabled';

const HostsTableRowWrapper = (props: RowWrapperProps) => (
  <RowWrapper {...props} data-testid={`host-row-${props.rowProps?.rowIndex}`} />
);

export type HostsTableProps = {
  hosts: Host[] | undefined;
  EmptyState: React.ComponentType<{}>;
  canEditRole?: (host: Host) => boolean;
  columns?: (string | ICell)[];
  hostToHostTableRow?: (
    openRows: OpenRows,
    onAdditionalNtpSource: ValidationInfoActionProps['onAdditionalNtpSource'],
    AdditionalNTPSourcesDialogToggleComponent: ValidationInfoActionProps['AdditionalNTPSourcesDialogToggleComponent'],
    canEditDisks?: (host: Host) => boolean,
    onEditHostname?: (host: Host, inventory: Inventory) => void,
    canEditRole?: (host: Host) => boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEditRole?: (host: Host, role?: string) => Promise<any>,
    onDiskRole?: onDiskRoleType,
  ) => (host: Host) => IRow;
  skipDisabled?: boolean;
  onDeleteHost?: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => void;
  onHostEnable?: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => void;
  onInstallHost?: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => void;
  onHostDisable?: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => void;
  onHostReset?: (host: Host, inventory: Inventory) => void;
  onViewHostEvents?: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => void;
  onEditHost?: (host: Host, inventory: Inventory) => void;
  onDownloadHostLogs?: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => void;
  canInstallHost?: (host: Host) => boolean;
  canEditDisks?: (host: Host) => boolean;
  onDiskRole?: onDiskRoleType;
  canEditHost?: (host: Host) => boolean;
  canEnable?: (host: Host) => boolean;
  canDisable?: (host: Host) => boolean;
  canReset?: (host: Host) => boolean;
  canDownloadHostLogs?: (host: Host) => boolean;
  canDelete?: (host: Host) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditRole?: (host: Host, role?: string) => Promise<any>;
  onAdditionalNtpSource: ValidationInfoActionProps['onAdditionalNtpSource'];
  AdditionalNTPSourcesDialogToggleComponent: ValidationInfoActionProps['AdditionalNTPSourcesDialogToggleComponent'];
  className?: string;
};

export const HostsTable: React.FC<HostsTableProps & WithTestID> = ({
  hosts,
  hostToHostTableRow = defaultHostToHostTableRow,
  columns = defaultColumns,
  skipDisabled = false,
  testId = 'hosts-table',
  onDeleteHost,
  onHostEnable,
  onInstallHost,
  onHostDisable,
  onHostReset,
  onDownloadHostLogs,
  onEditHost,
  onViewHostEvents,
  canInstallHost,
  canEditDisks,
  canEditRole,
  canEditHost,
  canEnable,
  canDisable,
  canReset,
  canDownloadHostLogs,
  canDelete,
  onEditRole,
  onDiskRole,
  EmptyState = DefaultEmptyState,
  onAdditionalNtpSource,
  AdditionalNTPSourcesDialogToggleComponent,
  className,
}) => {
  const [openRows, setOpenRows] = React.useState<OpenRows>({});
  const [sortBy, setSortBy] = React.useState<ISortBy>({
    index: 1, // Hostname-column
    direction: SortByDirection.asc,
  });

  const hostRows = React.useMemo(
    () =>
      _.flatten(
        (hosts || [])
          .filter(isHostShown(skipDisabled))
          .map(
            hostToHostTableRow(
              openRows,
              onAdditionalNtpSource,
              AdditionalNTPSourcesDialogToggleComponent,
              canEditDisks,
              onEditHost,
              canEditRole,
              onEditRole,
              onDiskRole,
            ),
          )
          .sort(rowSorter(sortBy, (row: IRow, index = 1) => row[0].cells[index - 1]))
          .map((row: IRow, index: number) => {
            row[1].parent = index * 2;
            return row;
          }),
      ),
    [
      hosts,
      skipDisabled,
      openRows,
      sortBy,
      hostToHostTableRow,
      onEditHost,
      canEditRole,
      canEditDisks,
      onEditRole,
      onDiskRole,
      onAdditionalNtpSource,
      AdditionalNTPSourcesDialogToggleComponent,
    ],
  );

  const rows = React.useMemo(() => {
    if (hostRows.length) {
      return hostRows;
    }
    return getColSpanRow(<EmptyState />, columns.length);
  }, [hostRows, columns]);

  const onCollapse = React.useCallback(
    (_event, rowKey) => {
      const host: Host = hostRows[rowKey].host;
      const id = (host && host.id) as string;
      if (id) {
        setOpenRows(Object.assign({}, openRows, { [id]: !openRows[id] }));
      }
    },
    [hostRows, openRows],
  );

  const actionResolver = React.useCallback(
    (rowData: IRowData) => {
      const host: Host | undefined = rowData.host;
      const hostname = rowData.host?.requestedHostname || rowData.inventory?.hostname;

      if (!host) {
        // I.e. row with detail
        return [];
      }

      const actions = [];

      if (onInstallHost && canInstallHost?.(host)) {
        actions.push({
          title: 'Install host',
          id: `button-install-host-${hostname}`,
          onClick: onInstallHost,
        });
      }
      if (onEditHost && canEditHost?.(host)) {
        actions.push({
          title: 'Edit host',
          id: `button-edit-host-${hostname}`, // id is everchanging, not ideal for tests
          onClick: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
            onEditHost(rowData.host, rowData.inventory),
        });
      }
      if (onHostEnable && canEnable?.(host)) {
        actions.push({
          title: 'Enable in cluster',
          id: `button-enable-in-cluster-${hostname}`,
          onClick: onHostEnable,
        });
      }
      if (onHostDisable && canDisable?.(host)) {
        actions.push({
          title: 'Disable in cluster',
          id: `button-disable-in-cluster-${hostname}`,
          onClick: onHostDisable,
        });
      }
      if (onHostReset && canReset?.(host)) {
        actions.push({
          title: 'Reset host',
          id: `button-reset-host-${hostname}`,
          onClick: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
            onHostReset(rowData.host, rowData.inventory),
        });
      }
      if (onViewHostEvents) {
        actions.push({
          title: 'View host events',
          id: `button-view-host-events-${hostname}`,
          onClick: onViewHostEvents,
        });
      }
      if (onDownloadHostLogs && canDownloadHostLogs?.(host)) {
        actions.push({
          title: 'Download host logs',
          id: `button-download-host-installation-logs-${hostname}`,
          onClick: onDownloadHostLogs,
        });
      }
      if (onDeleteHost && canDelete?.(host)) {
        actions.push({
          title: 'Delete host',
          id: `button-delete-host-${hostname}`,
          onClick: onDeleteHost,
        });
      }

      return actions;
    },
    [
      onHostEnable,
      onHostDisable,
      onViewHostEvents,
      onEditHost,
      onDownloadHostLogs,
      onInstallHost,
      onHostReset,
      onDeleteHost,
      canInstallHost,
      canDelete,
      canDisable,
      canEnable,
      canEditHost,
      canReset,
      canDownloadHostLogs,
    ],
  );

  const onSort: OnSort = React.useCallback(
    (_event, index, direction) => {
      setOpenRows({}); // collapse all
      setSortBy({
        index,
        direction,
      });
    },
    [setSortBy, setOpenRows],
  );

  return (
    <Table
      rows={rows}
      cells={columns}
      onCollapse={onCollapse}
      variant={TableVariant.compact}
      aria-label="Hosts table"
      actionResolver={actionResolver}
      className={classnames(className, 'hosts-table')}
      sortBy={sortBy}
      onSort={onSort}
      rowWrapper={HostsTableRowWrapper}
      data-testid={testId}
    >
      <TableHeader />
      <TableBody rowKey={rowKey} />
    </Table>
  );
};
