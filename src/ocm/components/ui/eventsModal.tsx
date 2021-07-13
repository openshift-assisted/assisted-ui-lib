import React from 'react';
import { Button, Modal, ButtonVariant, ModalVariant } from '@patternfly/react-core';
import EventListFetch, { EventsEntityKind } from '../fetching/EventListFetch';
import { Event, Cluster, ToolbarButton } from '../../../common';

type EventsModalButtonProps = React.ComponentProps<typeof Button> & {
  ButtonComponent?: typeof Button | typeof ToolbarButton;
  onClick?: () => void;
  hostId?: Event['hostId'];
  cluster: Cluster;
  entityKind: EventsEntityKind;
  title: string;
};

export const EventsModalButton: React.FC<EventsModalButtonProps> = ({
  ButtonComponent = ToolbarButton,
  onClick,
  hostId,
  cluster,
  entityKind,
  children,
  title,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeModal = () => setIsModalOpen(false);
  const handleClick = onClick || (() => setIsModalOpen(true));
  return (
    <>
      <ButtonComponent {...props} onClick={handleClick}>
        {children || title}
      </ButtonComponent>
      <EventsModal
        title={title}
        isOpen={isModalOpen}
        onClose={closeModal}
        hostId={hostId}
        cluster={cluster}
        entityKind={entityKind}
      />
    </>
  );
};

type EventsModalProps = {
  hostId: Event['hostId'];
  cluster: Cluster;
  entityKind: EventsEntityKind;
  onClose: () => void;
  isOpen: boolean;
  title: string;
};

export const EventsModal: React.FC<EventsModalProps> = ({
  hostId,
  cluster,
  entityKind,
  onClose,
  isOpen,
  title,
}) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      actions={[
        <Button key="close" variant={ButtonVariant.primary} onClick={onClose}>
          Close
        </Button>,
      ]}
      onClose={onClose}
      variant={ModalVariant.large}
      className="events-modal"
    >
      <EventListFetch hostId={hostId} cluster={cluster} entityKind={entityKind} />
    </Modal>
  );
};
