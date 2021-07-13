import React from 'react';
import { TextContent, Text, TextVariants, Grid, GridItem } from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  RowWrapperProps,
  RowWrapper,
  IRow,
} from '@patternfly/react-table';
import { ExtraParamsType } from '@patternfly/react-table/dist/js/components/Table/base';
import { Host, Inventory, Disk, Interface, DASH } from '../../../common';
import { ValidationsInfo } from '../../../common/types/hosts';
import { WithTestID } from '../../../common';
import { getHostRowHardwareInfo } from './hardwareInfo';
import { DetailList, DetailListProps, DetailItem } from '../ui/DetailList';
import NtpValidationStatus from './NtpValidationStatus';
import DiskLimitations from './DiskLimitations';
import DiskRole from './DiskRole';
import { getHardwareTypeText, fileSize } from './utils';

type HostDetailProps = {
  canEditDisks?: (host: Host) => boolean;
  inventory: Inventory;
  host: Host;
  validationsInfo: ValidationsInfo;
};

type SectionTitleProps = {
  title: string;
};

type SectionColumnProps = {
  children: DetailListProps['children'];
};

type DisksTableProps = {
  canEditDisks?: (host: Host) => boolean;
  host: Host;
  disks: Disk[];
  installationDiskId?: string;
};

type NicsTableProps = {
  interfaces: Interface[];
};

const SectionTitle: React.FC<SectionTitleProps & WithTestID> = ({ title, testId }) => (
  <GridItem>
    <TextContent>
      <Text data-testid={testId} component={TextVariants.h3}>
        {title}
      </Text>
    </TextContent>
  </GridItem>
);

const SectionColumn: React.FC<SectionColumnProps> = ({ children }) => (
  <GridItem span={4}>
    <DetailList>{children}</DetailList>
  </GridItem>
);

const diskColumns = [
  { title: 'Name' },
  { title: 'Role' },
  { title: 'Limitations' },
  { title: 'Drive type' },
  { title: 'Size' },
  { title: 'Serial' },
  // { title: 'Vendor' }, TODO(mlibra): search HW database for humanized values
  { title: 'Model' },
  { title: 'WWN' },
];

const diskRowKey = ({ rowData }: ExtraParamsType) => rowData?.key;

const DisksTableRowWrapper = (props: RowWrapperProps) => (
  <RowWrapper {...props} data-testid={`disk-row:${props.row?.key}`} />
);

const DisksTable: React.FC<DisksTableProps & WithTestID> = ({
  canEditDisks,
  host,
  disks,
  installationDiskId,
  testId,
}) => {
  const isEditable = !!canEditDisks?.(host);
  const rows: IRow[] = disks
    .sort((diskA, diskB) => diskA.name?.localeCompare(diskB.name || '') || 0)
    .map((disk) => ({
      cells: [
        {
          title: disk.bootable ? `${disk.name} (bootable)` : disk.name,
          props: { 'data-testid': 'disk-name' },
        },
        {
          title: (
            <DiskRole
              host={host}
              disk={disk}
              installationDiskId={installationDiskId}
              isEditable={isEditable}
            />
          ),
          props: { 'data-testid': 'disk-role' },
        },
        { title: <DiskLimitations disk={disk} />, props: { 'data-testid': 'disk-limitations' } },
        { title: disk.driveType, props: { 'data-testid': 'drive-type' } },
        { title: fileSize(disk.sizeBytes || 0, 2, 'si'), props: { 'data-testid': 'disk-size' } },
        { title: disk.serial, props: { 'data-testid': 'disk-serial' } },
        // disk.vendor, TODO(mlibra): search HW database for humanized values
        { title: disk.model, props: { 'data-testid': 'disk-model' } },
        { title: disk.wwn, props: { 'data-testid': 'disk-wwn' } },
      ],
      key: disk.path,
    }));

  return (
    <Table
      data-testid={testId}
      rows={rows}
      cells={diskColumns}
      variant={TableVariant.compact}
      aria-label="Host's disks table"
      borders={false}
      rowWrapper={DisksTableRowWrapper}
    >
      <TableHeader />
      <TableBody rowKey={diskRowKey} />
    </Table>
  );
};

const nicsColumns = [
  { title: 'Name' },
  { title: 'MAC address' },
  { title: 'IPv4 address' },
  { title: 'IPv6 address' },
  { title: 'Speed' },
  // { title: 'Vendor' }, TODO(mlibra): search HW database for humanized values
  // { title: 'Product' },
];

const nicsRowKey = ({ rowData }: ExtraParamsType) => rowData?.name?.title;

