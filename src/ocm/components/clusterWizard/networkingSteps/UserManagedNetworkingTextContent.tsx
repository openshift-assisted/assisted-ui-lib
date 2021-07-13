import React from 'react';
import { List, ListItem, Text, TextContent } from '@patternfly/react-core';
import { OPENSHIFT_NETWORKING_DOCS_LINK } from '../../../../common';
import { ExternalLink } from '../../ui';
import { RenderIf } from '../../ui/RenderIf';

export interface UserManagedNetworkingTextContentProps {
  shouldDisplayLoadBalancersBullet?: boolean;
}

export const UserManagedNetworkingTextContent = ({
  shouldDisplayLoadBalancersBullet = false,
}: UserManagedNetworkingTextContentProps) => {
  return (
    <TextContent>
      <Text component={'p'}>
        Please refer to the{' '}
        <ExternalLink href={OPENSHIFT_NETWORKING_DOCS_LINK}>
          OpenShift networking documentation
        </ExternalLink>{' '}
        to configure your cluster's networking, including:{' '}
      </Text>
      <List>
        <ListItem>DHCP or static IP Addresses</ListItem>
        <RenderIf condition={shouldDisplayLoadBalancersBullet}>
          <ListItem>Load balancers</ListItem>
        </RenderIf>
        <ListItem>Network ports</ListItem>
        <ListItem>DNS</ListItem>
      </List>
    </TextContent>
  );
};
