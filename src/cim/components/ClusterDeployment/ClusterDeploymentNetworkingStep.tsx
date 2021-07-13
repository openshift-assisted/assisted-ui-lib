import React from 'react';
import { Formik } from 'formik';

import { getFormikErrorFields } from '../ui/formik/utils';
import { Cluster, ClusterDefaultConfig } from '../../api';
import { useAlerts } from '../AlertsContextProvider';

import {
  ClusterDeploymentDetailsNetworkingProps,
  ClusterDeploymentNetworkingValues,
} from './types';
import ClusterDeploymentWizardFooter from './ClusterDeploymentWizardFooter';
import ClusterDeploymentWizardNavigation from './ClusterDeploymentWizardNavigation';
import ClusterDeploymentWizardStep from './ClusterDeploymentWizardStep';
import ClusterDeploymentNetworking from './ClusterDeploymentNetworking';
import {
  getNetworkConfigurationValidationSchema,
  getNetworkInitialValues,
} from '../clusterConfiguration/networkConfigurationValidation';
import { HostSubnets, NetworkConfigurationValues } from '../../types/clusters';
import { CLUSTER_DEFAULT_NETWORK_SETTINGS_IPV4 } from '../../config';
import { getHostSubnets } from '../clusterConfiguration/utils';

const getInitialValues = ({
  cluster,
  defaultNetworkSettings,
}: {
  cluster: Cluster;
  defaultNetworkSettings: ClusterDefaultConfig;
}): ClusterDeploymentNetworkingValues => getNetworkInitialValues(cluster, defaultNetworkSettings);

const getValidationSchema = (initialValues: NetworkConfigurationValues, hostSubnets: HostSubnets) =>
  getNetworkConfigurationValidationSchema(initialValues, hostSubnets);

const ClusterDeploymentNetworkingStep: React.FC<ClusterDeploymentDetailsNetworkingProps> = ({
  cluster,
  onSaveNetworking,
  onClose,
  ...rest
}) => {
  const { addAlert } = useAlerts();
  // TODO(mlibra) - see bellow const { setCurrentStepId } = React.useContext(ClusterDeploymentWizardContext);

  // TODO(mlibra): So far a constant. Should be queried from somewhere.
  const defaultNetworkSettings: ClusterDefaultConfig = CLUSTER_DEFAULT_NETWORK_SETTINGS_IPV4;

  const hostSubnets = React.useMemo(() => getHostSubnets(cluster), [cluster]);

  const initialValues = React.useMemo(
    () => getInitialValues({ cluster, defaultNetworkSettings }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const validationSchema = React.useMemo(() => getValidationSchema(initialValues, hostSubnets), [
    initialValues,
    hostSubnets,
  ]);

  const handleSubmit = async (values: ClusterDeploymentNetworkingValues) => {
    try {
      await onSaveNetworking(values);
    } catch (error) {
      addAlert({
        title: 'Failed to save ClusterDeployment',
        message: error,
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isSubmitting, isValid, isValidating, dirty, errors, touched }) => {
        const handleOnNext = () => {
          if (dirty) {
            submitForm();
          }
          // TODO(mlibra): check behaviour if submit fails, no transition in that case
          // setCurrentStepId('something-next'); // TODO(mlibra): set next step ID here
          onClose(); // TODO(mlibra): just temporarily - the flow will continue
        };

        const footer = (
          <ClusterDeploymentWizardFooter
            errorFields={getFormikErrorFields(errors, touched)}
            isSubmitting={isSubmitting}
            isNextDisabled={!isValid || isValidating || isSubmitting}
            onNext={handleOnNext}
            onCancel={onClose}
          />
        );
        const navigation = <ClusterDeploymentWizardNavigation />;

        return (
          <ClusterDeploymentWizardStep navigation={navigation} footer={footer}>
            <ClusterDeploymentNetworking
              cluster={cluster}
              hostSubnets={hostSubnets}
              defaultNetworkSettings={defaultNetworkSettings}
              {...rest}
            />
          </ClusterDeploymentWizardStep>
        );
      }}
    </Formik>
  );
};

export default ClusterDeploymentNetworkingStep;
