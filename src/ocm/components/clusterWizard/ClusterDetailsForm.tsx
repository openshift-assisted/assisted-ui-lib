import React from 'react';
import _ from 'lodash';
import { Formik, FormikHelpers } from 'formik';
import {
  Cluster,
  ClusterCreateParams,
  ClusterUpdateParams,
  ManagedDomain,
  ClusterWizardStep,
  ClusterWizardStepHeader,
  ClusterDetailsValues,
  getClusterDetailsInitialValues,
  getClusterDetailsValidationSchema,
  ClusterDetailsFormFields,
} from '../../../common';
import { Grid, GridItem } from '@patternfly/react-core';
import { canNextClusterDetails } from './wizardTransition';
import { OpenshiftVersionOptionType, getFormikErrorFields } from '../../../common';
import ClusterWizardFooter from './ClusterWizardFooter';
import ClusterWizardHeaderExtraActions from '../clusterConfiguration/ClusterWizardHeaderExtraActions';
import { ocmClient } from '../../api';

type ClusterDetailsFormProps = {
  cluster?: Cluster;
  pullSecret: string;
  managedDomains: ManagedDomain[];
  ocpVersions: OpenshiftVersionOptionType[];
  usedClusterNames: string[];

  navigation: React.ReactNode;

  moveNext: () => void;
  handleClusterCreate: (params: ClusterCreateParams) => Promise<void>;
  handleClusterUpdate: (clusterId: Cluster['id'], params: ClusterUpdateParams) => Promise<void>;
};

const ClusterDetailsForm: React.FC<ClusterDetailsFormProps> = (props) => {
  const {
    cluster,
    pullSecret,
    managedDomains,
    ocpVersions,
    usedClusterNames = [],
    moveNext,
    handleClusterUpdate,
    handleClusterCreate,
    navigation,
  } = props;

  const handleSubmit = async (values: ClusterDetailsValues) => {
    const params: ClusterCreateParams = _.omit(values, ['useRedHatDnsService', 'SNODisclaimer']);
    if (cluster) {
      await handleClusterUpdate(cluster.id, params);
    } else {
      await handleClusterCreate(params);
    }
  };

  const handleOnNext = (
    dirty: boolean,
    submitForm: FormikHelpers<unknown>['submitForm'],
    cluster?: Cluster,
  ): (() => Promise<void> | void) => {
    let fn: () => Promise<void> | void = submitForm;
    if (!dirty && !_.isUndefined(cluster) && canNextClusterDetails({ cluster })) {
      fn = moveNext;
    }

    return fn;
  };

  const initialValues = getClusterDetailsInitialValues(props);
  const validationSchema = getClusterDetailsValidationSchema(usedClusterNames, cluster);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isSubmitting, isValid, dirty, setFieldValue, errors, touched }) => {
        const errorFields = getFormikErrorFields(errors, touched);

        const toggleRedHatDnsService = (checked: boolean) =>
          setFieldValue('baseDnsDomain', checked ? managedDomains.map((d) => d.domain)[0] : '');

        const form = (
          <>
            <Grid hasGutter>
              <GridItem>
                <ClusterWizardStepHeader
                  extraItems={<ClusterWizardHeaderExtraActions cluster={cluster} />}
                >
                  Cluster details
                </ClusterWizardStepHeader>
              </GridItem>
              <GridItem span={12} lg={10} xl={9} xl2={7}>
                <ClusterDetailsFormFields
                  toggleRedHatDnsService={toggleRedHatDnsService}
                  versions={ocpVersions}
                  canEditPullSecret={!cluster?.pullSecretSet}
                  forceOpenshiftVersion={cluster?.openshiftVersion}
                  isSNOGroupDisabled={!!cluster}
                  defaultPullSecret={pullSecret}
                  isOcm={!!ocmClient}
                />
              </GridItem>
            </Grid>
          </>
        );
        const footer = (
          <ClusterWizardFooter
            cluster={cluster}
            errorFields={errorFields}
            isSubmitting={isSubmitting}
            isNextDisabled={
              !(
                !isSubmitting &&
                isValid &&
                (dirty || (cluster && canNextClusterDetails({ cluster })))
              )
            }
            onNext={handleOnNext(dirty, submitForm, cluster)}
          />
        );
        return (
          <ClusterWizardStep navigation={navigation} footer={footer}>
            {form}
          </ClusterWizardStep>
        );
      }}
    </Formik>
  );
};

export default ClusterDetailsForm;
