import React from 'react';
import { Text, TextContent, Button, Stack, StackItem } from '@patternfly/react-core';
import { Cluster } from '../../api/types';
import HostsDiscoveryTable from '../hosts/HostsDiscoveryTable';
import { useFeature } from '../../features/featureGate';
import CheckboxField from '../ui/formik/CheckboxField';
import { isSingleNodeCluster } from '../clusters/utils';
import DiscoveryInstructions from './DiscoveryInstructions';
import { PopoverIcon } from '../ui';
import { DiscoveryImageModalButton } from './discoveryImageModal';
import { DiscoveryTroubleshootingModal } from './DiscoveryTroubleshootingModal';
import InformationAndAlerts from './InformationAndAlerts';
import {
  HostRequirementsContent,
  SingleHostRequirementsContent,
  CNVHostRequirementsContent,
} from '../hosts/HostRequirementsContent';
import ClusterWizardStepHeader from '../clusterWizard/ClusterWizardStepHeader';
import { HelpIcon } from '@patternfly/react-icons';

const OCSLabel: React.FC = () => (
  <>
    Install OpenShift Container Storage
    {/* TODO(mlibra): List of OCS requierements is stabilizing now - https://issues.redhat.com/browse/MGMT-4220 )
    <PopoverIcon
      component={'a'}
      variant={'plain'}
      IconComponent={HelpIcon}
      minWidth="50rem"
      headerContent="Additional Requirements"
      bodyContent={<>FOO BAR </>}/>
    */}
  </>
);

const CNVLabel: React.FC<{ clusterId: Cluster['id']; isSingleNode?: boolean }> = ({
  clusterId,
  isSingleNode,
}) => {
  return (
    <>
      Install OpenShift Virtualization{' '}
      <PopoverIcon
        component={'a'}
        variant={'plain'}
        IconComponent={HelpIcon}
        minWidth="50rem"
        headerContent="Additional Requirements"
        bodyContent={
          <CNVHostRequirementsContent clusterId={clusterId} isSingleNode={isSingleNode} />
        }
      />
    </>
  );
};

const HostInventory: React.FC<{ cluster: Cluster }> = ({ cluster }) => {
  const [isDiscoveryHintModalOpen, setDiscoveryHintModalOpen] = React.useState(false);
  const isOpenshiftClusterStorageEnabled = useFeature('ASSISTED_INSTALLER_OCS_FEATURE');
  const isContainerNativeVirtualizationEnabled = useFeature('ASSISTED_INSTALLER_CNV_FEATURE');
  const isSNO = isSingleNodeCluster(cluster);

  return (
    <Stack hasGutter>
      <StackItem>
        <ClusterWizardStepHeader cluster={cluster}>Host discovery</ClusterWizardStepHeader>
      </StackItem>
      <StackItem>
        <TextContent>
          <DiscoveryInstructions isSingleNodeCluster={isSNO} />
          <Text component="p">
            <DiscoveryImageModalButton
              ButtonComponent={Button}
              cluster={cluster}
              idPrefix="host-inventory"
            />
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        {isContainerNativeVirtualizationEnabled && (
          <CheckboxField
            name="useContainerNativeVirtualization"
            label={<CNVLabel clusterId={cluster.id} isSingleNode={isSNO} />}
            helperText="Run virtual machines along containers."
          />
        )}
      </StackItem>
      <StackItem>
        {isOpenshiftClusterStorageEnabled && !isSNO && (
          <CheckboxField
            name="useExtraDisksForLocalStorage"
            label={<OCSLabel />}
            helperText="Persistent software-defined storage for hybrid applications."
          />
        )}
      </StackItem>
      <StackItem>
        <TextContent>
          <InformationAndAlerts
            cluster={cluster}
            HostRequirementsContent={
              isSNO ? SingleHostRequirementsContent : HostRequirementsContent
            }
            setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
          />
        </TextContent>
      </StackItem>
      <StackItem>
        <HostsDiscoveryTable
          cluster={cluster}
          setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
        />
      </StackItem>
      <DiscoveryTroubleshootingModal
        isOpen={isDiscoveryHintModalOpen}
        setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
      />
    </Stack>
  );
};
export default HostInventory;
