import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateBody,
  Bullseye,
  EmptyStateIcon,
  EmptyStateVariant,
  Button,
  ButtonVariant,
  EmptyStateSecondaryActions,
  EmptyStateIconProps,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';

type Props = {
  title?: string;
  content?: React.ReactNode;
  fetchData?: () => void;
  icon?: EmptyStateIconProps['icon'];
  iconColor?: string;
  actions?: React.ReactNode[];
  variant?: EmptyStateVariant;
};

const ErrorState: React.FC<Props> = ({
  title = 'Error loading data',
  content,
  fetchData,
  icon = ExclamationCircleIcon,
  iconColor = globalDangerColor200.value,
  variant = EmptyStateVariant.small,
  actions,
}) => {
  const defaultContent = (
    <>
      There was an error retrieving data. Check your connection and{' '}
      {fetchData ? (
        <Button onClick={fetchData} variant={ButtonVariant.link} isInline>
          try again
        </Button>
      ) : (
        'try again'
      )}
      .
    </>
  );

  return (
    <Bullseye>
      <EmptyState variant={variant}>
        <EmptyStateIcon icon={icon} color={iconColor} />
        <Title headingLevel="h2">{title}</Title>
        <EmptyStateBody>{content || defaultContent}</EmptyStateBody>
        {actions && <EmptyStateSecondaryActions>{actions}</EmptyStateSecondaryActions>}
      </EmptyState>
    </Bullseye>
  );
};

export default ErrorState;
