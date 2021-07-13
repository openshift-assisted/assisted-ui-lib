import React from 'react';
import { Alert, AlertVariant, Text, TextContent } from '@patternfly/react-core';
import { MonitoredOperatorsList, OPERATOR_LABELS } from '../../../common';

interface FailedOperatorsWarningProps {
  failedOperators: MonitoredOperatorsList;
}

const FailedOperatorsWarning = ({ failedOperators }: FailedOperatorsWarningProps) => {
  const operatorText =
    failedOperators.length === 1
      ? `${OPERATOR_LABELS[failedOperators[0].name || '']} operator`
      : `${failedOperators.length} operators`;

  return (
    <Alert variant={AlertVariant.warning} title="Some operators failed to install" isInline>
      <TextContent>
        <Text>
          {`${operatorText} failed to install. Due to this, the cluster will be degraded, but you can try
          to install the operator from the Operator Hub.`}
          <br />
          Please check the installation logs for more information.
        </Text>
      </TextContent>
    </Alert>
  );
};

export default FailedOperatorsWarning;
