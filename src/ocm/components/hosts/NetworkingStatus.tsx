import React from 'react';
import { Host } from '../../../common';
import { ValidationsInfo } from '../../../common/types/hosts';
import HostStatus from './HostStatus';
import {
  getFailingClusterWizardSoftValidationIds,
  getWizardStepHostStatus,
  getWizardStepHostValidationsInfo,
} from '../clusterWizard/wizardTransition';

type NetworkingStatusProps = {
  host: Host;
  validationsInfo: ValidationsInfo;
  onEditHostname?: () => void;
};

const NetworkingStatus: React.FC<NetworkingStatusProps> = (props) => {
  const networkingStatus = getWizardStepHostStatus(props.host, 'networking');
  const validationsInfo = getWizardStepHostValidationsInfo(props.validationsInfo, 'networking');
  const sublabel = getFailingClusterWizardSoftValidationIds(validationsInfo, 'networking').length
    ? 'Some validations failed'
    : undefined;

  return (
    <HostStatus
      {...props}
      statusOverride={networkingStatus}
      validationsInfo={validationsInfo}
      sublabel={sublabel}
    />
  );
};

export default NetworkingStatus;
