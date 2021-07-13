import React from 'react';
import { OpenshiftVersionOptionType } from '../../../common';
import SNODisclaimer from './SNODisclaimer';
import { ClusterDetailsValues } from '../clusterWizard/types';
import SingleNodeCheckbox from '../../../common/components/ui/formik/SingleNodeCheckbox';

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
