import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { CLUSTER_MANAGER_SITE_LINK, PULL_SECRET_INFO_LINK } from '../../../config';
import PopoverIcon from '../PopoverIcon';
import TextAreaField from './TextAreaField';

export type PullSecretFieldProps = {
  pullSecret?: string;
  LabelIcon: React.ComponentType;
};

export const PullSecretInfo: React.FC<{ isOcm: boolean }> = ({ isOcm }) => (
  <PopoverIcon
    bodyContent={
      <>
        Pull secrets are used to download OpenShift Container Platform components and connect
        clusters to a Red Hat account.&nbsp;
        {isOcm ? (
          <PullSecretInfoLink />
        ) : (
          <>
            Pull secrets can be found in&nbsp;
            <ClusterManagerSiteLink />
          </>
        )}
      </>
    }
  />
);

const ClusterManagerSiteLink = () => (
  <a href={CLUSTER_MANAGER_SITE_LINK} target="_blank" rel="noopener noreferrer">
    OpenShift Cluster Manager <ExternalLinkAltIcon />
  </a>
);

const PullSecretInfoLink = () => (
  <a href={PULL_SECRET_INFO_LINK} target="_blank" rel="noopener noreferrer">
    Learn more about pull secrets <ExternalLinkAltIcon />.
  </a>
);

const getPullSecretHelperText = (isOcm: boolean) =>
  isOcm ? (
    <>
      Your Red Hat account's pull secret is used by default.&nbsp;
      <PullSecretInfoLink />
    </>
  ) : (
    <>
      A Red Hat account's pull secret can be found in &nbsp;
      <ClusterManagerSiteLink />
    </>
  );

const PullSecretField: React.FC<{ isOcm: boolean }> = ({ isOcm }) => (
  <TextAreaField
    name="pullSecret"
    label="Pull Secret"
    labelIcon={isOcm ? undefined : <PullSecretInfo isOcm={isOcm} />}
    getErrorText={(error) => (
      <>
        {error} {getPullSecretHelperText(isOcm)}
      </>
    )}
    helperText={getPullSecretHelperText(isOcm)}
    rows={10}
    isRequired
  />
);

export default PullSecretField;
