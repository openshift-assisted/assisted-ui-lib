import * as React from 'react';
import {
  ButtonVariant,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { ToolbarButton } from '../../../common';

export type WizardFooterGenericProps = {
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isSubmitting?: boolean;
  submittingText?: string;
};

type WizardFooterProps = WizardFooterGenericProps & {
  alerts?: React.ReactNode;
  errors?: React.ReactNode;
  leftExtraActions?: React.ReactNode;
};

const WizardFooter: React.FC<WizardFooterProps> = ({
  alerts,
  errors,
  onNext,
  onBack,
  onCancel,
  isNextDisabled,
  isBackDisabled,
  leftExtraActions,
  isSubmitting,
  submittingText = 'Saving changes...',
}) => (
  <Stack hasGutter>
    {alerts && <StackItem>{alerts}</StackItem>}
    {errors && <StackItem>{errors}</StackItem>}
    <StackItem>
      <Toolbar data-testid="wizard-step-actions">
        <ToolbarContent>
          {leftExtraActions}
          {onNext && (
            <ToolbarButton
              variant={ButtonVariant.primary}
              name="next"
              onClick={onNext}
              isDisabled={isNextDisabled}
            >
              Next
            </ToolbarButton>
          )}
          {onBack && (
            <ToolbarButton
              variant={ButtonVariant.secondary}
              name="back"
              onClick={onBack}
              isDisabled={isBackDisabled}
            >
              Back
            </ToolbarButton>
          )}
          <ToolbarButton
            variant={ButtonVariant.link}
            name="cancel"
            onClick={onCancel}
            isDisabled={false}
          >
            Cancel
          </ToolbarButton>
          {isSubmitting && (
            <ToolbarItem>
              <Text component={TextVariants.small}>
                <Spinner size="sm" /> {submittingText}
              </Text>
            </ToolbarItem>
          )}
        </ToolbarContent>
      </Toolbar>
    </StackItem>
  </Stack>
);

export default WizardFooter;
