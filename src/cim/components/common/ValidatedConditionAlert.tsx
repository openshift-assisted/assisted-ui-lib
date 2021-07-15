import React from 'react';
import { Alert, AlertVariant } from '@patternfly/react-core';
import { StatusCondition } from '../../types';

type ValidationAlertProps = {
  condition: StatusCondition<'Validated'>;
};

const ValidatedConditionAlert = ({ condition }: ValidationAlertProps) => {
  const { status, message } = condition;
  if (status === 'True') return null;
  if (status === 'Unknown') {
    return <Alert variant={AlertVariant.info} title={message} isInline />;
  }
  // const [title, ...messages] = message.split(/[:,]/);
  const [title, ...messages] = message.split(/:|\.,/);
  return (
    <Alert variant={AlertVariant.warning} title={title} isInline>
      {messages.length && (
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message.endsWith('.') ? message : `${message}.`}</li>
          ))}
        </ul>
      )}
    </Alert>
  );
};

export default ValidatedConditionAlert;
