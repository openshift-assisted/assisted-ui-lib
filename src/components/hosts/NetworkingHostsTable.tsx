import React from 'react';
import { sortable, expandable } from '@patternfly/react-table';
import { Cluster, Interface } from '../../api/types';
import { ClusterHostsTable } from '.';
import { HostDetail } from './HostRowDetail';
import { stringToJSON } from '../../api/utils';
import { ValidationsInfo } from '../../types/hosts';
import { canEditDisks, getHostname, getHostRole, getInventory } from './utils';
import Hostname from './Hostname';
import { DASH } from '../constants';
import { HostsNotShowingLinkProps } from '../clusterConfiguration/DiscoveryTroubleshootingModal';
import HostsCount from './HostsCount';
import NetworkingStatus from './NetworkingStatus';
import { getSubnet } from '../clusterConfiguration/utils';
import { Address4, Address6 } from 'ip-address';
import RoleCell from './RoleCell';
import { ClusterHostsTableProps } from './ClusterHostsTable';

const getSelectedNic = (nics: Interface[], currentSubnet: Address4 | Address6) => {
  return nics.find((nic) => {
    const ipv4Addresses = (nic.ipv4Addresses || []).reduce<Address4[]>((addresses, address) => {
      if (Address4.isValid(address)) {
        addresses.push(new Address4(address));
      }
      return addresses;
    }, []);

    if (ipv4Addresses.find((address) => address.isInSubnet(currentSubnet))) {
      return true;
    }

    const ipv6Addresses = (nic.ipv6Addresses || []).reduce<Address6[]>((addresses, address) => {
      if (Address6.isValid(address)) {
        addresses.push(new Address6(address));
      }
      return addresses;
    }, []);

    return ipv6Addresses.find((address) => address.isInSubnet(currentSubnet));
  });
};

const getColumns = (cluster: Cluster) => [
  { title: 'Hostname', transforms: [sortable], cellFormatters: [expandable] },
  { title: 'Role', transforms: [sortable] },
  { title: 'Status', transforms: [sortable] },
  { title: 'Active NIC', transforms: [sortable] }, // cores per machine (sockets x cores)
  { title: 'IPv4 address', transforms: [sortable] },
  { title: 'IPv6 address', transforms: [sortable] },
  { title: 'MAC address', transforms: [sortable] },
  { title: <HostsCount cluster={cluster} inParenthesis /> },
];

const hostToHostTableRow: ClusterHostsTableProps['hostToHostTableRow'] = (
  host,
  openRows,
  cluster,
  onEditHostname,
) => {
  const { id, status } = host;
  const inventory = getInventory(host);
  const validationsInfo = stringToJSON<ValidationsInfo>(host.validationsInfo) || {};
  const nics = inventory.interfaces || [];

  const currentSubnet = cluster.machineNetworkCidr ? getSubnet(cluster.machineNetworkCidr) : null;
  const selectedNic = currentSubnet ? getSelectedNic(nics, currentSubnet) : null;

  const computedHostname = getHostname(host);
  const hostRole = getHostRole(host);

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
          title: <RoleCell host={host} readonly role={hostRole} />,
          props: { 'data-testid': 'host-role' },
          sortableValue: hostRole,
        },
        {
          title: (
            <NetworkingStatus
              host={host}
              onEditHostname={editHostname}
              validationsInfo={validationsInfo}
            />
          ),
          props: { 'data-testid': 'nic-status' },
          sortableValue: status,
        },
        {
          title: selectedNic?.name || DASH,
          props: { 'data-testid': 'nic-name' },
          sortableValue: selectedNic?.name || DASH,
        },
        {
          title: (selectedNic?.ipv4Addresses || []).join(', ') || DASH,
          props: { 'data-testid': 'nic-ipv4' },
          sortableValue: (selectedNic?.ipv4Addresses || []).join(', ') || DASH,
        },
        {
          title: (selectedNic?.ipv6Addresses || []).join(', ') || DASH,
          props: { 'data-testid': 'nic-ipv6' },
          sortableValue: (selectedNic?.ipv6Addresses || []).join(', ') || DASH,
        },
        {
          title: selectedNic?.macAddress || DASH,
          props: { 'data-testid': 'nic-mac-address' },
          sortableValue: selectedNic?.macAddress || DASH,
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

type NetworkingHostsTableProps = {
  cluster: Cluster;
  skipDisabled?: boolean;
  setDiscoveryHintModalOpen?: HostsNotShowingLinkProps['setDiscoveryHintModalOpen'];
};

const NetworkingHostsTable: React.FC<NetworkingHostsTableProps> = (props) => {
  const columns = React.useMemo(() => getColumns(props.cluster), [props.cluster]);
  return (
    <ClusterHostsTable
      {...props}
      testId={'networking-host-table'}
      columns={columns}
      hostToHostTableRow={hostToHostTableRow}
    />
  );
};

export default NetworkingHostsTable;
