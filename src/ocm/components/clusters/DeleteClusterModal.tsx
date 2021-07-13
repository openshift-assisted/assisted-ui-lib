import * as React from 'react';
import { Modal, Button, ModalVariant } from '@patternfly/react-core';

type DeleteClusterModalProps = {
  name: string;
  onClose: () => void;
  onDelete: () => void;
};

const DeleteClusterModal: React.FC<DeleteClusterModalProps> = ({ name, onClose, onDelete }) => (
  <Modal
    title="Delete cluster"
    isOpen={true}
    onClose={onClose}
    variant={ModalVariant.small}
    actions={[
      <Button data-testid="delete-cluster-submit" key="confirm" variant="danger" onClick={onDelete}>
        Delete
      </Button>,
      <Button key="cancel" variant="link" onClick={onClose}>
        Cancel
      </Button>,
    ]}
  >
    Are you sure you want to delete cluster {name} ?
  </Modal>
);

export default DeleteClusterModal;
