import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { ClusterCreateParams } from '../../api';
import { PullSecretField, PullSecretInfo } from '../ui';

export type PullSecretProps = {
  defaultPullSecret?: string;
  isOcm: boolean;
};

const PullSecret: React.FC<PullSecretProps> = ({ defaultPullSecret, isOcm }) => {
  // Fetched pull secret will never change - see LoadingState in NewCluster
  const [isExpanded, setExpanded] = React.useState(!defaultPullSecret);
  const { setFieldValue } = useFormikContext<ClusterCreateParams>();

  if (isOcm) {
    const onCheckboxChange = () => {
      if (isExpanded) {
        // about to collapse, reset to original value
        setFieldValue('pullSecret', defaultPullSecret);
      }
      setExpanded(!isExpanded);
    };

    return (
      <>
        <Checkbox
          id="checkbox-pull-secret"
          className="pf-u-display-inline-flex"
          aria-label="edit pull secret"
          isChecked={isExpanded}
          onChange={onCheckboxChange}
          label={
            <>
              Edit pull secret <PullSecretInfo isOcm={isOcm} />
            </>
          }
        />
        {isExpanded && <PullSecretField isOcm={isOcm} />}
      </>
    );
  }

  return <PullSecretField isOcm={isOcm} />;
};

export default PullSecret;
