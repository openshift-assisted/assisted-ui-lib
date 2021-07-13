import React from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import { RadioField } from '../../../../common';

export interface ManagedNetworkingControlGroupProps {
  disabled: boolean;
}

export const ManagedNetworkingControlGroup = ({
  disabled = false,
}: ManagedNetworkingControlGroupProps) => {
  const GROUP_NAME = 'networkingType';

  return (
    <Split hasGutter>
      <SplitItem>
        <RadioField
          name={GROUP_NAME}
          isDisabled={disabled}
          id={'clusterManagedNetworking'}
          value={'clusterManaged'}
          label="Cluster-Managed Networking"
        />
      </SplitItem>
      <SplitItem style={{ marginRight: '2.4rem' }} />
      <SplitItem>
        <RadioField
          name={GROUP_NAME}
          isDisabled={disabled}
          id={'userManagedNetworking'}
          value={'userManaged'}
          label="User-Managed Networking"
        />
      </SplitItem>
    </Split>
  );
};
