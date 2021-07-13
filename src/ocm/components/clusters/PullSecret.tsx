import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { ClusterCreateParams, PullSecretField, PullSecretInfo } from '../../../common';
import { ocmClient } from '../../api';

export type PullSecretProps = {
  defaultPullSecret?: string;
};

const PullSecret: React.FC<PullSecretProps> = ({ defaultPullSecret }) => {
  // Fetched pull secret will never change - see LoadingState in NewCluster
  const [isExpanded, setExpanded] = React.useState(!defaultPullSecret);
  const { setFieldValue } = useFormikContext<ClusterCreateParams>();

  if (ocmClient) {
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
              Edit pull secret <PullSecretInfo isOcm={!!ocmClient} />
            </>
          }
        />
        {isExpanded && <PullSecretField isOcm={!!ocmClient} />}
      </>
    );
  }

  return <PullSecretField isOcm={!!ocmClient} />;
};

export default PullSecret;
