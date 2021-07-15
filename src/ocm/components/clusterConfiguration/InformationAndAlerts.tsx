import React from 'react';
import { Text } from '@patternfly/react-core';
import { Cluster, HostsNotShowingLink, HostsNotShowingLinkProps } from '../../../common';
import { HostRequirementsLink, HostRequirementsLinkProps } from '../fetching/HostRequirements';
import VMRebootConfigurationInfo from '../hosts/VMRebootConfigurationInfo';
import OCSDisksManualFormattingHint from '../hosts/OCSDisksManualFormattingHint';
import { isAddHostsCluster } from '../clusters/utils';
import FormatDiskWarning from './FormatDiskWarning';

const InformationAndAlerts: React.FC<{
  cluster: Cluster;
  HostRequirementsContent: HostRequirementsLinkProps['ContentComponent'];
  setDiscoveryHintModalOpen: HostsNotShowingLinkProps['setDiscoveryHintModalOpen'];
}> = ({ cluster, HostRequirementsContent, setDiscoveryHintModalOpen }) => (
  <>
    <Text component="h3">Information and warnings</Text>
    <Text component="p">
      <HostRequirementsLink clusterId={cluster.id} ContentComponent={HostRequirementsContent} />
      <HostsNotShowingLink setDiscoveryHintModalOpen={setDiscoveryHintModalOpen} />
    </Text>
    <VMRebootConfigurationInfo hosts={cluster.hosts || []} />
    {!isAddHostsCluster(cluster) && <OCSDisksManualFormattingHint />}
    <FormatDiskWarning />
  </>
);

export default InformationAndAlerts;
