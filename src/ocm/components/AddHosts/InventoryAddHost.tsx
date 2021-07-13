import React from 'react';
import { Text, TextContent, Button } from '@patternfly/react-core';
import ClusterHostsTable from '../hosts/ClusterHostsTable';
import { DiscoveryImageModalButton } from '../clusterConfiguration/discoveryImageModal';
import { DiscoveryTroubleshootingModal } from '../clusterConfiguration/DiscoveryTroubleshootingModal';
import InformationAndAlerts from '../clusterConfiguration/InformationAndAlerts';
import DiscoveryInstructions from '../clusterConfiguration/DiscoveryInstructions';
import { AddHostsContext } from './AddHostsContext';
import { AddHostRequirementsContent } from '../hosts/HostRequirementsContent';
import { isSingleNodeCluster } from '../clusters/utils';

const InventoryAddHosts: React.FC = () => {
  const { cluster } = React.useContext(AddHostsContext);
  const [isDiscoveryHintModalOpen, setDiscoveryHintModalOpen] = React.useState(false);

  if (!cluster) {
    return null;
  }

  return (
    <>
      <TextContent>
        <DiscoveryInstructions isSingleNodeCluster={isSingleNodeCluster(cluster)} />
        <Text component="p">
          <DiscoveryImageModalButton
            ButtonComponent={Button}
            cluster={cluster}
            idPrefix="bare-metal-inventory-add-host"
          />
        </Text>
        <InformationAndAlerts
          cluster={cluster}
          HostRequirementsContent={AddHostRequirementsContent}
          setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
        />
      </TextContent>
      <ClusterHostsTable cluster={cluster} setDiscoveryHintModalOpen={setDiscoveryHintModalOpen} />
      <DiscoveryTroubleshootingModal
        isOpen={isDiscoveryHintModalOpen}
        setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
      />
    </>
  );
};

export default InventoryAddHosts;
