import React from 'react';
import { ClusterDetailsValues } from '../../../common/components/clusterWizard/types';
import { SingleNodeCheckbox } from '../ui';
import { OpenshiftVersionOptionType } from '../../types';
import SNODisclaimer from './SNODisclaimer';

type SNOControlGroupProps = {
  isDisabled?: boolean;
  versions: OpenshiftVersionOptionType[];
  highAvailabilityMode: ClusterDetailsValues['highAvailabilityMode'];
};

const SNOControlGroup = ({ versions, highAvailabilityMode, isDisabled }: SNOControlGroupProps) => (
  <>
    <SingleNodeCheckbox name="highAvailabilityMode" versions={versions} isDisabled={isDisabled} />
    {highAvailabilityMode === 'None' && <SNODisclaimer isDisabled={isDisabled} />}
  </>
);

export default SNOControlGroup;
