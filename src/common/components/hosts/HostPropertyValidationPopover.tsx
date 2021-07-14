import React from 'react';
import { Button, ButtonVariant, Popover } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, PendingIcon } from '@patternfly/react-icons';
import {
  global_danger_color_100 as dangerColor,
  global_success_color_100 as successColor,
} from '@patternfly/react-tokens';
import { toSentence } from '../ui';
import { HOST_VALIDATION_FAILURE_HINTS, HOST_VALIDATION_LABELS } from '../../config';
import { Validation } from '../../types/hosts';

type ValidationPopoverProps = {
  validation: Validation;
  actions?: React.ReactNode[];
};

const ValidationPopover: React.FC<ValidationPopoverProps> = ({ validation, actions, children }) => {
  const failedValidationHint = HOST_VALIDATION_FAILURE_HINTS[validation.id];
  return (
    <Popover
      headerContent={<div>{HOST_VALIDATION_LABELS[validation.id]}</div>}
      bodyContent={
        <div>
          {toSentence(validation.message)}
          {validation.status === 'failure' && failedValidationHint && ` ${failedValidationHint}`}
        </div>
      }
      footerContent={actions}
      zIndex={300}
    >
      <Button variant={ButtonVariant.link} isInline>
        {children}
      </Button>
    </Popover>
  );
};

type HostPropertyValidationPopoverProps = {
  validation?: Validation;
  failureActions?: React.ReactNode[];
  pendingActions?: React.ReactNode[];
  showFailure?: boolean;
  showPending?: boolean;
  showSuccess?: boolean;
};

const HostPropertyValidationPopover: React.FC<HostPropertyValidationPopoverProps> = ({
  validation,
  failureActions,
  pendingActions,
  children,
  showFailure = true,
  showPending = false,
  showSuccess = false,
}) => {
  if (validation) {
    if (showFailure && validation.status === 'failure') {
      return (
        <ValidationPopover validation={validation} actions={failureActions}>
          <ExclamationCircleIcon color={dangerColor.value} /> {children}
        </ValidationPopover>
      );
    }
    if (showPending && validation.status === 'pending') {
      return (
        <ValidationPopover validation={validation} actions={pendingActions}>
          <PendingIcon /> {children}
        </ValidationPopover>
      );
    }
    if (showSuccess && validation.status === 'success') {
      return (
        <ValidationPopover validation={validation}>
          <CheckCircleIcon color={successColor.value} /> {children}
        </ValidationPopover>
      );
    }
  }
  return <>{children}</>;
};

export default HostPropertyValidationPopover;
