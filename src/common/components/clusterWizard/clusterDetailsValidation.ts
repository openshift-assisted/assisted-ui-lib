import * as Yup from 'yup';
import { Cluster, ManagedDomain } from '../../api';
import { OpenshiftVersionOptionType } from '../../types';
import {
  dnsNameValidationSchema,
  getDefaultOpenShiftVersion,
  nameValidationSchema,
  validJSONSchema,
} from '../ui';
import { ClusterDetailsValues } from './types';

export const getClusterDetailsInitialValues = ({
  cluster,
  pullSecret,
  managedDomains,
  ocpVersions,
}: {
  cluster?: Cluster;
  pullSecret?: string;
  managedDomains: ManagedDomain[];
  ocpVersions: OpenshiftVersionOptionType[];
}): ClusterDetailsValues => {
  const {
    name = '',
    highAvailabilityMode = 'Full',
    baseDnsDomain = '',
    openshiftVersion = getDefaultOpenShiftVersion(ocpVersions),
  } = cluster || {};
  return {
    name,
    highAvailabilityMode,
    openshiftVersion,
    pullSecret: pullSecret || '',
    baseDnsDomain,
    SNODisclaimer: highAvailabilityMode === 'None',
    useRedHatDnsService:
      !!baseDnsDomain && managedDomains.map((d) => d.domain).includes(baseDnsDomain),
  };
};

export const getClusterDetailsValidationSchema = (usedClusterNames: string[], cluster?: Cluster) =>
  Yup.lazy<{ baseDnsDomain: string }>((values) => {
    if (cluster?.pullSecretSet) {
      return Yup.object({
        name: nameValidationSchema(usedClusterNames, values.baseDnsDomain),
        baseDnsDomain: dnsNameValidationSchema.required('Base Domain is required.'),
      });
    }
    return Yup.object({
      name: nameValidationSchema(usedClusterNames, values.baseDnsDomain),
      pullSecret: validJSONSchema.required('Pull secret must be provided.'),
      baseDnsDomain: dnsNameValidationSchema.required('Base Domain is required.'),
      SNODisclaimer: Yup.boolean().when('highAvailabilityMode', {
        is: 'None',
        then: Yup.bool().oneOf([true], 'Confirm the Single Node OpenShift disclaimer to continue.'),
      }),
    });
  });
