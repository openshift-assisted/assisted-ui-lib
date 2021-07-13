import React from 'react';
import { saveAs } from 'file-saver';
import { GridItem, Button, ButtonVariant } from '@patternfly/react-core';
import { getPresignedFileUrl, getClusterFileDownload } from '../../api/clusters';
import { Cluster, Presigned } from '../../../common';
import { canDownloadKubeconfig } from '../hosts/utils';
import { useAlerts } from '../AlertsContextProvider';
import { getErrorMessage, handleApiError, ocmClient } from '../../api';

type KubeconfigDownloadProps = {
  clusterId: Cluster['id'];
  status: Cluster['status'];
  id?: string;
};

const KubeconfigDownload: React.FC<KubeconfigDownloadProps> = ({ clusterId, status, id }) => {
  const { addAlert } = useAlerts();

  const download = React.useCallback(
    async (clusterId: Cluster['id'], status: Cluster['status']) => {
      const fileName = status === 'installed' ? 'kubeconfig' : 'kubeconfig-noingress';
      if (ocmClient) {
        try {
          const { data } = await getPresignedFileUrl({ clusterId, fileName });
          saveAs(data.url);
        } catch (e) {
          handleApiError<Presigned>(e, async (e) => {
            addAlert({ title: 'Could not download kubeconfig', message: getErrorMessage(e) });
          });
        }
      } else {
        try {
          const response = await getClusterFileDownload(clusterId, fileName);
          const contentHeader = response.headers.contentDisposition;
          const name = contentHeader?.match(/filename="(.+)"/)?.[1];
          saveAs(response.data, name);
        } catch (e) {
          handleApiError(e, async (e) => {
            addAlert({ title: 'Could not download kubeconfig', message: getErrorMessage(e) });
          });
        }
      }
    },
    [addAlert],
  );

  return (
    <GridItem>
      <Button
        variant={ButtonVariant.secondary}
        onClick={() => download(clusterId, status)}
        isDisabled={!canDownloadKubeconfig(status)}
        id={id}
        data-testid={id}
      >
        Download kubeconfig
      </Button>
    </GridItem>
  );
};

export default KubeconfigDownload;
