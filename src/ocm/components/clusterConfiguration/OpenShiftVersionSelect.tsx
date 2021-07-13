import React from 'react';
import { useFormikContext } from 'formik';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens';
import {
  OpenshiftVersionOptionType,
  SelectField,
  SNO_SUPPORT_MIN_VERSION,
  ClusterCreateParams,
} from '../../../common';

type OpenShiftVersionSelectProps = {
  versions: OpenshiftVersionOptionType[];
};
const OpenShiftVersionSelect: React.FC<OpenShiftVersionSelectProps> = ({ versions }) => {
  const {
    values: { highAvailabilityMode },
    setFieldValue,
  } = useFormikContext<ClusterCreateParams>();
  React.useEffect(() => {
    if (highAvailabilityMode === 'None') {
      const firstSupportedVersionValue = versions.find(
        (version) => parseFloat(version.value) >= SNO_SUPPORT_MIN_VERSION,
      )?.value;
      setFieldValue('openshiftVersion', firstSupportedVersionValue);
    }
  }, [highAvailabilityMode, setFieldValue, versions]);

  const getOpenshiftVersionHelperText = (value: string) =>
    versions.find((version) => version.value === value)?.supportLevel !== 'production' ? (
      <>
        <ExclamationTriangleIcon color={warningColor.value} size="sm" />
        &nbsp;Please note that this version is not production ready.
      </>
    ) : null;

  const selectOptions = React.useMemo(
    () =>
      versions
        .map((version) => ({
          label: version.label,
          value: version.value,
        }))
        .filter((version) =>
          highAvailabilityMode === 'None'
            ? parseFloat(version.value) >= SNO_SUPPORT_MIN_VERSION
            : true,
        ),
    [versions, highAvailabilityMode],
  );

  return (
    <SelectField
      label="OpenShift Version"
      name="openshiftVersion"
      options={selectOptions}
      getHelperText={getOpenshiftVersionHelperText}
      isDisabled={versions.length === 0}
      isRequired
    />
  );
};

export default OpenShiftVersionSelect;
