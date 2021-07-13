import React from 'react';
import { Table, TableBody, TableVariant } from '@patternfly/react-table';
import { Cluster, Host, Inventory, stringToJSON } from '../../../common';
import { getSimpleHardwareInfo } from '../hosts/hardwareInfo';
import { DetailList, DetailItem } from '../ui/DetailList';
import { ClusterValidations, HostsValidations } from './ReviewValidations';
import { fileSize, getEnabledHosts } from '../hosts/utils';

import './ReviewCluster.css';

const ReviewHostsInventory: React.FC<{ hosts?: Host[] }> = ({ hosts = [] }) => {
  const rows = React.useMemo(() => {
    const summary = getEnabledHosts(hosts).reduce(
      (summary, host) => {
        summary.count++;
        const inventory = stringToJSON<Inventory>(host.inventory);
        if (inventory) {
          const hwInfo = getSimpleHardwareInfo(inventory);
          summary.cores += hwInfo.cores;
          summary.memory += hwInfo.memory;
          summary.fs += hwInfo.disks;
        }
        return summary;
      },
      {
        count: 0,
        cores: 0,
        memory: 0,
        fs: 0,
      },
    );

    return [
      {
        cells: ['Hosts', summary.count],
      },
      {
        cells: ['Cores', summary.cores],
      },
      {
        cells: ['Memory', fileSize(summary.memory, 2, 'iec')],
      },
      {
        cells: ['Storage', fileSize(summary.fs, 2, 'si')],
      },
    ];
  }, [hosts]);

  return (
    <Table
      rows={rows}
      cells={['', '']}
      variant={TableVariant.compact}
      borders={false}
      aria-label="Cluster summary table"
      className="review-hosts-table"
    >
      <TableBody />
    </Table>
  );
};

const ReviewCluster: React.FC<{ cluster: Cluster }> = ({ cluster }) => (
  <DetailList>
    <DetailItem title="Cluster address" value={`${cluster.name}.${cluster.baseDnsDomain}`} />
    <DetailItem title="OpenShift version" value={cluster.openshiftVersion} />
    <DetailItem title="Management network CIDR" value={cluster.clusterNetworkCidr} />
    <DetailItem title="Cluster summary" value={<ReviewHostsInventory hosts={cluster.hosts} />} />
    <DetailItem
      title="Cluster validations"
      value={<ClusterValidations validationsInfo={cluster.validationsInfo} />}
    />
    <DetailItem title="Host validations" value={<HostsValidations hosts={cluster.hosts} />} />
  </DetailList>
);

export default ReviewCluster;
