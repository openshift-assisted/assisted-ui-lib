import React from 'react';
import { AlertActionLink } from '@patternfly/react-core';
import { useModalDialogsContext } from './ModalDialogsContext';

export const AdditionalNTPSourcesDialogToggle: React.FC = () => {
  const {
    additionalNTPSourcesDialog: { open },
  } = useModalDialogsContext();

  return <AlertActionLink onClick={() => open()}>Add NTP sources</AlertActionLink>;
};
