import React from 'react';
import { Grid, GridItem, Text, TextContent } from '@patternfly/react-core';
import ClusterWizardStepHeader from '../clusterWizard/ClusterWizardStepHeader';
import { Cluster, ClusterDefaultConfig } from '../../api';
import NetworkConfigurationFormFields from '../clusterConfiguration/NetworkConfigurationFormFields';
import { HostSubnets } from '../../types/clusters';
import NetworkingHostsTable from '../hosts/NetworkingHostsTable';
import ClusterDeploymentHostsTable from './ClusterDeploymentHostsTable';
import { ClusterDeploymentHostsTablePropsActions } from './types';

const ClusterDeploymentNetworking: React.FC<
  {
    cluster: Cluster;
    hostSubnets: HostSubnets;
    defaultNetworkSettings: ClusterDefaultConfig;
  } & ClusterDeploymentHostsTablePropsActions
> = ({ cluster, hostSubnets, defaultNetworkSettings, ...rest }) => {
  const isVipDhcpAllocationDisabled = true; // So far not supported

  return (
    <Grid hasGutter>
      <GridItem>
        <ClusterWizardStepHeader cluster={undefined /* Intentional to hide Events */}>
          Networking
        </ClusterWizardStepHeader>
      </GridItem>
      <GridItem span={12} lg={10} xl={9} xl2={7}>
        <NetworkConfigurationFormFields
          cluster={cluster}
          hostSubnets={hostSubnets}
          isVipDhcpAllocationDisabled={isVipDhcpAllocationDisabled}
          defaultNetworkSettings={defaultNetworkSettings}
        />
      </GridItem>

      <GridItem>
        <TextContent>
          <Text component="h2">Host inventory</Text>
        </TextContent>
        <NetworkingHostsTable
          cluster={cluster}
          TableComponent={ClusterDeploymentHostsTable}
          {...rest}
        />
      </GridItem>
    </Grid>
  );
};

export default ClusterDeploymentNetworking;
