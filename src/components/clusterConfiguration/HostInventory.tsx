import React from 'react';
import {
  Text,
  TextContent,
  Button,
  Stack,
  StackItem,
  List,
  ListItem,
} from '@patternfly/react-core';
import { Cluster } from '../../api/types';
import HostsDiscoveryTable from '../hosts/HostsDiscoveryTable';
import { useFeature } from '../../features/featureGate';
import CheckboxField from '../ui/formik/CheckboxField';
import { isSingleNodeCluster } from '../clusters/utils';
import DiscoveryInstructions from './DiscoveryInstructions';
import { PopoverIcon } from '../ui';
import { OPERATOR_NAME_CNV } from '../../config';
import { fileSize } from '../hosts/utils';
import { DiscoveryImageModalButton } from './discoveryImageModal';
import { DiscoveryTroubleshootingModal } from './DiscoveryTroubleshootingModal';
import InformationAndAlerts from './InformationAndAlerts';
import { useClusterPreflightRequirementsContext } from './ClusterPreflightRequirementsContext';

const HostRequirementsContent = () => {
  const { preflightRequirements } = useClusterPreflightRequirementsContext();

  const master = preflightRequirements?.ocp?.master?.quantitative;
  const worker = preflightRequirements?.ocp?.worker?.quantitative;

  const masterRam = fileSize((master?.ramMib || 16 * 1024) * 1024 * 1024, 2, 'iec');
  const workerRam = fileSize((worker?.ramMib || 8 * 1024) * 1024 * 1024, 2, 'iec');

  // TODO(mlibra): this needs rephrasing to bullets, etc.
  return (
    <Text component="p">
      Three supervisor hosts are required with at least {master?.cpuCores || 4} CPU cores,{' '}
      {masterRam} of RAM, and {master?.diskSizeGb || 120} GB of filesystem storage each. Two or more
      additional worker hosts are recommended with at least {worker?.cpuCores || 2} CPU cores,{' '}
      {workerRam} of RAM, and {worker?.diskSizeGb || 120} GB of filesystem storage each.
    </Text>
  );
};

const SingleHostRequirementsContent = () => {
  const { preflightRequirements } = useClusterPreflightRequirementsContext();

  const master = preflightRequirements?.ocp?.master?.quantitative;
  const masterRam = fileSize((master?.ramMib || 16 * 1024) * 1024 * 1024, 2, 'iec');

  return (
    <Text component="p">
      One host is required with at least {master?.cpuCores || 4} CPU cores, {masterRam} of RAM, and{' '}
      {master?.diskSizeGb || 120} GB of filesystem storage.
    </Text>
  );
};

const OCSLabel: React.FC = () => (
  <>
    Install OpenShift Container Storage
    {/* TODO(mlibra): List of OCS requierements is stabilizing now - https://issues.redhat.com/browse/MGMT-4220 )
    <PopoverIcon headerContent="Additional Requirements" bodyContent={<>FOO BAR </>} />*/}
  </>
);

const CNVLabel: React.FC = () => {
  const { preflightRequirements } = useClusterPreflightRequirementsContext();

  const cnvRequirements = preflightRequirements?.operators?.find(
    (operatorRequirements) => operatorRequirements.operatorName === OPERATOR_NAME_CNV,
  );

  const workerRequirements = cnvRequirements?.requirements?.worker?.quantitative;
  const masterRequirements = cnvRequirements?.requirements?.master?.quantitative;

  return (
    <>
      Install OpenShift Virtualization{' '}
      <PopoverIcon
        headerContent="Additional requirements for OpenShift Virtualization"
        className="margin-left-md"
        hasAutoWidth
        maxWidth="50rem"
        bodyContent={
          <TextContent>
            <List>
              <ListItem>
                Enabled CPU virtualization support in BIOS (Intel-VT / AMD-V) on all worker nodes.
              </ListItem>
              <ListItem>
                Each worker node requires an additional {workerRequirements?.ramMib || 360} MiB of
                memory {workerRequirements?.diskSizeGb ? ',' : ' and'}{' '}
                {workerRequirements?.cpuCores || 2} CPUs
                {workerRequirements?.diskSizeGb
                  ? ` and ${workerRequirements?.diskSizeGb} storage space`
                  : ''}
                .
              </ListItem>
              <ListItem>
                Each supervisor node requires an additional {masterRequirements?.ramMib || 150} MiB
                of memory {masterRequirements?.diskSizeGb ? ',' : ' and'}{' '}
                {masterRequirements?.cpuCores || 4} CPUs
                {masterRequirements?.diskSizeGb
                  ? ` and ${masterRequirements?.diskSizeGb} storage space`
                  : ''}
                .
              </ListItem>
              {/* TODO(mlibra): Wording of storage requirements needs special care - https://issues.redhat.com/browse/MGMT-5284
              <ListItem>either Cluster or Local Storage (the LSO operator will be added by default)</ListItem>
              */}
            </List>
          </TextContent>
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
        <TextContent>
          <Text component="h2">Host Discovery</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent>
          <DiscoveryInstructions />
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
            label={<CNVLabel />}
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
