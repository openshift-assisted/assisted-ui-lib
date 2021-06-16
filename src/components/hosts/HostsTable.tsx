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
import { EmptyState as DefaultEmptyState } from '../ui/uiState';
import { getColSpanRow, rowSorter } from '../ui/table/utils';
import { Host } from '../../api/types';
import sortable from '../ui/table/sortable';
import { WithTestID } from '../../types';
import { getHostname } from './utils';

import './HostsTable.css';

export type OpenRows = {
  [id: string]: boolean;
};

const defaultColumns = [
  { title: 'Hostname', transforms: [sortable], cellFormatters: [expandable] },
  { title: 'Role', transforms: [sortable] },
  { title: 'Status', transforms: [sortable] },
  { title: 'Discovered At', transforms: [sortable] },
  { title: 'CPU Cores', transforms: [sortable] }, // cores per machine (sockets x cores)
  { title: 'Memory', transforms: [sortable] },
  { title: 'Disk', transforms: [sortable] },
];

const rowKey = ({ rowData }: ExtraParamsType) => rowData?.key;
const isHostShown = (skipDisabled: boolean) => (host: Host) =>
  !skipDisabled || host.status != 'disabled';

const HostsTableRowWrapper = (props: RowWrapperProps) => (
  <RowWrapper {...props} data-testid={`host-row-${props.rowProps?.rowIndex}`} />
);

type HostsTableRow = IRow & { host: Host };

export type HostsTableProps = {
  hosts: Host[] | undefined;
  EmptyState: React.ComponentType<{}>;
  columns?: (string | ICell)[];
  hostToHostTableRow: (host: Host, openRows: OpenRows) => HostsTableRow[];
  skipDisabled?: boolean;
  actions: TableAction[];
};

export type TableAction = {
  title: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (host: Host) => Promise<any> | void;
  isVisible?: (host: Host) => boolean;
};

const HostsTable: React.FC<HostsTableProps & WithTestID> = ({
  hosts,
  hostToHostTableRow,
  columns = defaultColumns,
  skipDisabled = false,
  testId = 'hosts-table',
  EmptyState = DefaultEmptyState,
  actions,
}) => {
  const [openRows, setOpenRows] = React.useState<OpenRows>({});
  const [sortBy, setSortBy] = React.useState<ISortBy>({
    index: 1, // Hostname-column
    direction: SortByDirection.asc,
  });

  const hostRows = React.useMemo<HostsTableRow[]>(
    () =>
      _.flatten(
        (hosts || [])
          .filter(isHostShown(skipDisabled))
          .map((host) => hostToHostTableRow(host, openRows))
          .sort(rowSorter(sortBy, (row: IRow, index = 1) => row[0].cells[index - 1]))
          .map((row: IRow, index: number) => {
            row[1].parent = index * 2;
            return row;
          }),
      ),
    [hosts, skipDisabled, openRows, sortBy, hostToHostTableRow],
  );

  const rows = React.useMemo(() => {
    if (hostRows.length) {
      return hostRows;
    }
    return getColSpanRow(<EmptyState />, columns.length);
  }, [hostRows, columns]);

  const onCollapse = React.useCallback(
    (_event, rowKey) => {
      const host = hostRows[rowKey].host;
      const id = host?.id;
      if (id) {
        setOpenRows(Object.assign({}, openRows, { [id]: !openRows[id] }));
      }
    },
    [hostRows, openRows],
  );

  const actionResolver = React.useCallback(
    (rowData) => {
      const host = rowData.host;
      const hostname = getHostname(rowData.host);

      if (!host) {
        // I.e. row with detail
        return [];
      }

      return actions
        .filter((a) => (a.isVisible ? a.isVisible(host) : true))
        .map((a) => ({
          ...a,
          id: `${a.id}-${hostname}`,
          onClick: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
            a.onClick(rowData.host),
        }));
    },
    [actions],
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
      className="hosts-table"
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

export default HostsTable;
