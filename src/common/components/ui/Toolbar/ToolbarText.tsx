import React from 'react';

import { ToolbarItem, Text } from '@patternfly/react-core';

const ToolbarText: React.FC<React.ComponentProps<typeof Text>> = (props) => (
  <ToolbarItem>
    <Text {...props} />
  </ToolbarItem>
);

export default ToolbarText;
