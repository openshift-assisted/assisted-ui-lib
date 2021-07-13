import React from 'react';

import { ToolbarGroup, ToolbarItem, Progress, ProgressSize } from '@patternfly/react-core';

const ToolbarProgress: React.FC<React.ComponentProps<typeof Progress>> = ({
  style,
  size = ProgressSize.sm,
}) => (
  <ToolbarGroup style={{ flexGrow: 1 }}>
    <ToolbarItem style={{ flexGrow: 1 }}>
      <Progress style={{ ...style, gridGap: 0 }} size={size} />
    </ToolbarItem>
  </ToolbarGroup>
);

export default ToolbarProgress;
