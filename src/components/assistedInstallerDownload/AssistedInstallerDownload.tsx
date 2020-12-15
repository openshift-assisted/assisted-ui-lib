import React from 'react';
import {
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  TextList,
  TextListItem,
} from '@patternfly/react-core';
import { AlertsContext, AlertsContextProvider } from '../AlertsContextProvider';
import AssistedInstallerDownloadForm from './AssistedInstallerDownloadForm';
import { usePullSecretFetch } from '../fetching/pullSecret';
import LoadingState from '../ui/uiState/LoadingState';
import { Cluster } from '../../api/types';
import AssistedInstallerDownloadImageInfo from './AssistedInstallerDownloadImageInfo';
import { Alerts } from '../ui/AlertsSection';

const AssistedInstallerDownload: React.FC = () => {
  const pullSecret = usePullSecretFetch();
  const { alerts } = React.useContext(AlertsContext);
  const [imageInfo, setImageInfo] = React.useState<Cluster['imageInfo'] | undefined>();

  if (pullSecret === undefined) {
    return <LoadingState />;
  }

  return (
    <Stack hasGutter>
      {!!alerts.length && (
        <StackItem>
          <Alerts />
        </StackItem>
      )}
      <StackItem>
        <TextContent>
          <Text component={TextVariants.p}>
            Run the Assisted Installer locally to easily create clusters on-premises in connected,
            disconnected, or airgapped environments without a direct internet connection.
          </Text>
          <Text component={TextVariants.h2}>What you'll need</Text>
          <TextList>
            <TextListItem>
              An local internet-connected device to boot the Assisted Installer ISO
            </TextListItem>
            <TextListItem>Hosts that are on the same network as that device</TextListItem>
          </TextList>
        </TextContent>
      </StackItem>
      <StackItem>
        {imageInfo ? (
          <AssistedInstallerDownloadImageInfo
            imageInfo={imageInfo}
            onReset={() => setImageInfo(undefined)}
          />
        ) : (
          <AssistedInstallerDownloadForm pullSecret={pullSecret} setImageInfo={setImageInfo} />
        )}
      </StackItem>
    </Stack>
  );
};

const AlertsWrapper = () => (
  <AlertsContextProvider>
    <AssistedInstallerDownload />
  </AlertsContextProvider>
);

export default AlertsWrapper;
