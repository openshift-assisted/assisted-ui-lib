import React from 'react';
import _ from 'lodash';
import {
  AlertGroup,
  Alert,
  AlertVariant,
  Flex,
  FlexItem,
  List,
  ListItem,
} from '@patternfly/react-core';
import { Cluster, stringToJSON, CLUSTER_FIELD_LABELS } from '../../../common';
import { Validation, ValidationsInfo } from '../../../common/types/clusters';
import {
  getWizardStepClusterStatus,
  getWizardStepClusterValidationsInfo,
} from '../clusterWizard/wizardTransition';
import ClusterWizardContext from '../clusterWizard/ClusterWizardContext';

const ClusterAlerts = ({ cluster }: { cluster: Cluster }) => {
  const { currentStepId } = React.useContext(ClusterWizardContext);

  const { failedClusterValidations } = React.useMemo(() => {
    const validationsInfo = stringToJSON<ValidationsInfo>(cluster.validationsInfo) || {};
    const reducedValidationsInfo = getWizardStepClusterValidationsInfo(
      validationsInfo,
      currentStepId,
    );
    const flattenedValues = _.values(reducedValidationsInfo).flat() as Validation[];
    return {
      pendingClusterValidations: flattenedValues.filter(
        (validation) => validation.status === 'pending',
      ),
      failedClusterValidations: flattenedValues.filter(
        (validation) => validation.status === 'failure',
      ),
    };
  }, [cluster.validationsInfo, currentStepId]);

  const isClusterReady = getWizardStepClusterStatus(cluster, currentStepId) === 'ready';

  return (
    <>
      {!cluster.validationsInfo && (
        <Alert variant={AlertVariant.info} title="Cluster validations are initializing" isInline>
          Please hold on till backgroud checks are started.
        </Alert>
      )}
      {!isClusterReady && (
        <Alert variant={AlertVariant.warning} title="Cluster is not ready yet" isInline>
          {!!failedClusterValidations.length && (
            <Flex spaceItems={{ default: 'spaceItemsSm' }} direction={{ default: 'column' }}>
              <FlexItem>The following requirements must be met:</FlexItem>
              <FlexItem>
                <List>
                  {failedClusterValidations.map((validation) => (
                    <ListItem key={validation.id}>{validation.message}</ListItem>
                  ))}
                </List>
              </FlexItem>
            </Flex>
          )}
        </Alert>
      )}
    </>
  );
};

type ClusterValidationSectionProps = {
  cluster?: Cluster;
  errorFields?: string[];
};

const ClusterValidationSection = ({ cluster, errorFields = [] }: ClusterValidationSectionProps) => {
  return (
    <AlertGroup>
      {!!errorFields.length && (
        <Alert
          variant={AlertVariant.danger}
          title="Provided cluster configuration is not valid"
          isInline
        >
          The following fields are not valid:{' '}
          {errorFields.map((field: string) => CLUSTER_FIELD_LABELS[field]).join(', ')}.
        </Alert>
      )}
      {cluster && <ClusterAlerts cluster={cluster} />}
    </AlertGroup>
  );
};

export default ClusterValidationSection;
