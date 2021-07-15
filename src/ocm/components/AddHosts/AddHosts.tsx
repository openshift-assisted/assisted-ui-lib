import {
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  Title,
  Toolbar,
  ToolbarContent,
} from '@patternfly/react-core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { getErrorMessage, handleApiError, installHosts } from '../../api';
import { updateCluster } from '../../reducers/clusters/currentClusterSlice';
import { DiscoveryImageModal } from '../clusterConfiguration/discoveryImageModal';
import { ModalDialogsContextProvider } from '../hosts/ModalDialogsContext';
import {
  ToolbarButton,
  ToolbarSecondaryGroup,
  getReadyHostCount,
  Alerts,
  AddHostsContext,
  alertsSlice,
} from '../../../common';
import { EventsModalButton } from '../ui/eventsModal';
import InventoryAddHosts from './InventoryAddHost';

const { addAlert } = alertsSlice.actions;

const AddHosts: React.FC = () => {
  const { cluster } = React.useContext(AddHostsContext);
  const dispatch = useDispatch();

  if (!cluster) {
    return null;
  }

  const handleHostsInstall = async () => {
    try {
      const { data } = await installHosts(cluster.id);
      dispatch(updateCluster(data));
    } catch (e) {
      handleApiError(e, () =>
        addAlert({
          title: 'Failed to start hosts installation.',
          message: getErrorMessage(e),
        }),
      );
    }
  };

  return (
    <ModalDialogsContextProvider>
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg" className="card-title">
            Host Discovery
          </Title>
        </CardTitle>
        <CardBody>
          <InventoryAddHosts />
          <Alerts />
          <Toolbar id="cluster-toolbar">
            <ToolbarContent>
              <ToolbarButton
                variant={ButtonVariant.primary}
                name="install"
                onClick={handleHostsInstall}
                isDisabled={getReadyHostCount(cluster) <= 0}
              >
                Install ready hosts
              </ToolbarButton>
              <ToolbarSecondaryGroup>
                <EventsModalButton
                  id="cluster-events-button"
                  entityKind="cluster"
                  cluster={cluster}
                  title="Cluster Events"
                  variant={ButtonVariant.link}
                  style={{ textAlign: 'right' }}
                >
                  View Cluster Events
                </EventsModalButton>
              </ToolbarSecondaryGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      <DiscoveryImageModal />
    </ModalDialogsContextProvider>
  );
};

export default AddHosts;
