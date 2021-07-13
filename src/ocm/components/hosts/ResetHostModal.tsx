import React from 'react';
import { Modal, ModalVariant, Button, ButtonVariant } from '@patternfly/react-core';

type ResetHostModalProps = {
  hostname?: string;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
};

const ResetHostModal: React.FC<ResetHostModalProps> = ({ isOpen, hostname, onClose, onReset }) => (
  <Modal
    title="Reset Host"
    isOpen={isOpen}
    onClose={onClose}
    variant={ModalVariant.small}
    actions={[
      <Button
        data-testid="reset-host-submit"
        key="confirm"
        variant={ButtonVariant.danger}
        onClick={onReset}
      >
        Reset
      </Button>,
      <Button key="cancel" variant={ButtonVariant.link} onClick={onClose}>
        Cancel
      </Button>,
    ]}
  >
    Are you sure you want to reset host{` ${hostname}` || ''} ?
  </Modal>
);

export default ResetHostModal;
