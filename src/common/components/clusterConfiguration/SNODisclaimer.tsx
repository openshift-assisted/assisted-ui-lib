import React from 'react';
import { Alert, AlertVariant, List, ListItem, Stack, StackItem } from '@patternfly/react-core';
import { CheckboxField } from '../ui';

type SNODisclaimerProps = {
  isDisabled?: boolean;
};
const SNODisclaimer = ({ isDisabled = false }: SNODisclaimerProps) => {
  return (
    <Alert
      variant={AlertVariant.warning}
      title="Limitations for using Single Node OpenShift"
      isInline
    >
      <Stack hasGutter>
        <StackItem>
          <List>
            <ListItem>SNO is in a proof-of-concept stage and is not supported in any way.</ListItem>
            <ListItem>
              Installing SNO will result in a non-highly available OpenShift deployment.
            </ListItem>
            <ListItem>
              OpenShift in-place upgrades aren't expected to work with SNO. If an upgrade is needed,
              your system will need a redeployment.
            </ListItem>
            <ListItem>
              Adding additional machines to your cluster is currently out of scope.
            </ListItem>
          </List>
        </StackItem>
        <StackItem>
          <CheckboxField
            name="SNODisclaimer"
            label="I understand, accept, and agree to the limitations associated with using Single Node OpenShift."
            isDisabled={isDisabled}
          />
        </StackItem>
      </Stack>
    </Alert>
  );
};

export default SNODisclaimer;
