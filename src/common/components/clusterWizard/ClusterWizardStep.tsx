import React from 'react';
import { WizardBody } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Wizard/wizard';

import './ClusterWizardStep.css';

type ClusterWizardStepProps = {
  footer?: React.ReactNode;
  navigation?: React.ReactNode;
};

const ClusterWizardStep: React.FC<ClusterWizardStepProps> = ({ navigation, footer, children }) => {
  return (
    <div className={css(styles.wizardOuterWrap, 'cluster-wizard-step')}>
      <div className={css(styles.wizardInnerWrap)}>
        {navigation}
        <WizardBody aria-labelledby="step-id" hasNoBodyPadding={false}>
          {children}
        </WizardBody>
      </div>
      {footer && <div className="pf-c-wizard__footer cluster-wizard-step__footer">{footer}</div>}
    </div>
  );
};

export default ClusterWizardStep;
