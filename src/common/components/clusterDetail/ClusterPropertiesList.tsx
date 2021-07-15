import React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { DASH } from '../constants';
import { getHumanizedDateTime } from '../ui';

type ClusterPropertiesList = {
  name?: string;
  id?: string;
  openshiftVersion?: string;
  baseDnsDomain?: string;
  apiVip?: string;
  ingressVip?: string;
  clusterNetworkCidr?: string;
  clusterNetworkHostPrefix?: number;
  serviceNetworkCidr?: string;
  installedTimestamp?: string;
};

const ClusterPropertiesList = ({
  name,
  openshiftVersion,
  baseDnsDomain,
  apiVip,
  ingressVip,
  id,
  clusterNetworkCidr,
  clusterNetworkHostPrefix,
  serviceNetworkCidr,
  installedTimestamp,
}: ClusterPropertiesList) => (
  <Grid hasGutter>
    <GridItem span={6}>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{name || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>OpenShift version</DescriptionListTerm>
          <DescriptionListDescription>{openshiftVersion || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster ID</DescriptionListTerm>
          <DescriptionListDescription>{id || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Installed at</DescriptionListTerm>
          <DescriptionListDescription>
            {getHumanizedDateTime(installedTimestamp) || DASH}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Base DNS domain</DescriptionListTerm>
          <DescriptionListDescription>{baseDnsDomain || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </GridItem>
    <GridItem span={6}>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>API Virtual IP</DescriptionListTerm>
          <DescriptionListDescription>{apiVip || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Ingress Virtual IP</DescriptionListTerm>
          <DescriptionListDescription>{ingressVip || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster network CIDR</DescriptionListTerm>
          <DescriptionListDescription>{clusterNetworkCidr || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Cluster network host prefix</DescriptionListTerm>
          <DescriptionListDescription>
            {clusterNetworkHostPrefix || DASH}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>ServiceNetworkCidr</DescriptionListTerm>
          <DescriptionListDescription>{serviceNetworkCidr || DASH}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </GridItem>
  </Grid>
);

export default ClusterPropertiesList;
