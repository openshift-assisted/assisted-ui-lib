import * as Yup from 'yup';
import {
  Cluster,
  ClusterDefaultConfig,
  hostPrefixValidationSchema,
  ipBlockValidationSchema,
  sshPublicKeyValidationSchema,
  vipValidationSchema,
} from '../../../common';
import { HostSubnets, NetworkConfigurationValues } from '../../../common/types/clusters';
import { getSubnetFromMachineNetworkCidr } from './utils';

export const getNetworkInitialValues = (
  cluster: Cluster,
  defaultNetworkSettings: ClusterDefaultConfig,
): NetworkConfigurationValues => {
  return {
    clusterNetworkCidr: cluster.clusterNetworkCidr || defaultNetworkSettings.clusterNetworkCidr,
    clusterNetworkHostPrefix:
      cluster.clusterNetworkHostPrefix || defaultNetworkSettings.clusterNetworkHostPrefix,
    serviceNetworkCidr: cluster.serviceNetworkCidr || defaultNetworkSettings.serviceNetworkCidr,
    apiVip: cluster.apiVip || '',
    ingressVip: cluster.ingressVip || '',
    sshPublicKey: cluster.sshPublicKey || '',
    hostSubnet: getSubnetFromMachineNetworkCidr(cluster.machineNetworkCidr),
    vipDhcpAllocation: cluster.vipDhcpAllocation,
    networkingType: cluster.userManagedNetworking ? 'userManaged' : 'clusterManaged',
  };
};

export const getNetworkConfigurationValidationSchema = (
  initialValues: NetworkConfigurationValues,
  hostSubnets: HostSubnets,
) =>
  Yup.lazy<Pick<NetworkConfigurationValues, 'clusterNetworkCidr' | 'apiVip' | 'ingressVip'>>(
    ({ clusterNetworkCidr, apiVip, ingressVip }) =>
      Yup.object<NetworkConfigurationValues>().shape({
        clusterNetworkHostPrefix: hostPrefixValidationSchema({ clusterNetworkCidr }),
        clusterNetworkCidr: ipBlockValidationSchema,
        serviceNetworkCidr: ipBlockValidationSchema,
        apiVip: vipValidationSchema(hostSubnets, { apiVip, ingressVip }, initialValues.apiVip),
        ingressVip: vipValidationSchema(
          hostSubnets,
          { apiVip, ingressVip },
          initialValues.ingressVip,
        ),
        sshPublicKey: sshPublicKeyValidationSchema,
      }),
  );
