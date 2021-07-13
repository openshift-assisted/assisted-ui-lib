import React from 'react';
import { Modal, Button, ButtonVariant, ModalVariant } from '@patternfly/react-core';
import { Cluster, ToolbarButton } from '../../../common';
import DiscoveryImageForm from './DiscoveryImageForm';
import DiscoveryImageSummary from './DiscoveryImageSummary';
import { useModalDialogsContext } from '../hosts/ModalDialogsContext';

type DiscoveryImageModalButtonProps = {
  ButtonComponent?: typeof Button | typeof ToolbarButton;
  cluster: Cluster;
  idPrefix: string;
};

export const DiscoveryImageModalButton: React.FC<DiscoveryImageModalButtonProps> = ({
  ButtonComponent = Button,
  cluster,
  idPrefix,
}) => {
  const { discoveryImageDialog } = useModalDialogsContext();
  const { open } = discoveryImageDialog;

  return (
    <>
      <ButtonComponent
        variant={ButtonVariant.primary}
        onClick={() => open({ cluster })}
        id={`${idPrefix}-button-download-discovery-iso`}
      >
        Generate Discovery ISO
      </ButtonComponent>
    </>
  );
};

export const DiscoveryImageModal: React.FC = () => {
  const [imageInfo, setImageInfo] = React.useState<Cluster['imageInfo'] | undefined>();
  const { discoveryImageDialog } = useModalDialogsContext();
  const { data, isOpen, close } = discoveryImageDialog;
  const cluster = data?.cluster;

  if (!cluster) {
    return null;
  }

  return (
    <Modal
      aria-label="Generate Discovery ISO dialog"
      title="Generate Discovery ISO"
      isOpen={isOpen}
      onClose={close}
      variant={ModalVariant.small}
      hasNoBodyWrapper
      id="generate-discovery-iso-modal"
    >
      {imageInfo ? (
        <DiscoveryImageSummary
          cluster={cluster}
          imageInfo={imageInfo}
          onClose={close}
          onReset={() => setImageInfo(undefined)}
        />
      ) : (
        <DiscoveryImageForm
          cluster={cluster}
          onCancel={close}
          onSuccess={(imageInfo: Cluster['imageInfo']) => setImageInfo(imageInfo)}
        />
      )}
    </Modal>
  );
};
