import React from 'react';
import { Cluster } from '../../api/types';
import ClusterHostsTable, { ClusterHostsTableProps } from './ClusterHostsTable';
import { HostDetail } from './HostRowDetail';
import HostPropertyValidationPopover from './HostPropertyValidationPopover';
import { stringToJSON } from '../../api/utils';
import { getHostRowHardwareInfo } from './hardwareInfo';
import { ValidationsInfo } from '../../types/hosts';
import { canEditDisks, getHostname, getHostRole, getInventory } from './utils';
import Hostname from './Hostname';
import RoleCell from './RoleCell';
import HardwareStatus from './HardwareStatus';
import { getDateTimeCell } from '../ui/table/utils';
import { HostsNotShowingLinkProps } from '../clusterConfiguration/DiscoveryTroubleshootingModal';

const hostToHostTableRow: ClusterHostsTableProps['hostToHostTableRow'] = (
  host,
  openRows,
  cluster,
  onEditHostname,
  canEditRole,
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
          title: <RoleCell host={host} readonly={!canEditRole?.(host)} role={hostRole} />,
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
