import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import {
  OpenshiftVersionOptionType,
  Cluster,
  ClusterDetailsFormFields,
  ClusterWizardStepHeader,
} from '../../../common';

const ClusterDeploymentDetails: React.FC<{
  defaultPullSecret: string;
  ocpVersions: OpenshiftVersionOptionType[];
  cluster?: Cluster;
}> = ({ ocpVersions, defaultPullSecret, cluster }) => {
  const toggleRedHatDnsService = () => {
    console.error(
      'toggleRedHatDnsService() should not be called, managedDomains are recently not used.',
    );
  };

  const isEditFlow = !!cluster;
  return (
    <Grid hasGutter>
      <GridItem>
        <ClusterWizardStepHeader>Cluster Details</ClusterWizardStepHeader>
      </GridItem>
      <GridItem span={12} lg={10} xl={9} xl2={7}>
        <ClusterDetailsFormFields
          toggleRedHatDnsService={toggleRedHatDnsService}
          versions={ocpVersions}
          defaultPullSecret={defaultPullSecret}
          canEditPullSecret={!cluster || !cluster.pullSecretSet}
          isSNOGroupDisabled={true}
          isNameDisabled={isEditFlow}
          isBaseDnsDomainDisabled={isEditFlow}
          forceOpenshiftVersion={cluster?.openshiftVersion}
          isOcm={false}
        />
      </GridItem>
    </Grid>
  );
};

export default ClusterDeploymentDetails;
