import React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import EditHostForm from './EditHostForm';
import { getInventory } from './utils';
import { useModalDialogsContext } from './ModalDialogsContext';

const EditHostModal: React.FC = () => {
  const {
    editHostDialog: { isOpen, close, data },
  } = useModalDialogsContext();
  const inventory = getInventory(data?.host);
  return data?.host && inventory ? (
    <Modal
      aria-label="Edit host dialog"
      title="Edit Host"
      isOpen={isOpen}
      onClose={close}
      variant={ModalVariant.small}
      hasNoBodyWrapper
    >
      <EditHostForm
        host={data.host}
        inventory={inventory}
        usedHostnames={data.usedHostnames}
        onCancel={close}
        onSave={data.onSave}
      />
    </Modal>
  ) : null;
};

export default EditHostModal;
