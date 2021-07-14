import { saveAs } from 'file-saver';
import { AlertsContextType, Cluster, ClusterUpdateParams, Host, Presigned } from '../../../common';

import {
  getHostLogsDownloadUrl,
  ocmClient,
  handleApiError,
  getErrorMessage,
  getPresignedFileUrl,
  patchCluster,
} from '../../api';
import { updateCluster } from '../../reducers/clusters';

export const downloadHostInstallationLogs = async (
  addAlert: AlertsContextType['addAlert'],
  host: Host,
) => {
  if (ocmClient) {
    try {
      const { data } = await getPresignedFileUrl({
        clusterId: host.clusterId || 'UNKNOWN_CLUSTER',
        fileName: 'logs',
        hostId: host.id,
        logsType: 'host',
      });
      saveAs(data.url);
    } catch (e) {
      handleApiError<Presigned>(e, async (e) => {
        addAlert({ title: 'Could not download host logs.', message: getErrorMessage(e) });
      });
    }
  } else {
    saveAs(getHostLogsDownloadUrl(host.id, host.clusterId));
  }
};

export const onAdditionalNtpSourceAction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: (payload: any) => void,
  clusterId: Cluster['id'],
  additionalNtpSource: string,
  onError: (message: string) => void,
) => {
  try {
    const values: ClusterUpdateParams = {
      additionalNtpSource,
    };

    const { data } = await patchCluster(clusterId, values);
    dispatch(updateCluster(data));
  } catch (e) {
    handleApiError<ClusterUpdateParams>(e, () => onError(getErrorMessage(e)));
  }
};
