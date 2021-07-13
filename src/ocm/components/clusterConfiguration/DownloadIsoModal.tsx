import React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import DownloadIso, { DownloadISOProps } from './DownloadIso';

type DownloadIsoModalProps = DownloadISOProps & {
  isOpen: boolean;
};

const DownloadIsoModal: React.FC<DownloadIsoModalProps> = ({ isOpen, ...props }) => (
  <Modal
    aria-label="Download host discovery ISO dialog"
    title="Add Host"
    isOpen={isOpen}
    onClose={props.onClose}
    variant={ModalVariant.small}
    hasNoBodyWrapper
    id="download-discovery-iso-modal"
  >
    <DownloadIso {...props} />
  </Modal>
);

export default DownloadIsoModal;
