import React from 'react';
import { AlertActionLink } from '@patternfly/react-core';
import { AdditionalNTPSourcesDialog } from '../../../common/components/hosts/AdditionalNTPSourcesDialog';
import { Cluster } from '../../../common';

export const AdditionalNTPSourcesDialogToggle: React.FC<{ cluster: Cluster }> = ({ cluster }) => {
  const [isOpen, setOpen] = React.useState(false);
  // TODO(mlibra): Improve position of the dialog in the component hierarchy
  const onAdditionalNtpSource = async (additionalNtpSource: string) => {
    console.info('TODO: implement onAdditionalNtpSource for CIM: ', additionalNtpSource);
  };

  return (
    <>
      <AlertActionLink onClick={() => open()}>Add NTP sources</AlertActionLink>;
      <AdditionalNTPSourcesDialog
        cluster={cluster}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onAdditionalNtpSource={onAdditionalNtpSource}
      />
    </>
  );
};
