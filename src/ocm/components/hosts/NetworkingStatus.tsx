import React from 'react';
import { useDispatch } from 'react-redux';
import { HostStatus, ValidationInfoActionProps } from '../../../common';
import { HostNetworkingStatusComponentProps } from '../../../common/components/hosts/NetworkingHostsTable';
import {
  getFailingClusterWizardSoftValidationIds,
  getWizardStepHostStatus,
  getWizardStepHostValidationsInfo,
} from '../clusterWizard/wizardTransition';
import { AdditionalNTPSourcesDialogToggle } from './AdditionaNTPSourceDialogToggle';
import { onAdditionalNtpSourceAction } from './utils';

const NetworkingStatus: React.FC<HostNetworkingStatusComponentProps> = (props) => {
  const dispatch = useDispatch();

  const networkingStatus = getWizardStepHostStatus(props.host, 'networking');
  const validationsInfo = getWizardStepHostValidationsInfo(props.validationsInfo, 'networking');
  const sublabel = getFailingClusterWizardSoftValidationIds(validationsInfo, 'networking').length
    ? 'Some validations failed'
    : undefined;

  const onAdditionalNtpSource: ValidationInfoActionProps['onAdditionalNtpSource'] = async (
    ...args
  ) => await onAdditionalNtpSourceAction(dispatch, props.clusterId, ...args);

  return (
    <HostStatus
      {...props}
      statusOverride={networkingStatus}
      validationsInfo={validationsInfo}
      sublabel={sublabel}
      AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggle}
      onAdditionalNtpSource={onAdditionalNtpSource}
    />
  );
};

export default NetworkingStatus;
