import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  Bullseye,
  EmptyStateVariant,
  Spinner,
  EmptyStateSecondaryActions,
} from '@patternfly/react-core';

type Props = {
  content?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode[];
};

const LoadingState: React.FC<Props> = ({ content, primaryAction, secondaryActions }) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.small}>
      <Spinner size="xl" />
      {content && <EmptyStateBody>{content}</EmptyStateBody>}
      {primaryAction}
      {secondaryActions && (
        <EmptyStateSecondaryActions>{secondaryActions}</EmptyStateSecondaryActions>
      )}
    </EmptyState>
  </Bullseye>
);

export default LoadingState;
