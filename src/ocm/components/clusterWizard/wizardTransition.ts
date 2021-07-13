import _ from 'lodash';
import {
  Cluster,
  ClusterValidationId,
  Host,
  HostValidationId,
  stringToJSON,
} from '../../../common';
import {
  ValidationGroup as ClusterValidationGroup,
  ValidationsInfo as ClusterValidationsInfo,
} from '../../../common/types/clusters';
import {
  Validation,
  ValidationGroup as HostValidationGroup,
  ValidationsInfo as HostValidationsInfo,
  ValidationsInfo,
} from '../../../common/types/hosts';

export type ClusterWizardStepsType = 'cluster-details' | 'host-discovery' | 'networking' | 'review';

export type ClusterWizardFlowStateType = {
  wizardFlow?: 'new' | undefined;
};

export const getClusterWizardFirstStep = (
  props?: ClusterWizardFlowStateType,
): ClusterWizardStepsType => (props?.wizardFlow === 'new' ? 'host-discovery' : 'cluster-details');

type TransitionProps = { cluster: Cluster };

type WizardStepValidationMap = {
  cluster: {
    groups: ClusterValidationGroup[];
    validationIds: ClusterValidationId[];
  };
  host: {
    allowedStatuses: Host['status'][];
    groups: HostValidationGroup[];
    validationIds: HostValidationId[];
  };
  softValidationIds: (HostValidationId | ClusterValidationId)[];
};

type WizardStepsValidationMap = {
  [key in ClusterWizardStepsType]: WizardStepValidationMap;
};

const clusterDetailsStepValidationsMap: WizardStepValidationMap = {
  cluster: {
    groups: [],
    validationIds: ['pull-secret-set', 'dns-domain-defined'],
  },
  host: {
    allowedStatuses: [
      'known',
      'disabled',
      'discovering',
      'disconnected',
      'resetting',
      'resetting-pending-user-action',
    ],
    groups: [],
    validationIds: [],
  },
  softValidationIds: [],
};

const hostDiscoveryStepValidationsMap: WizardStepValidationMap = {
  cluster: {
    groups: [],
    validationIds: [
      'sufficient-masters-count',
      'ocs-requirements-satisfied',
      'lso-requirements-satisfied',
      'cnv-requirements-satisfied',
    ],
  },
  host: {
    allowedStatuses: ['known', 'disabled'],
    groups: ['hardware'],
    validationIds: [
      'connected',
      'ocs-requirements-satisfied',
      'lso-requirements-satisfied',
      'cnv-requirements-satisfied',
    ],
  },
  softValidationIds: [],
};

const networkingStepValidationsMap: WizardStepValidationMap = {
  cluster: {
    groups: ['network'],
    validationIds: [],
  },
  host: {
    allowedStatuses: ['known', 'disabled'],
    groups: ['network'],
    validationIds: [],
  },
  // TODO(jtomasek): container-images-available validation is currently not running on the backend, it stays in pending.
  // marking it as soft validation is the easy way to prevent it from blocking the progress.
  // Alternatively we would have to whitelist network validations instead of using group
  // TODO(mlibra): remove that container-images-available from soft validations and let backend drive it via disabling it.
  //   Depends on: https://issues.redhat.com/browse/MGMT-5265
  softValidationIds: ['ntp-synced', 'container-images-available'],
};

const reviewStepValidationsMap: WizardStepValidationMap = {
  cluster: {
    groups: [],
    validationIds: ['all-hosts-are-ready-to-install'],
  },
  host: {
    allowedStatuses: ['known', 'disabled'],
    groups: [],
    validationIds: [],
  },
  softValidationIds: [],
};

export const wizardStepsValidationsMap: WizardStepsValidationMap = {
  'cluster-details': clusterDetailsStepValidationsMap,
  'host-discovery': hostDiscoveryStepValidationsMap,
  networking: networkingStepValidationsMap,
  review: reviewStepValidationsMap,
};

export const allClusterWizardSoftValidationIds: WizardStepValidationMap['softValidationIds'] = Object.keys(
  wizardStepsValidationsMap,
).reduce(
  (prev, curr) => [...prev, ...wizardStepsValidationsMap[curr].softValidationIds],
  [] as WizardStepValidationMap['softValidationIds'],
);

export const getFailingClusterWizardSoftValidationIds = (
  wizardHostStepValidationsInfo: ValidationsInfo,
  wizardStepId: ClusterWizardStepsType,
) => {
  const failingValidationIds = Object.keys(wizardHostStepValidationsInfo)
    .reduce((curr, group) => {
      const failingValidations = wizardHostStepValidationsInfo[group].filter(
        (validation: Validation) => validation.status === 'failure',
      );
      return [...curr, ...failingValidations];
    }, [] as Validation[])
    .map((validation) => validation.id);
  return failingValidationIds.filter((id) =>
    wizardStepsValidationsMap[wizardStepId].softValidationIds.includes(id),
  );
};

export const checkClusterValidations = (
  clusterValidationsInfo: ClusterValidationsInfo,
  requiredIds: ClusterValidationId[],
): boolean => {
  const requiredValidations = _.values(clusterValidationsInfo)
    .flat()
    .filter((v) => v && requiredIds.includes(v.id));
  return (
    requiredValidations.length === requiredIds.length &&
    requiredValidations.every((v) => v?.status === 'disabled' || v?.status === 'success')
  );
};

export const checkClusterValidationGroups = (
  clusterValidationsInfo: ClusterValidationsInfo,
  groups: ClusterValidationGroup[],
  softValidationIds: WizardStepValidationMap['softValidationIds'],
) =>
  groups.every((group) =>
    clusterValidationsInfo[group]?.every(
      (validation) =>
        validation.status === 'disabled' ||
        validation.status === 'success' ||
        softValidationIds.includes(validation.id),
    ),
  );

