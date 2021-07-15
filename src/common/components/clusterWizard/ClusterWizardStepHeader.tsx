import React from 'react';
import { Split, SplitItem, Text, TextContent } from '@patternfly/react-core';

const ClusterWizardStepHeader: React.FC<{
  extraItems?: React.ReactNode | React.ReactNode[];
}> = ({ children, extraItems }) => {
  return (
    <Split>
      <SplitItem>
        <TextContent>
          <Text component="h2">{children}</Text>
        </TextContent>
      </SplitItem>
      <SplitItem isFilled />
      {extraItems}
    </Split>
  );
};

export default ClusterWizardStepHeader;
