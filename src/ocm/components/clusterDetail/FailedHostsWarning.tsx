import React from 'react';
import { GridItem, Alert, AlertVariant, TextContent, Text } from '@patternfly/react-core';
import { Cluster, Host } from '../../../common';

type FailedHostsWarningProps = {
  cluster: Cluster;
};

type FailedHostsProps = {
  failedHosts: Host[];
  title: string;
  titleSingle: string;
  text: string;
};

const FailedHosts: React.FC<FailedHostsProps> = ({ failedHosts, title, titleSingle, text }) => {
  if (failedHosts.length === 0) {
    return null;
  }

  return (
    <GridItem>
      <Alert
        variant={AlertVariant.warning}
        title={failedHosts.length === 1 ? titleSingle : title}
        isInline
      >
        <TextContent>
          <Text component="p">{text}</Text>
        </TextContent>
      </Alert>
    </GridItem>
  );
};

const FailedHostsWarning: React.FC<FailedHostsWarningProps> = ({ cluster }) => {
  const failedHosts =
    cluster.hosts?.filter((host) => host.role === 'worker' && host.status === 'error') || [];

  const failedBootOrder =
    cluster.hosts?.filter((host) => host.status === 'installing-pending-user-action') || [];

  const failedBootOrderText =
    "Please reconfigure each host's BIOS to boot from the disk where OpenShift was installed instead of the Discovery ISO.";

  let failedHostsText = 'Error information for each host is available below.';
  if (cluster.status !== 'finalizing') {
    failedHostsText += ' Debug and reboot each failed worker to retry their installation.';
  }

  return (
    <>
      <FailedHosts
        failedHosts={failedBootOrder}
        title={`${failedBootOrder.length} hosts have an incorrect boot order`}
        titleSingle="1 host has an incorrect boot order"
        text={failedBootOrderText}
      />
      <FailedHosts
        failedHosts={failedHosts}
        title={`${failedHosts.length} worker hosts failed to install`}
        titleSingle="1 worker host failed to install"
        text={failedHostsText}
      />
    </>
  );
};

export default FailedHostsWarning;
