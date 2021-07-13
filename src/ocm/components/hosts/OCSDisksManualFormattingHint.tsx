import React from 'react';
import { useFormikContext } from 'formik';
import { HostDiscoveryValues } from '../../../common/types/clusters';
import {
  Button,
  ButtonVariant,
  Popover,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/js/global_warning_color_100';

const Hint = () => (
  <TextContent>
    <Text component={TextVariants.p}>
      All non-installation disks will be used for local storage. To view available disks, expand
      each host row in the table
    </Text>
  </TextContent>
);

const OCSDisksManualFormattingHint = () => {
  const { values } = useFormikContext<HostDiscoveryValues>();
  return values.useExtraDisksForLocalStorage ? (
    <Text component="p">
      <Popover bodyContent={<Hint />} minWidth="30rem">
        <Button variant={ButtonVariant.link} isInline>
          <ExclamationTriangleIcon className="status-icon" color={warningColor.value} size="sm" />
          &nbsp;Format all non-installation disks
        </Button>
      </Popover>
    </Text>
  ) : null;
};

export default OCSDisksManualFormattingHint;
