import React from 'react';
import { ToolbarContent, Toolbar, ActionGroup } from '@patternfly/react-core';
import './ClusterToolbar.css';

interface Props {
  validationSection?: React.ReactNode;
}

const ClusterToolbar: React.FC<Props> = ({ children, validationSection }) => (
  <>
    {validationSection}
    <ActionGroup>
      <Toolbar id="cluster-toolbar" className="cluster-toolbar">
        <ToolbarContent className="cluster-toolbar__content">{children}</ToolbarContent>
      </Toolbar>
    </ActionGroup>
  </>
);

export default ClusterToolbar;
