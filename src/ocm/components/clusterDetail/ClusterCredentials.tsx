import React from 'react';
import { GridItem, Button, ClipboardCopy, clipboardCopyFunc } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { LoadingState, ErrorState } from '../ui/uiState';
import { Credentials, Cluster } from '../../../common';
import { TroubleshootingOpenshiftConsoleButton } from './ConsoleModal';
import { DetailList, DetailItem } from '../ui/DetailList';

type ClusterCredentialsProps = {
  cluster: Cluster;
  error: boolean;
  retry: () => void;
  credentials?: Credentials;
  idPrefix?: string;
};

const ClusterCredentials: React.FC<ClusterCredentialsProps> = ({
  cluster,
  credentials,
  error,
  retry,
  idPrefix = 'cluster-creds',
}) => {
  let credentialsBody: JSX.Element;
  if (error) {
    credentialsBody = <ErrorState title="Failed to fetch cluster credentials." fetchData={retry} />;
  } else if (!credentials) {
    credentialsBody = <LoadingState />;
  } else {
    credentialsBody = (
      <DetailList>
        <DetailItem
          title="Web Console URL"
          value={
            <>
              <Button
                variant="link"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
                isInline
                onClick={() => window.open(credentials.consoleUrl, '_blank', 'noopener')}
                data-testid={`${idPrefix}-link-console-url`}
              >
                {credentials.consoleUrl}
              </Button>
              <br />
              <TroubleshootingOpenshiftConsoleButton
                consoleUrl={credentials.consoleUrl}
                cluster={cluster}
                idPrefix={idPrefix}
              />
            </>
          }
        />
        <DetailItem title="Username" value={credentials.username} />
        <DetailItem
          title="Password"
          value={
            <ClipboardCopy
              isReadOnly
              onCopy={(event) => clipboardCopyFunc(event, credentials.password)}
            >
              &bull;&bull;&bull;&bull;&bull;
            </ClipboardCopy>
          }
        />
      </DetailList>
    );
  }

  return <GridItem span={12}>{credentialsBody}</GridItem>;
};

export default ClusterCredentials;
