import React from 'react';
import { Button, ButtonVariant, Modal, ModalVariant } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Cluster } from '../../../common';
import { PreflightHWRequirementsContentComponent } from '../hosts/HostRequirementsContent';

import './HostRequirements.css';

export type HostRequirementsLinkProps = {
  clusterId: Cluster['id'];
  ContentComponent: PreflightHWRequirementsContentComponent;
};

type HostRequirementsModalProps = HostRequirementsLinkProps & {
  isOpen: boolean;
  setHostRequirementsOpen: (isOpen: boolean) => void;
};

const HostRequirementsModal: React.FC<HostRequirementsModalProps> = ({
  setHostRequirementsOpen,
  isOpen,
  ContentComponent,
  clusterId,
}) => {
  const onClose = React.useCallback(() => setHostRequirementsOpen(false), [
    setHostRequirementsOpen,
  ]);

  return (
    <Modal
      title="Minimum hardware requirements"
      isOpen={isOpen}
      actions={[
        <Button key="close" variant={ButtonVariant.primary} onClick={onClose}>
          Close
        </Button>,
      ]}
      onClose={onClose}
      variant={ModalVariant.medium}
    >
      <ContentComponent clusterId={clusterId} />
    </Modal>
  );
};

export const HostRequirementsLink: React.FC<HostRequirementsLinkProps> = (props) => {
  const [isHostRequirementsOpen, setHostRequirementsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant={ButtonVariant.link}
        onClick={() => setHostRequirementsOpen(true)}
        isInline
        className="host-requirements-link"
      >
        <InfoCircleIcon size="sm" />
        &nbsp;Minimum hardware requirements
      </Button>
      <HostRequirementsModal
        {...props}
        isOpen={isHostRequirementsOpen}
        setHostRequirementsOpen={setHostRequirementsOpen}
      />
    </>
  );
};
