import React, { PropsWithChildren } from 'react';
import {
  Popover,
  Button,
  Text,
  TextContent,
  FlexItem,
  Flex,
  ButtonProps,
} from '@patternfly/react-core';
import {
  global_danger_color_100 as dangerColor,
  global_warning_color_100 as warningColor,
  global_success_color_100 as okColor,
} from '@patternfly/react-tokens';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InProgressIcon,
  DisconnectedIcon,
  ConnectedIcon,
  BanIcon,
  PendingIcon,
  AddCircleOIcon,
} from '@patternfly/react-icons';
import { PopoverProps } from '@patternfly/react-core/dist/js/components/Popover/Popover';
import hdate from 'human-date';

import { Host } from '../../api';
import { ValidationsInfo } from '../../types/hosts';
import { HOST_STATUS_DETAILS, HOST_STATUS_LABELS } from '../../config';
import { getHumanizedDateTime } from '../ui';

import HostProgress from './HostProgress';
import { getHostProgressStageNumber, getHostProgressStages } from './utils';
import { HostValidationGroups, ValidationInfoActionProps } from './HostValidationGroups';
import OcpConsoleNodesSectionLink from './OcpConsoleNodesSectionLink';
import { toSentence } from '../ui/table/utils';
import { RenderIf, RenderIfElse } from '../ui/RenderIf';

const getStatusIcon = (status: Host['status']) => {
  let icon = null;
  switch (status) {
    case 'discovering':
      icon = <ConnectedIcon />;
      break;
    case 'pending-for-input':
      icon = <PendingIcon />;
      break;
    case 'disconnected':
      icon = <DisconnectedIcon />;
      break;
    case 'cancelled':
    case 'disabled':
      icon = <BanIcon />;
      break;
    case 'error':
      icon = <ExclamationCircleIcon color={dangerColor.value} />;
      break;
    case 'resetting-pending-user-action':
    case 'insufficient':
    case 'installing-pending-user-action':
      icon = <ExclamationTriangleIcon color={warningColor.value} />;
      break;
    case 'known':
    case 'installed':
      icon = <CheckCircleIcon color={okColor.value} />;
      break;
    case 'preparing-for-installation':
    case 'preparing-successful':
    case 'installing':
    case 'installing-in-progress':
    case 'resetting':
      icon = <InProgressIcon />;
      break;
    case 'added-to-existing-cluster':
      icon = <AddCircleOIcon />;
      break;
  }

  return icon;
};

const withProgress = (
  title: string,
  currentStage: number,
  totalStages: number,
  status: HostStatusProps['statusOverride'] | Host['status'],
) => {
  const shouldAppendProgress = [
    'installing',
    'installing-in-progress',
    'error',
    'cancelled',
  ].includes(status || '');
  return shouldAppendProgress ? `${title} ${currentStage}/${totalStages}` : title;
};

type HostStatusPopoverContentProps = ValidationInfoActionProps & {
  validationsInfo: ValidationsInfo;
};

const HostStatusPopoverContent: React.FC<HostStatusPopoverContentProps> = (props) => {
  const { host } = props;
  const { status, statusInfo } = host;
  const statusDetails = HOST_STATUS_DETAILS[status];

  if (status === 'added-to-existing-cluster') {
    return (
      <TextContent>
        <Text>
          This host was successfully installed.
          <br />
          To finish adding it to the cluster, approve its request to join in the Nodes section of
          the OpenShift console. It might take a few minutes till the node request gets available.
        </Text>
      </TextContent>
    );
  }

  if (['installing', 'installing-in-progress'].includes(status)) {
    return (
      <TextContent>
        <HostProgress host={host} />
      </TextContent>
    );
  }

  if (['error', 'cancelled', 'installing-pending-user-action'].includes(status)) {
    return (
      <TextContent>
        <Text>
          {statusDetails}
          <br />
          {toSentence(statusInfo)}
        </Text>
        <HostProgress host={host} />
      </TextContent>
    );
  }

  if (['installed'].includes(status)) {
    return (
      <TextContent>
        <Text>{statusDetails}</Text>
        <HostProgress host={host} />
      </TextContent>
    );
  }

  return (
    <>
      {statusDetails && (
        <TextContent>
          <Text>{statusDetails}</Text>
        </TextContent>
      )}
      <HostValidationGroups {...props} />
    </>
  );
};

