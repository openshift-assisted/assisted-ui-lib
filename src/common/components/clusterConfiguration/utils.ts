import { Address4, Address6 } from 'ip-address';
import { Cluster, ClusterDefaultConfig, Inventory, stringToJSON } from '../../api';
import { NO_SUBNET_SET } from '../../config';
import { HostDiscoveryValues, HostSubnets } from '../../types/clusters';
import { getHostname } from '../hosts/utils';

export const getSubnet = (cidr: string): Address6 | Address4 | null => {
  if (Address4.isValid(cidr)) {
    return new Address4(cidr);
  } else if (Address6.isValid(cidr)) {
    return new Address6(cidr);
  } else {
    return null;
  }
};

const getHumanizedSubnet = (subnet: Address6 | Address4 | null) => {
  if (subnet) {
    const subnetStart = subnet.startAddress().correctForm();
    const subnetEnd = subnet.endAddress().correctForm();
    return `${subnet.address} (${subnetStart} - ${subnetEnd})`;
  }

  return '';
};

export const getHostSubnets = (cluster: Cluster): HostSubnets => {
  const hostnameMap: { [id: string]: string } =
    cluster.hosts?.reduce((acc, host) => {
      const inventory = stringToJSON<Inventory>(host.inventory) || {};
      acc = {
        ...acc,
        [host.id]: getHostname(host, inventory),
      };
      return acc;
    }, {}) || {};

  return (
    cluster.hostNetworks?.map((hn) => {
      return {
        subnet: hn.cidr || '',
        hostIDs: hn.hostIds?.map((id) => hostnameMap[id] || id) || [],
        humanized: getHumanizedSubnet(getSubnet(hn.cidr as string)),
      };
    }) || []
  );
};

export const getSubnetFromMachineNetworkCidr = (machineNetworkCidr?: string) => {
  if (!machineNetworkCidr) {
    return NO_SUBNET_SET;
  }

  const subnet = getSubnet(machineNetworkCidr);
  return getHumanizedSubnet(subnet);
};

export const isAdvNetworkConf = (cluster: Cluster, defaultNetworkSettings: ClusterDefaultConfig) =>
  cluster.clusterNetworkCidr !== defaultNetworkSettings.clusterNetworkCidr ||
  cluster.clusterNetworkHostPrefix !== defaultNetworkSettings.clusterNetworkHostPrefix ||
  cluster.serviceNetworkCidr !== defaultNetworkSettings.serviceNetworkCidr;

export const getHostDiscoveryInitialValues = (cluster: Cluster): HostDiscoveryValues => {
  const monitoredOperators = cluster.monitoredOperators || [];
  const isOperatorEnabled = (name: string) =>
    !!monitoredOperators.find((operator) => operator.name === name);
  return {
    useExtraDisksForLocalStorage: isOperatorEnabled('ocs'),
    useContainerNativeVirtualization: isOperatorEnabled('cnv'),
  };
};
