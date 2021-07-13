import React from 'react';
import { Button, ToolbarItem } from '@patternfly/react-core';

const ToolbarButton: React.FC<React.ComponentProps<typeof Button>> = ({ ...props }) => (
  <ToolbarItem>
    <Button {...props} />
  </ToolbarItem>
);

export default ToolbarButton;