const HostStatusPopoverFooter: React.FC<{ host: Host }> = ({ host }) => {
  const { progress, statusUpdatedAt } = host;

  if (host.status === 'added-to-existing-cluster') {
    return (
      <OcpConsoleNodesSectionLink
        id={`host-status-detail-link-to-ocp-nodes-${host.requestedHostname || host.id}`}
      />
    );
  }

  let footerText;
  if (host.status === 'installing-in-progress') {
    if (progress?.stageUpdatedAt && progress.stageUpdatedAt != progress.stageStartedAt) {
      footerText = `Step started at ${getHumanizedDateTime(
        progress.stageStartedAt,
      )}, updated ${hdate.relativeTime(progress.stageUpdatedAt)}`;
    } else {
      footerText = `Step started at ${getHumanizedDateTime(
        progress?.stageStartedAt || statusUpdatedAt,
      )}`;
    }
  } else {
    footerText = `Status updated at ${getHumanizedDateTime(statusUpdatedAt)}`;
  }

  return <small>{footerText}</small>;
};

const WithHostStatusPopover = (
  props: PropsWithChildren<{
    hideOnOutsideClick: PopoverProps['hideOnOutsideClick'];
    host: Host;
    onEditHostName: HostStatusPopoverContentProps['onEditHostname'];
    onAdditionalNtpSource: ValidationInfoActionProps['onAdditionalNtpSource'];
    AdditionalNTPSourcesDialogToggleComponent: ValidationInfoActionProps['AdditionalNTPSourcesDialogToggleComponent'];
    title: string;
    validationsInfo: ValidationsInfo;
    isSmall?: ButtonProps['isSmall'];
  }>,
) => (
  <Popover
    headerContent={<div>{props.title}</div>}
    bodyContent={<HostStatusPopoverContent {...props} />}
    footerContent={<HostStatusPopoverFooter host={props.host} />}
    minWidth="30rem"
    maxWidth="50rem"
    hideOnOutsideClick={props.hideOnOutsideClick}
    zIndex={300}
  >
    <Button variant={'link'} isInline isSmall={props.isSmall}>
      {props.children}
    </Button>
  </Popover>
);

type HostStatusProps = {
  host: Host;
  validationsInfo: ValidationsInfo;
  onEditHostname?: () => void;
  statusOverride?: Host['status'];
  sublabel?: string;
  onAdditionalNtpSource?: ValidationInfoActionProps['onAdditionalNtpSource'];
  AdditionalNTPSourcesDialogToggleComponent?: ValidationInfoActionProps['AdditionalNTPSourcesDialogToggleComponent'];
};

const HostStatus: React.FC<HostStatusProps> = ({
  host,
  validationsInfo,
  statusOverride,
  sublabel,
  onEditHostname,
  AdditionalNTPSourcesDialogToggleComponent,
  onAdditionalNtpSource,
}) => {
  const [keepOnOutsideClick, onValidationActionToggle] = React.useState(false);
  const status = statusOverride || host.status || '';
  const title = HOST_STATUS_LABELS[status] || status;
  const icon = getStatusIcon(status);
  const stages = getHostProgressStages(host);
  const stageNumber = getHostProgressStageNumber(host);

  const toggleHostname = React.useCallback(() => {
    onValidationActionToggle(!keepOnOutsideClick);
    onEditHostname?.();
  }, [keepOnOutsideClick, onEditHostname]);

  sublabel =
    sublabel ||
    (['installing-pending-user-action', 'disconnected'].includes(status) && 'Action required') ||
    (status === 'added-to-existing-cluster' && 'Finish in console') ||
    undefined;

  const titleWithProgress = withProgress(title, stageNumber, stages.length, status);

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }}>
      <FlexItem className={'pf-u-mr-xs'}>{icon}</FlexItem>

      <Flex direction={{ default: 'column' }}>
        <RenderIfElse
          condition={!sublabel}
          truthy={
            <WithHostStatusPopover
              hideOnOutsideClick={!keepOnOutsideClick}
              host={host}
              onEditHostName={toggleHostname}
              onAdditionalNtpSource={onAdditionalNtpSource}
              AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggleComponent}
              title={title}
              validationsInfo={validationsInfo}
            >
              {titleWithProgress}
            </WithHostStatusPopover>
          }
          falsy={<FlexItem className={'pf-u-mb-0'}>{titleWithProgress}</FlexItem>}
        />

        <RenderIf condition={Boolean(sublabel)}>
          <FlexItem
            className={'pf-u-font-size-xs'}
            style={{ marginTop: 'calc(-1 * var(--pf-l-flex--spacer--xs))' }}
          >
            <WithHostStatusPopover
              hideOnOutsideClick={!keepOnOutsideClick}
              host={host}
              onEditHostName={toggleHostname}
              onAdditionalNtpSource={onAdditionalNtpSource}
              AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggleComponent}
              title={title}
              validationsInfo={validationsInfo}
            >
              {sublabel}
            </WithHostStatusPopover>
          </FlexItem>
        </RenderIf>
      </Flex>
    </Flex>
  );
};

export default HostStatus;