const NICsTableRowWrapper = (props: RowWrapperProps) => (
  <RowWrapper {...props} data-testid={`nic-row:${props.row?.key}`} />
);

const NicsTable: React.FC<NicsTableProps & WithTestID> = ({ interfaces, testId }) => {
  const rows: IRow[] = interfaces
    .sort((nicA, nicB) => nicA.name?.localeCompare(nicB.name || '') || 0)
    .map((nic) => ({
      cells: [
        { title: nic.name, props: { 'data-testid': 'nic-name' } },
        { title: nic.macAddress, props: { 'data-testid': 'nic-mac' } },
        {
          title: (nic.ipv4Addresses || []).join(', '),
          props: { 'data-testid': 'nic-ipv4' },
        },
        {
          title: (nic.ipv6Addresses || []).join(', '),
          props: { 'data-testid': 'nic-ipv6' },
        },
        {
          title: nic.speedMbps && nic.speedMbps > 0 ? `${nic.speedMbps} Mbps` : 'N/A',
          props: { 'data-testid': 'nic-speed' },
        },
      ],
      key: nic.name,
    }));

  return (
    <Table
      data-testid={testId}
      rows={rows}
      cells={nicsColumns}
      variant={TableVariant.compact}
      aria-label="Host's network interfaces table"
      borders={false}
      rowWrapper={NICsTableRowWrapper}
    >
      <TableHeader />
      <TableBody rowKey={nicsRowKey} />
    </Table>
  );
};

export const HostDetail: React.FC<HostDetailProps> = ({
  canEditDisks,
  inventory,
  host,
  validationsInfo,
}) => {
  const { id, installationDiskId } = host;
  const rowInfo = getHostRowHardwareInfo(inventory);
  const disks = inventory.disks || [];
  const nics = inventory.interfaces || [];

  let bmcAddress = inventory.bmcAddress;
  if (inventory.bmcV6address) {
    bmcAddress = bmcAddress ? `${bmcAddress}, ${inventory.bmcV6address}` : inventory.bmcV6address;
  }
  bmcAddress = bmcAddress || DASH;

  const hardwareType = getHardwareTypeText(inventory);

  return (
    <Grid hasGutter>
      <SectionTitle testId={'host-details-section'} title="Host details" />
      <SectionColumn>
        <DetailItem testId={'uuid'} title="UUID" value={id} />
        <DetailItem
          testId={'manufacturer'}
          title="Manufacturer"
          value={inventory.systemVendor?.manufacturer || DASH}
        />
        <DetailItem
          testId={'product'}
          title="Product"
          value={inventory.systemVendor?.productName || DASH}
        />
        <DetailItem testId={'serial-number'} title="Serial number" value={rowInfo.serialNumber} />
      </SectionColumn>
      <SectionColumn>
        <DetailItem
          testId={'memory-capacity'}
          title="Memory capacity"
          value={rowInfo.memory.title}
        />
        <DetailItem
          testId={'cpu-model'}
          title="CPU model name"
          value={inventory.cpu?.modelName || DASH}
        />
        <DetailItem
          testId={'cpu-cores-and-clock'}
          title="CPU cores and clock speed"
          value={rowInfo.cpuSpeed}
        />
        <DetailItem
          testId={'cpu-arch'}
          title="CPU architecture"
          value={inventory.cpu?.architecture || DASH}
        />
      </SectionColumn>
      <SectionColumn>
        <DetailItem testId={'hw-type'} title="Hardware type" value={hardwareType} />
        <DetailItem testId={'bmc-address'} title="BMC address" value={bmcAddress} />
        <DetailItem
          testId={'boot-mode'}
          title="Boot mode"
          value={inventory.boot?.currentBootMode || DASH}
        />
        {inventory.boot?.pxeInterface && (
          <DetailItem
            testId={'pxe-interface'}
            title="PXE interface"
            value={inventory.boot?.pxeInterface}
          />
        )}
        <DetailItem
          testId={'ntp-status'}
          title="NTP status"
          value={<NtpValidationStatus validationsInfo={validationsInfo} />}
        />
      </SectionColumn>

      <SectionTitle
        testId={'disks-section'}
        title={`${disks.length} Disk${disks.length === 1 ? '' : 's'}`}
      />
      <GridItem>
        <DisksTable
          testId={'disks-table'}
          canEditDisks={canEditDisks}
          host={host}
          disks={disks}
          installationDiskId={installationDiskId}
        />
      </GridItem>

      <SectionTitle
        testId={'nics-section'}
        title={`${nics.length} NIC${nics.length === 1 ? '' : 's'}`}
      />
      <GridItem>
        <NicsTable interfaces={nics} testId={'nics-table'} />
      </GridItem>
    </Grid>
  );
};
