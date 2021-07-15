import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, FormikConfig, FormikProps } from 'formik';
import _ from 'lodash';
import { Grid, GridItem, Text, TextContent } from '@patternfly/react-core';

import {
  Cluster,
  ClusterUpdateParams,
  FormikAutoSave,
  getFormikErrorFields,
  useAlerts,
  ClusterWizardStep,
  isSingleNodeCluster,
  NetworkingHostsTable,
  ClusterWizardStepHeader,
  NetworkConfigurationFormFields,
  getNetworkConfigurationValidationSchema,
  getNetworkInitialValues,
  getHostSubnets,
} from '../../../common';
import { HostSubnet, NetworkConfigurationValues } from '../../../common/types/clusters';
import { updateCluster } from '../../reducers/clusters/currentClusterSlice';
import { canNextNetwork } from '../clusterWizard/wizardTransition';
import ClusterWizardContext from '../clusterWizard/ClusterWizardContext';
import ClusterWizardFooter from '../clusterWizard/ClusterWizardFooter';
import ClusterWizardNavigation from '../clusterWizard/ClusterWizardNavigation';
import { ClusterHostsTable } from '../hosts';
import { getErrorMessage, handleApiError, patchCluster } from '../../api';
import NetworkingStatus from '../hosts/NetworkingStatus';
import ClusterWizardHeaderExtraActions from './ClusterWizardHeaderExtraActions';
import { useDefaultConfiguration } from './ClusterDefaultConfigurationContext';

const NetworkConfigurationForm: React.FC<{
  cluster: Cluster;
}> = ({ cluster }) => {
  const defaultNetworkSettings = useDefaultConfiguration([
    'clusterNetworkCidr',
    'serviceNetworkCidr',
    'clusterNetworkHostPrefix',
  ]);
  const { addAlert, clearAlerts } = useAlerts();
  const { setCurrentStepId } = React.useContext(ClusterWizardContext);
  const dispatch = useDispatch();
  const hostSubnets = React.useMemo(() => getHostSubnets(cluster), [cluster]);
  const initialValues = React.useMemo(
    () => getNetworkInitialValues(cluster, defaultNetworkSettings),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // just once, Formik does not reinitialize
  );

  const memoizedValidationSchema = React.useMemo(
    () => getNetworkConfigurationValidationSchema(initialValues, hostSubnets),
    [hostSubnets, initialValues],
  );

  const handleSubmit: FormikConfig<NetworkConfigurationValues>['onSubmit'] = async (
    values,
    actions,
  ) => {
    clearAlerts();

    // update the cluster configuration
    try {
      const isMultiNodeCluster = !isSingleNodeCluster(cluster);
      const isUserManagedNetworking = values.networkingType === 'userManaged';
      const params = _.omit(values, ['hostSubnet', 'useRedHatDnsService', 'networkingType']);
      params.userManagedNetworking = isUserManagedNetworking;
      params.machineNetworkCidr = hostSubnets.find(
        (hn: HostSubnet) => hn.humanized === values.hostSubnet,
      )?.subnet;

      if (isUserManagedNetworking) {
        if (isMultiNodeCluster) {
          delete params.machineNetworkCidr;
        }

        delete params.apiVip;
        delete params.ingressVip;
      } else {
        // cluster-managed can't be chosen in SNO, so this must be a multi-node cluster
        if (values.vipDhcpAllocation) {
          delete params.apiVip;
          delete params.ingressVip;
        } else {
          delete params.machineNetworkCidr;
        }
      }

      const { data } = await patchCluster(cluster.id, params);
      dispatch(updateCluster(data));
      actions.resetForm({ values: getNetworkInitialValues(data, defaultNetworkSettings) });
    } catch (e) {
      handleApiError<ClusterUpdateParams>(e, () =>
        addAlert({ title: 'Failed to update the cluster', message: getErrorMessage(e) }),
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={memoizedValidationSchema}
      onSubmit={handleSubmit}
      initialTouched={_.mapValues(initialValues, () => true)}
      validateOnMount
    >
      {({ isSubmitting, dirty, errors, touched }: FormikProps<NetworkConfigurationValues>) => {
        const errorFields = getFormikErrorFields(errors, touched);
        const form = (
          <>
            <Grid hasGutter>
              <GridItem>
                <ClusterWizardStepHeader
                  extraItems={<ClusterWizardHeaderExtraActions cluster={cluster} />}
                >
                  Networking
                </ClusterWizardStepHeader>
              </GridItem>
              <GridItem span={12} lg={10} xl={9} xl2={7}>
                <NetworkConfigurationFormFields
                  cluster={cluster}
                  hostSubnets={hostSubnets}
                  defaultNetworkSettings={defaultNetworkSettings}
                />
              </GridItem>
              <GridItem>
                <TextContent>
                  <Text component="h2">Host inventory</Text>
                </TextContent>
                <NetworkingHostsTable
                  cluster={cluster}
                  TableComponent={ClusterHostsTable}
                  HostNetworkingStatusComponent={NetworkingStatus}
                />
              </GridItem>
            </Grid>
            <FormikAutoSave />
          </>
        );

        const footer = (
          <ClusterWizardFooter
            cluster={cluster}
            errorFields={errorFields}
            isSubmitting={isSubmitting}
            isNextDisabled={dirty || !canNextNetwork({ cluster })}
            onNext={() => setCurrentStepId('review')}
            onBack={() => setCurrentStepId('host-discovery')}
          />
        );
        return (
          <ClusterWizardStep
            navigation={<ClusterWizardNavigation cluster={cluster} />}
            footer={footer}
          >
            {form}
          </ClusterWizardStep>
        );
      }}
    </Formik>
  );
};

export default NetworkConfigurationForm;
