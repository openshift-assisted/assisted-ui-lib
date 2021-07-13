import React from 'react';
import { Text } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens';

const FormatDiskWarning = () => (
  <Text component="p">
    <ExclamationTriangleIcon className="status-icon" color={warningColor.value} size="sm" />
    &nbsp;All bootable disks will be formatted during installation
  </Text>
);

export default FormatDiskWarning;
