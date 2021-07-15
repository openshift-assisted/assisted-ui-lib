import React from 'react';
import { getAssistedUiLibVersion } from '../../../common';

export const AssistedUILibVersion: React.FC = ({ children }) => (
  <>
    {children}
    <div data-testid="assisted-ui-lib-version" hidden>
      {getAssistedUiLibVersion()}
    </div>
  </>
);
