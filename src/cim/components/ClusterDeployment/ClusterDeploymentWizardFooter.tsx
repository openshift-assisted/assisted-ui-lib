import React from 'react';
import Alerts from '../ui/Alerts';
import { useAlerts } from '../AlertsContextProvider';
import { WizardFooter } from '../ui';
import { WizardFooterGenericProps } from '../ui/WizardFooter';
import { Alert, AlertGroup, AlertVariant } from '@patternfly/react-core';
import { CLUSTER_DEPLOYMENT_FIELD_LABELS } from './constants';

type ClusterDeploymentWizardFooterProps = WizardFooterGenericProps & {
  // additionalActions?: React.ReactNode;
  errorFields?: string[];
};

const ValidationSection: React.FC<{ errorFields?: string[] }> = ({ errorFields = [] }) => {
  return errorFields.length > 0 ? (
    <AlertGroup>
      <Alert
        variant={AlertVariant.danger}
        title="Provided cluster configuration is not valid"
        isInline
      >
        The following fields are not valid:{' '}
        {errorFields.map((field: string) => CLUSTER_DEPLOYMENT_FIELD_LABELS[field]).join(', ')}.
      </Alert>
    </AlertGroup>
  ) : null;
};

const ClusterDeploymentWizardFooter = ({
  errorFields,
  ...rest
}: ClusterDeploymentWizardFooterProps) => {
  const { alerts } = useAlerts();
  const alertsSection = alerts.length ? <Alerts /> : undefined;
  const errorsSection = <ValidationSection errorFields={errorFields} />;

  return <WizardFooter alerts={alertsSection} errors={errorsSection} {...rest} />;
};

export default ClusterDeploymentWizardFooter;
