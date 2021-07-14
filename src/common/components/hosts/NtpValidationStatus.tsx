import React from 'react';
import { Validation, ValidationsInfo } from '../../../common/types/hosts';
import HostPropertyValidationPopover from './HostPropertyValidationPopover';

const getLabel = (validationStatus?: Validation['status']) => {
  switch (validationStatus) {
    case 'failure':
      return 'Unreachable';
    case 'success':
      return 'Synced';
    default:
      return 'Pending';
  }
};

type NtpValidationsStatusProps = {
  validationsInfo: ValidationsInfo;
  AdditionalNTPSourcesDialogToggleComponent: React.FC;
};

const NtpValidationStatus: React.FC<NtpValidationsStatusProps> = ({
  validationsInfo,
  AdditionalNTPSourcesDialogToggleComponent,
}) => {
  const ntpSyncedValidation = validationsInfo.network?.find((v) => v.id === 'ntp-synced');
  const actions = [<AdditionalNTPSourcesDialogToggleComponent key="add-ntp-sources" />];
  return (
    <HostPropertyValidationPopover
      validation={ntpSyncedValidation}
      failureActions={actions}
      pendingActions={actions}
      showSuccess
      showPending
    >
      {getLabel(ntpSyncedValidation?.status)}
    </HostPropertyValidationPopover>
  );
};
export default NtpValidationStatus;
