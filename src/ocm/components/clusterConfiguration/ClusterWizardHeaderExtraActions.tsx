import React from 'react';
import { SplitItem, ButtonVariant } from '@patternfly/react-core';
import { Cluster } from '../../../common';
import { EventsModalButton } from '../ui/eventsModal';

const ClusterWizardHeaderExtraActions: React.FC<{ cluster?: Cluster }> = ({ cluster }) =>
  cluster ? (
    <SplitItem>
      <EventsModalButton
        id="cluster-events-button"
        entityKind="cluster"
        cluster={cluster}
        title="Cluster events"
        variant={ButtonVariant.secondary}
      >
        View cluster events
      </EventsModalButton>
    </SplitItem>
  ) : null;

export default ClusterWizardHeaderExtraActions;
