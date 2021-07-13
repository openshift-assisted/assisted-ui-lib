import React from 'react';
import { Cluster, Inventory, stringToJSON } from '../../../common';
import { ClusterHostsTable } from '.';
import { HostDetail } from './HostRowDetail';
import HostPropertyValidationPopover from './HostPropertyValidationPopover';
import { HostsTableProps } from './HostsTable';
import { getHostRowHardwareInfo } from './hardwareInfo';
import { ValidationsInfo } from '../../../common/types/hosts';
import { getHostname, getHostRole } from './utils';
import Hostname from './Hostname';
import RoleCell from './RoleCell';
import HardwareStatus from './HardwareStatus';
import { getDateTimeCell } from '../ui/table/utils';
import { HostsNotShowingLinkProps } from '../clusterConfiguration/DiscoveryTroubleshootingModal';

const hostToHostTableRow: HostsTableProps['hostToHostTableRow'] = (
  openRows,
  canEditDisks,
  onEditHostname,
  canEditRole,
  onEditRole,
) => (host) => {
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
            <HardwareStatus
              host={host}
              onEditHostname={editHostname}
              validationsInfo={validationsInfo}
            />
          ),
          props: { 'data-testid': 'host-hw-status' },
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
          props: { 'data-testid': 'host-disk' },
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
              inventory={inventory}
              host={host}
              validationsInfo={validationsInfo}
            />
          ),
        },
      ],
      key: `${host.id}-detail`,
      inventory,
    },
  ];
};

type HostsDiscoveryTableProps = {
  cluster: Cluster;
  skipDisabled?: boolean;
  setDiscoveryHintModalOpen?: HostsNotShowingLinkProps['setDiscoveryHintModalOpen'];
};

const HostsDiscoveryTable: React.FC<HostsDiscoveryTableProps> = (props) => {
  return (
    <ClusterHostsTable
      {...props}
      testId={'hosts-discovery-table'}
      hostToHostTableRow={hostToHostTableRow}
    />
  );
};

export default HostsDiscoveryTable;
