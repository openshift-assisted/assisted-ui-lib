import React from 'react';
import {
  Title,
  EmptyState as PFEmptyState,
  EmptyStateBody,
  Bullseye,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateIconProps,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

type Props = {
  title?: string;
  content?: React.ReactNode;
  icon?: EmptyStateIconProps['icon'];
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode[];
};

const EmptyState: React.FC<Props> = ({
  title = 'No results found',
  content,
  icon = SearchIcon,
  primaryAction,
  secondaryActions,
}) => (
  <Bullseye>
    <PFEmptyState>
      <EmptyStateIcon icon={icon} />
      <Title headingLevel="h2">{title}</Title>
      {content && <EmptyStateBody>{content}</EmptyStateBody>}
      {primaryAction}
      {secondaryActions && (
        <EmptyStateSecondaryActions>{secondaryActions}</EmptyStateSecondaryActions>
      )}
    </PFEmptyState>
  </Bullseye>
);

export default EmptyState;
