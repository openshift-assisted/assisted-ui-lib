import React from 'react';
import { Formik } from 'formik';

import { getFormikErrorFields } from '../ui/formik/utils';
import {
  getClusterDetailsInitialValues,
  getClusterDetailsValidationSchema,
} from '../clusterWizard/utils';
import { Cluster } from '../../api';
import { OpenshiftVersionOptionType } from '../../types';
import { useAlerts } from '../AlertsContextProvider';

import ClusterDeploymentDetails from './ClusterDeploymentDetails';
import { ClusterDeploymentDetailsStepProps, ClusterDeploymentDetailsValues } from './types';
import ClusterDeploymentWizardFooter from './ClusterDeploymentWizardFooter';
import ClusterDeploymentWizardContext from './ClusterDeploymentWizardContext';
import ClusterDeploymentWizardNavigation from './ClusterDeploymentWizardNavigation';
import ClusterDeploymentWizardStep from './ClusterDeploymentWizardStep';

const getInitialValues = ({
  cluster,
  ocpVersions,
  defaultPullSecret: pullSecret,
}: {
  cluster?: Cluster;
  ocpVersions: OpenshiftVersionOptionType[];
  defaultPullSecret?: string;
}): ClusterDeploymentDetailsValues =>
  getClusterDetailsInitialValues({
    managedDomains: [], // not supported
    cluster,
    pullSecret,
    ocpVersions,
  });

const getValidationSchema = (usedClusterNames: string[], cluster?: Cluster) =>
  getClusterDetailsValidationSchema(usedClusterNames, cluster);

const ClusterDeploymentDetailsStep: React.FC<ClusterDeploymentDetailsStepProps> = ({
  defaultPullSecret,
  ocpVersions,
  cluster,
  usedClusterNames,
  onSaveDetails,
  onClose,
}) => {
  const { addAlert } = useAlerts();
  const { setCurrentStepId } = React.useContext(ClusterDeploymentWizardContext);

  const initialValues = React.useMemo(
    () => getInitialValues({ cluster, ocpVersions, defaultPullSecret }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const validationSchema = React.useMemo(() => getValidationSchema(usedClusterNames, cluster), [
    usedClusterNames,
    cluster,
  ]);

  const handleSubmit = async (values: ClusterDeploymentDetailsValues) => {
    try {
      await onSaveDetails(values);
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
          setCurrentStepId('networking'); // TODO(mlibra): fix the next step to Hosts once ready
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
            <ClusterDeploymentDetails
              ocpVersions={ocpVersions}
              defaultPullSecret={defaultPullSecret}
              cluster={cluster}
            />
          </ClusterDeploymentWizardStep>
        );
      }}
    </Formik>
  );
};

export default ClusterDeploymentDetailsStep;
