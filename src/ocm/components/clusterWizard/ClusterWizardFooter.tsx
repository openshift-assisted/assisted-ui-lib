import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Cluster,
  WizardFooter,
  WizardFooterGenericProps,
  Alerts,
  useAlerts,
} from '../../../common';
import ClusterValidationSection from '../clusterConfiguration/ClusterValidationSection';
import { routeBasePath } from '../../config/routeBaseBath';

type ClusterWizardFooterProps = WizardFooterGenericProps & {
  cluster?: Cluster;
  additionalActions?: React.ReactNode;
  errorFields?: string[];
};

const ClusterWizardFooter = ({
  cluster,
  additionalActions,
  errorFields,

  onCancel,
  ...rest
}: ClusterWizardFooterProps) => {
  const { alerts } = useAlerts();
  const history = useHistory();

  const handleCancel = React.useCallback(() => history.push(`${routeBasePath}/clusters/`), [
    history,
  ]);

  const alertsSection = alerts.length ? <Alerts /> : undefined;
  const errorsSection = <ClusterValidationSection cluster={cluster} errorFields={errorFields} />;

  return (
    <WizardFooter
      alerts={alertsSection}
      errors={errorsSection}
      onCancel={onCancel || handleCancel}
      leftExtraActions={additionalActions}
      {...rest}
    />
  );
};

export default ClusterWizardFooter;