export const checkHostValidations = (
  hostValidationsInfo: HostValidationsInfo,
  requiredIds: HostValidationId[],
): boolean => {
  const requiredValidations = _.values(hostValidationsInfo)
    .flat()
    .filter((v) => v && requiredIds.includes(v.id));

  return (
    requiredValidations.length === requiredIds.length &&
    requiredValidations.every((v) => v?.status === 'disabled' || v?.status === 'success')
  );
};

export const checkHostValidationGroups = (
  hostValidationsInfo: HostValidationsInfo,
  groups: HostValidationGroup[],
  softValidationIds: WizardStepValidationMap['softValidationIds'],
) =>
  groups.every((group) =>
    hostValidationsInfo[group]?.every(
      (validation) =>
        validation.status === 'disabled' ||
        validation.status === 'success' ||
        softValidationIds.includes(validation.id),
    ),
  );

export const getWizardStepHostValidationsInfo = (
  validationsInfo: HostValidationsInfo,
  wizardStepId: ClusterWizardStepsType,
): HostValidationsInfo => {
  const { groups, validationIds } = wizardStepsValidationsMap[wizardStepId].host;
  return _.reduce(
    validationsInfo,
    (result, groupValidations, groupName) => {
      if (groups.includes(groupName as HostValidationGroup)) {
        result[groupName] = groupValidations;
        return result;
      }
      const selectedValidations = (groupValidations || []).filter((validation) =>
        validationIds.includes(validation.id),
      );
      if (selectedValidations.length) {
        result[groupName] = selectedValidations;
        return result;
      }
      return result;
    },
    {},
  );
};

export const getWizardStepHostStatus = (
  host: Host,
  wizardStepId: ClusterWizardStepsType,
): Host['status'] => {
  const { status } = host;
  if (['insufficient', 'pending-for-input'].includes(status)) {
    const { softValidationIds } = wizardStepsValidationsMap[wizardStepId];
    const validationsInfo = stringToJSON<HostValidationsInfo>(host.validationsInfo) || {};
    const { groups, validationIds } = wizardStepsValidationsMap[wizardStepId].host;
    return checkHostValidationGroups(validationsInfo, groups, softValidationIds) &&
      checkHostValidations(validationsInfo, validationIds)
      ? 'known'
      : status;
  }
  return status;
};

export const getWizardStepClusterValidationsInfo = (
  validationsInfo: ClusterValidationsInfo,
  wizardStepId: ClusterWizardStepsType,
): ClusterValidationsInfo => {
  const { groups, validationIds } = wizardStepsValidationsMap[wizardStepId].cluster;
  return _.reduce(
    validationsInfo,
    (result, groupValidations, groupName) => {
      if (groups.includes(groupName as ClusterValidationGroup)) {
        result[groupName] = groupValidations;
        return result;
      }
      const selectedValidations = (groupValidations || []).filter((validation) =>
        validationIds.includes(validation.id),
      );
      if (selectedValidations.length) {
        result[groupName] = selectedValidations;
        return result;
      }
      return result;
    },
    {},
  );
};

export const getWizardStepClusterStatus = (
  cluster: Cluster,
  wizardStepId: ClusterWizardStepsType,
): Cluster['status'] => {
  const { status } = cluster;
  if (['insufficient', 'pending-for-input'].includes(status)) {
    const validationsInfo = stringToJSON<ClusterValidationsInfo>(cluster.validationsInfo) || {};
    const { groups, validationIds } = wizardStepsValidationsMap[wizardStepId].cluster;
    const { softValidationIds } = wizardStepsValidationsMap[wizardStepId];
    const { allowedStatuses } = wizardStepsValidationsMap[wizardStepId].host;
    const allHostsReady = (cluster?.hosts || []).every((host) =>
      allowedStatuses.includes(getWizardStepHostStatus(host, wizardStepId)),
    );
    return allHostsReady &&
      checkClusterValidationGroups(validationsInfo, groups, softValidationIds) &&
      checkClusterValidations(validationsInfo, validationIds)
      ? 'ready'
      : status;
  }
  return status;
};

export const findValidationFixStep = ({
  id,
  hostGroup,
  clusterGroup,
}: {
  // validation IDs are unique
  id: ClusterValidationId | HostValidationId;
  hostGroup?: HostValidationGroup;
  clusterGroup?: ClusterValidationGroup;
}): ClusterWizardStepsType | undefined => {
  const keys = _.keys(wizardStepsValidationsMap) as ClusterWizardStepsType[];
  return keys.find((key) => {
    // find first matching validation-map name
    const { cluster: clusterValidationMap, host: hostValidationMap } = wizardStepsValidationsMap[
      key
    ];
    return (
      clusterValidationMap.validationIds.includes(id as ClusterValidationId) ||
      hostValidationMap.validationIds.includes(id as HostValidationId) ||
      (clusterGroup && clusterValidationMap.groups.includes(clusterGroup)) ||
      (hostGroup && hostValidationMap.groups.includes(hostGroup))
    );
  });
};

/*
We are colocating all these canNext* functions for easier maintenance.
However transitions among steps should be independent on each other.
*/
export const canNextClusterDetails = ({ cluster }: TransitionProps): boolean =>
  getWizardStepClusterStatus(cluster, 'cluster-details') === 'ready';

export const canNextHostDiscovery = ({ cluster }: TransitionProps): boolean =>
  getWizardStepClusterStatus(cluster, 'host-discovery') === 'ready';

export const canNextNetwork = ({ cluster }: TransitionProps): boolean =>
  getWizardStepClusterStatus(cluster, 'networking') === 'ready';
