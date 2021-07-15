import React from 'react';
import { Button, Modal, ButtonVariant, ModalVariant } from '@patternfly/react-core';
import { ToolbarButton } from './Toolbar';
import { Cluster, Event } from '../../api';
import { EventListFetchProps, EventsEntityKind } from '../../types';
import { EventListFetch } from '../fetching/EventListFetch';

type EventsModalButtonProps = React.ComponentProps<typeof Button> & {
  ButtonComponent?: typeof Button | typeof ToolbarButton;
  onFetchEvents: EventListFetchProps['onFetchEvents'];
  onClick?: () => void;
  hostId?: Event['hostId'];
  cluster: Cluster;
  entityKind: EventsEntityKind;
  title: string;
};

export const EventsModalButton: React.FC<EventsModalButtonProps> = ({
  ButtonComponent = ToolbarButton,
  onFetchEvents,
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
        onFetchEvents={onFetchEvents}
      />
    </>
  );
};

type EventsModalProps = {
  onFetchEvents: EventListFetchProps['onFetchEvents'];
  hostId: Event['hostId'];
  cluster: Cluster;
  entityKind: EventsEntityKind;
  onClose: () => void;
  isOpen: boolean;
  title: string;
};

export const EventsModal: React.FC<EventsModalProps> = ({
  onFetchEvents,
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
      <EventListFetch
        hostId={hostId}
        cluster={cluster}
        entityKind={entityKind}
        onFetchEvents={onFetchEvents}
      />
    </Modal>
  );
};
