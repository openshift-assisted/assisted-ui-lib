import React from 'react';
import { List, ListItem, Text, TextContent } from '@patternfly/react-core';

import {
  Cluster,
  PreflightHardwareRequirements,
  OPERATOR_NAME_CNV,
  ErrorState,
  ExternalLink,
  LoadingState,
  fileSize,
  RenderIf,
  alertsSlice,
} from '../../../common';
import { getClusterPreflightRequirements, getErrorMessage, handleApiError } from '../../api';

const { addAlert } = alertsSlice.actions;

export type PreflightHWRequirementsContentComponent = React.FC<{
  clusterId: Cluster['id'];
  isSingleNode?: boolean;
}>;

const useClusterPreflightRequirements = (clusterId: Cluster['id']) => {
  const [preflightRequirements, setPreflightRequirements] = React.useState<
    PreflightHardwareRequirements
  >();
  const [error, setError] = React.useState();

  React.useEffect(() => {
    const fetchFunc = async () => {
      try {
        const { data } = await getClusterPreflightRequirements(clusterId);
        setPreflightRequirements(data);
      } catch (e) {
        setError(e);
        // report error systematically at one place show defaults instead
        handleApiError(e, () =>
          addAlert({
            title: 'Failed to retrieve preflight cluster requirements',
            message: getErrorMessage(e),
          }),
        );
      }
    };
    fetchFunc();
  }, [setPreflightRequirements, setError, clusterId]);

  return {
    preflightRequirements,
    error,
    isLoading: !error && !preflightRequirements,
  };
};

// Day-2 flow
export const AddHostRequirementsContent: PreflightHWRequirementsContentComponent = ({
  clusterId,
}) => {
  const { preflightRequirements, error, isLoading } = useClusterPreflightRequirements(clusterId);

  if (isLoading) {
    return <LoadingState content="Loading hardware requirements ..." />;
  }
  if (error) {
    return <ErrorState />;
  }

  const worker = preflightRequirements?.ocp?.worker?.quantitative;
  const workerRam = fileSize((worker?.ramMib || 8 * 1024) * 1024 * 1024, 2, 'iec');

  return (
    <TextContent>
      <Text component="p">
        Worker hosts must have at least {worker?.cpuCores || 2} CPU cores, {workerRam} of RAM, and{' '}
        {worker?.diskSizeGb || 120} GB of filesystem storage.
      </Text>
    </TextContent>
  );
};

// Regular multi-node deployment
export const HostRequirementsContent: PreflightHWRequirementsContentComponent = ({ clusterId }) => {
  const { preflightRequirements, error, isLoading } = useClusterPreflightRequirements(clusterId);

  if (isLoading) {
    return <LoadingState content="Loading hardware requirements ..." />;
  }
  if (error) {
    return <ErrorState />;
  }

  const master = preflightRequirements?.ocp?.master?.quantitative;
  const worker = preflightRequirements?.ocp?.worker?.quantitative;

  const masterRam = fileSize((master?.ramMib || 16 * 1024) * 1024 * 1024, 2, 'iec');
  const workerRam = fileSize((worker?.ramMib || 8 * 1024) * 1024 * 1024, 2, 'iec');

  return (
    <TextContent>
      <List>
        <ListItem>
          Masters: At least {master?.cpuCores || 4} CPU cores, {masterRam} RAM,{' '}
          {master?.diskSizeGb || 120} GB filesystem for every supervisor.
        </ListItem>
        <ListItem>
          Workers: At least {worker?.cpuCores || 2} CPU cores, {workerRam} RAM,{' '}
          {worker?.diskSizeGb || 120} GB filesystem for each worker
        </ListItem>
        <ListItem>
          Also note that each hosts' disk write speed should meet the minimum requirements to run
          OpenShift.{' '}
          <ExternalLink href={'https://access.redhat.com/solutions/4885641'}>
            Learn more
          </ExternalLink>
        </ListItem>
      </List>
    </TextContent>
  );
};

// For Single Node Operator
export const SingleHostRequirementsContent: PreflightHWRequirementsContentComponent = ({
  clusterId,
}) => {
  const { preflightRequirements, error, isLoading } = useClusterPreflightRequirements(clusterId);

  if (isLoading) {
    return <LoadingState content="Loading hardware requirements ..." />;
  }
  if (error) {
    return <ErrorState />;
  }

  const master = preflightRequirements?.ocp?.master?.quantitative;
  const masterRam = fileSize((master?.ramMib || 16 * 1024) * 1024 * 1024, 2, 'iec');

  return (
    <TextContent>
      <Text component="p">
        One host is required with at least {master?.cpuCores || 4} CPU cores, {masterRam} of RAM,
        and {master?.diskSizeGb || 120} GB of filesystem storage.
      </Text>
    </TextContent>
  );
};

export const CNVHostRequirementsContent: PreflightHWRequirementsContentComponent = ({
  clusterId,
  isSingleNode = false,
}) => {
  const { preflightRequirements, error, isLoading } = useClusterPreflightRequirements(clusterId);

  if (isLoading) {
    return <LoadingState content="Loading hardware requirements ..." />;
  }
  if (error) {
    return <ErrorState />;
  }

  const cnvRequirements = preflightRequirements?.operators?.find(
    (operatorRequirements) => operatorRequirements.operatorName === OPERATOR_NAME_CNV,
  );

  const workerRequirements = cnvRequirements?.requirements?.worker?.quantitative;
  const masterRequirements = cnvRequirements?.requirements?.master?.quantitative;

  return (
    <TextContent>
      <List>
        <ListItem>
          Enabled CPU virtualization support in BIOS (Intel-VT / AMD-V) on all nodes
        </ListItem>
        <RenderIf condition={!isSingleNode}>
          <ListItem>
            Each worker node requires an additional {workerRequirements?.ramMib || 360} MiB of
            memory {workerRequirements?.diskSizeGb ? ',' : ' and'}{' '}
            {workerRequirements?.cpuCores || 2} CPUs
            {workerRequirements?.diskSizeGb
              ? ` and ${workerRequirements?.diskSizeGb} storage space`
              : ''}
          </ListItem>
        </RenderIf>
        <ListItem>
          Each supervisor node requires an additional {masterRequirements?.ramMib || 150} MiB of
          memory {masterRequirements?.diskSizeGb ? ',' : ' and'} {masterRequirements?.cpuCores || 4}{' '}
          CPUs
          {masterRequirements?.diskSizeGb
            ? ` and ${masterRequirements?.diskSizeGb} storage space`
            : ''}
        </ListItem>
        <ListItem>
          OpenShift Data Foundation (recommended for full functionality) or another persistent
          storage service
        </ListItem>
      </List>
    </TextContent>
  );
};
