import { Netmask } from 'netmask';
import { HostSubnets, ClusterConfigurationValues } from '../../types/clusters';
import { Cluster, Inventory, ManagedDomain } from '../../api/types';
import { stringToJSON } from '../../api/utils';
import { computeHostname } from '../hosts/Hostname';
import { CLUSTER_DEFAULT_NETWORK_SETTINGS } from '../../config/constants';
import { NO_SUBNET_SET } from '../../config/constants';

export const getHostSubnets = (cluster: Cluster): HostSubnets => {
  const hostnameMap: { [id: string]: string } =
    cluster.hosts?.reduce((acc, host) => {
      const inventory = stringToJSON<Inventory>(host.inventory) || {};
      acc = {
        ...acc,
        [host.id]: computeHostname(host, inventory),
      };
      return acc;
    }, {}) || {};

  return (
    cluster.hostNetworks?.map((hn) => {
      const subnet = new Netmask(hn.cidr as string);
      return {
        subnet,
        hostIDs: hn.hostIds?.map((id) => hostnameMap[id] || id) || [],
        humanized: `${subnet.toString()} (${subnet.first}-${subnet.last})`,
      };
    }) || []
  );
};

export const getSubnetFromMachineNetworkCidr = (machineNetworkCidr?: string) => {
  if (!machineNetworkCidr) {
    return NO_SUBNET_SET;
  }
  const subnet = new Netmask(machineNetworkCidr);
  return `${subnet.toString()} (${subnet.first}-${subnet.last})`;
};

export const isAdvConf = (cluster: Cluster): boolean =>
  cluster.clusterNetworkCidr !== CLUSTER_DEFAULT_NETWORK_SETTINGS.clusterNetworkCidr ||
  cluster.clusterNetworkHostPrefix !== CLUSTER_DEFAULT_NETWORK_SETTINGS.clusterNetworkHostPrefix ||
  cluster.serviceNetworkCidr !== CLUSTER_DEFAULT_NETWORK_SETTINGS.serviceNetworkCidr ||
  cluster.additionalNtpSource !== CLUSTER_DEFAULT_NETWORK_SETTINGS.additionalNtpSource;

export const getInitialValues = (
  cluster: Cluster,
  managedDomains: ManagedDomain[],
): ClusterConfigurationValues => ({
  name: cluster.name || '',
  baseDnsDomain: cluster.baseDnsDomain || '',
  clusterNetworkCidr:
    cluster.clusterNetworkCidr || CLUSTER_DEFAULT_NETWORK_SETTINGS.clusterNetworkCidr,
  clusterNetworkHostPrefix:
    cluster.clusterNetworkHostPrefix || CLUSTER_DEFAULT_NETWORK_SETTINGS.clusterNetworkHostPrefix,
  serviceNetworkCidr:
    cluster.serviceNetworkCidr || CLUSTER_DEFAULT_NETWORK_SETTINGS.serviceNetworkCidr,
  apiVip: cluster.vipDhcpAllocation ? '' : cluster.apiVip || '',
  ingressVip: cluster.vipDhcpAllocation ? '' : cluster.ingressVip || '',
  sshPublicKey: cluster.sshPublicKey || '',
  hostSubnet: getSubnetFromMachineNetworkCidr(cluster.machineNetworkCidr),
  useRedHatDnsService:
    !!cluster.baseDnsDomain && managedDomains.map((d) => d.domain).includes(cluster.baseDnsDomain),
  shareDiscoverySshKey:
    !!cluster.imageInfo.sshPublicKey && cluster.sshPublicKey === cluster.imageInfo.sshPublicKey,
  vipDhcpAllocation: cluster.vipDhcpAllocation,
  additionalNtpSource: cluster.additionalNtpSource || '',
});
