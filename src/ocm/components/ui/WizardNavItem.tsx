import React from 'react';
import { WizardNavItem, WizardNavItemProps } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens';

const NavItem: React.FC<WizardNavItemProps & { isValid?: () => boolean }> = ({
  isValid = () => true,
  ...props
}) => {
  const { content, isDisabled, isCurrent } = props;

  let validatedLinkName = content;
  if (!isDisabled && !isCurrent && !isValid()) {
    validatedLinkName = (
      <>
        {content}
        <ExclamationCircleIcon
          className="wizard-nav-item-warning-icon"
          color={dangerColor.value}
          size="sm"
        />
      </>
    );
  }

  return <WizardNavItem {...props} content={validatedLinkName} />;
};

export default NavItem;
