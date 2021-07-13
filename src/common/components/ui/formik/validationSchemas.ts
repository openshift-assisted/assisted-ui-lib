import * as Yup from 'yup';
import { Address4, Address6 } from 'ip-address';
import { isInSubnet } from 'is-in-subnet';
import isCIDR from 'is-cidr';

import { NetworkConfigurationValues, HostSubnets } from '../../../types/clusters';
import { NO_SUBNET_SET } from '../../../config/constants';
import { ProxyFieldsType } from '../../../types';
import { trimCommaSeparatedList, trimSshPublicKey } from './utils';

const CLUSTER_NAME_REGEX = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;
const SSH_PUBLIC_KEY_REGEX = /^(ssh-rsa|ssh-ed25519|ecdsa-[-a-z0-9]*) AAAA[0-9A-Za-z+/]+[=]{0,3}( .+)?$/;
// Future bug-fixer: Beer on me! (mlibra)
const IP_ADDRESS_REGEX = /^(((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))|([0-9a-f]{1,4}:){7,7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,7}:|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|fe80:(:[0-9a-f]{0,4}){0,4}%[0-9a-z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const IP_ADDRESS_BLOCK_REGEX = /^(((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2][0-9]|3[0-2]))|([0-9a-f]{1,4}:){7,7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,7}:|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|fe80:(:[0-9a-f]{0,4}){0,4}%[0-9a-z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))$/;
const DNS_NAME_REGEX = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
const HOSTNAME_REGEX = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
const IP_V4_ZERO = '0.0.0.0';
const IP_V6_ZERO = '0000:0000:0000:0000:0000:0000:0000:0000';
const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$”/;

export const nameValidationSchema = (usedClusterNames: string[], baseDnsDomain = '') =>
  Yup.string()
    .matches(CLUSTER_NAME_REGEX, {
      message:
        'Name must consist of lower-case letters, numbers and hyphens. It must start with a letter and end with a letter or number.',
      excludeEmptyString: true,
    })
    .max(54, 'Cannot be longer than 54 characters.')
    .required('Required')
    .test('is-name-unique', 'The name is already taken.', (value: string) => {
      const clusterFullName = `${value}.${baseDnsDomain}`;
      return !value || !usedClusterNames.includes(clusterFullName);
    });

export const sshPublicKeyValidationSchema = Yup.string().test(
  'ssh-public-key',
  'SSH public key must consist of "[TYPE] key [[EMAIL]]", supported types are: ssh-rsa, ssh-ed25519, ecdsa-[VARIANT]. A single key can be provided only.',
  (value) => {
    if (!value) {
      return true;
    }

    return !!trimSshPublicKey(value).match(SSH_PUBLIC_KEY_REGEX);
    /* TODO(mlibra): disabled till muliple ssh-keys are supported: https://issues.redhat.com/browse/MGMT-3560
    return (
      trimSshPublicKey(value)
        .split('\n')
        .find((line: string) => !line.match(SSH_PUBLIC_KEY_REGEX)) === undefined
    );
    */
  },
);

export const validJSONSchema = Yup.string().test(
  'is-json',
  'The pull-secret format is invalid, refer to the documentation for examples.',
  (value) => {
    if (!value) return true;
    try {
      const pullSecret = JSON.parse(value);
      return (
        pullSecret.constructor.name === 'Object' &&
        Object.hasOwnProperty.call(pullSecret, 'auths') &&
        pullSecret.auths.constructor.name === 'Object'
      );
    } catch {
      return false;
    }
  },
);

export const ipValidationSchema = Yup.string().matches(IP_ADDRESS_REGEX, {
  message: 'Value "${value}" is not valid IP address.', // eslint-disable-line no-template-curly-in-string
  excludeEmptyString: true,
});

export const macAddressValidationSchema = Yup.string().matches(MAC_REGEX, {
  message: 'Value "${value}" is not valid MAC address.', // eslint-disable-line no-template-curly-in-string
  excludeEmptyString: true,
});

export const vipRangeValidationSchema = (
  hostSubnets: HostSubnets,
  { hostSubnet }: Partial<NetworkConfigurationValues>,
) =>
  Yup.string().test('vip-validation', 'IP Address is outside of selected subnet', function (value) {
    if (!value) {
      return true;
    }
    try {
      ipValidationSchema.validateSync(value);
    } catch (err) {
      return this.createError({ message: err.message });
    }
    const foundHostSubnet = hostSubnets.find((hn) => hn.humanized === hostSubnet);
    const subnetCidr = foundHostSubnet ? foundHostSubnet.subnet : '';
    return !subnetCidr || isInSubnet(value, subnetCidr);
  });

const vipUniqueValidationSchema = ({ ingressVip, apiVip }: Partial<NetworkConfigurationValues>) =>
  Yup.string().test(
    'vip-uniqueness-validation',
    'The Ingress and API Virtual IP addresses cannot be the same.',
    (value) => {
      if (!value) {
        return true;
      }
      return ingressVip !== apiVip;
    },
  );

// like .required() but passes for initially empty field
const requiredOnceSet = (initialValue?: string, message?: string) =>
  Yup.string().test(
    'required-once-set',
    message || 'The value is required.',
    (value) => value || !initialValue,
  );

const stringToIPAddress = (value: string): Address4 | Address6 | null => {
  let ip = null;
  if (Address4.isValid(value)) {
    ip = new Address4(value);
  } else if (Address6.isValid(value)) {
    ip = new Address6(value);
  }

  return ip;
};

export const vipValidationSchema = (
  hostSubnets: HostSubnets,
  values: {
    ingressVip: NetworkConfigurationValues['ingressVip'];
    apiVip: NetworkConfigurationValues['apiVip'];
  },
  initialValue?: string,
) =>
  Yup.mixed().when(['vipDhcpAllocation', 'networkingType'], {
    is: (vipDhcpAllocation, networkingType) =>
      !vipDhcpAllocation && networkingType !== 'userManaged',
    then: requiredOnceSet(initialValue)
      .concat(vipRangeValidationSchema(hostSubnets, values))
      .concat(vipUniqueValidationSchema(values))
      .when('hostSubnet', {
        is: (hostSubnet) => hostSubnet !== NO_SUBNET_SET,
        then: Yup.string().required('Required. Please provide an IP address'),
      }),
  });

export const ipBlockValidationSchema = Yup.string()
  .required('A value is required.')
  .test(
    'valid-ip-address',
    'Invalid IP address block. Expected value is a network expressed in CIDR notation (IP/netmask). For example: 123.123.123.0/24, 2055:d7a::/116',
    (value = '') => isCIDR.v4(value) || isCIDR.v6(value),
  )
  .test(
    'valid-netmask',
    'IPv4 netmask must be between 1-25 and include at least 128 addresses.\nIPv6 netmask must be between 8-128 and include at least 256 addresses.',
    (value = '') => {
      const suffix = parseInt(value.split('/')[1]);

      return (
        (isCIDR.v4(value) && 0 < suffix && suffix < 26) ||
        (isCIDR.v6(value) && 7 < suffix && suffix < 129)
      );
    },
  )
  .test(
    'cidr-is-not-unspecified',
    'The specified CIDR is invalid because its resulting routing prefix matches the unspecified address.',
    (value = '') => {
      const ip = stringToIPAddress(value);
      if (ip === null) {
        return false;
      }

      // The first address is used to represent the network
      const startAddress = ip.startAddress().address;

      return startAddress !== IP_V4_ZERO && startAddress !== IP_V6_ZERO;
    },
  )
  .test(
    'valid-cidr-base-address',
    ({ value }) => `${value} is not a valid CIDR`,
    (value = '') => {
      const ip = stringToIPAddress(value);
      if (ip === null) {
        return false;
      }

      const networkAddress = ip.startAddress().parsedAddress;
      const ipAddress = ip.parsedAddress;
      const result = ipAddress.every((part, idx) => part === networkAddress[idx]);

      return result;
    },
  );

export const dnsNameValidationSchema = Yup.string()
  .max(255, 'The DNS name can not be longer than 255 characters.')
  .test(
    'dns-name-label-length',
    'Single label of the DNS name can not be longer than 63 characters.',
    (value = '') => value.split('.').every((label: string) => label.length <= 63),
  )
  .matches(DNS_NAME_REGEX, {
    message: 'Value "${value}" is not valid DNS name. Example: basedomain.example.com', // eslint-disable-line no-template-curly-in-string
  });

export const hostPrefixValidationSchema = ({
  clusterNetworkCidr,
}: Partial<NetworkConfigurationValues>) => {
  const requiredText = 'The host prefix is required.';
  const minMaxText =
    'The host prefix is a number between 1 and 32 for IPv4 and between 8 and 128 for IPv6.';
  const netBlock = (clusterNetworkCidr || '').split('/')[1];
  if (!netBlock) {
    return Yup.number().required(requiredText).min(1, minMaxText).max(32, minMaxText);
  }

  let netBlockNumber = parseInt(netBlock);
  if (isNaN(netBlockNumber)) {
    netBlockNumber = 1;
  }

  const errorMsgPrefix =
    'The host prefix is a number between size of the cluster network CIDR range';
  const errorMsgIPv4 = `${errorMsgPrefix} (${netBlockNumber}) and 25.`;
  const errorMsgIPv6 = `${errorMsgPrefix} (8) and 128.`;

  if (Address6.isValid(clusterNetworkCidr || '')) {
    return Yup.number().required(requiredText).min(8, errorMsgIPv6).max(128, errorMsgIPv6);
  }

  if (Address4.isValid(clusterNetworkCidr || '')) {
    return Yup.number()
      .required(requiredText)
      .min(netBlockNumber, errorMsgIPv4)
      .max(25, errorMsgIPv4);
  }

  return Yup.number().required(requiredText);
};

export const hostnameValidationSchema = Yup.string()
  .max(63, 'The hostname can not be longer than 63 characters.')
  .matches(HOSTNAME_REGEX, {
    message: 'Value "${value}" is not valid hostname.',
    excludeEmptyString: true,
  });

export const uniqueHostnameValidationSchema = (origHostname: string, usedHostnames: string[]) =>
  Yup.string().test('unique-hostname-validation', 'Hostname must be unique.', (value) => {
    if (!value || value === origHostname) {
      return true;
    }
    return !usedHostnames.find((h) => h === value);
  });

const httpProxyValidationMessage = 'Provide a valid HTTP URL.';
export const httpProxyValidationSchema = (
  values: ProxyFieldsType,
  pairValueName: 'httpProxy' | 'httpsProxy',
) =>
  Yup.string()
    .test(
      'http-proxy-no-empty-validation',
      'At least one of the HTTP or HTTPS proxy URLs is required.',
      (value) => !values.enableProxy || value || values[pairValueName],
    )
    .test('http-proxy-validation', httpProxyValidationMessage, (value) => {
      if (!value) {
        return true;
      }

      try {
        const url = new URL(value);
        return url.protocol === 'http:';
      } catch {
        return false;
      }
    });

export const noProxyValidationSchema = Yup.string().test(
  'no-proxy-validation',
  'Provide comma-separated list of domains excluded from proxy.',
  (value: string) => {
    if (!value) {
      return true;
    }

    // https://docs.openshift.com/container-platform/4.5/installing/installing_bare_metal/installing-restricted-networks-bare-metal.html#installation-configure-proxy_installing-restricted-networks-bare-metal
    // A comma-separated list of destination domain names, domains, IP addresses or other network CIDRs
    // to exclude proxying. Preface a domain with . to include all subdomains of that domain.
    // Use * to bypass proxy for all destinations."
    return trimCommaSeparatedList(value)
      .split(',')
      .every((item) => {
        if (item === '*') {
          return true;
        }

        let domain = item;
        if (item.charAt(0) === '.') {
          domain = item.substr(1);
        }

        if (domain.match(DNS_NAME_REGEX)) {
          return true;
        }

        if (item.match(IP_ADDRESS_REGEX)) {
          return true;
        }

        // network CIDR
        if (item.match(IP_ADDRESS_BLOCK_REGEX)) {
          return true;
        }

        return false;
      });
  },
);

const isIPorDN = (value: string) => {
  if (!value) {
    return true;
  }
  if (value.match(DNS_NAME_REGEX)) {
    return true;
  }
  if (value.match(IP_ADDRESS_REGEX)) {
    return true;
  }
  return false;
};

export const ntpSourceValidationSchema = Yup.string().test(
  'ntp-source-validation',
  'Provide a comma separated list of valid DNS names or IP addresses.',
  (value: string) => {
    if (!value) {
      return true;
    }
    return trimCommaSeparatedList(value).split(',').every(isIPorDN);
  },
);

export const ipOrDomainValidationSchema = Yup.string().test(
  'host-address-validation',
  'Provide either IP address or a valid DNS name.',
  isIPorDN,
);
