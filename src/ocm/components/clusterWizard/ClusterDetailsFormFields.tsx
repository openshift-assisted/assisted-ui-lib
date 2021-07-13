import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import {
  ManagedDomain,
  InputField,
  SelectField,
  PullSecretField,
  CheckboxField,
} from '../../../common';
import { OpenshiftVersionOptionType } from '../../../common';
import OpenShiftVersionSelect from '../clusterConfiguration/OpenShiftVersionSelect';
import { StaticTextField } from '../ui/StaticTextField';
import SNOControlGroup from '../clusterConfiguration/SNOControlGroup';
import { ClusterDetailsValues } from './types';
import PullSecret from '../clusters/PullSecret';

type ClusterDetailsFormFieldsProps = {
  canEditPullSecret: boolean;
  forceOpenshiftVersion?: string;
  isSNOGroupDisabled?: boolean;
  isNameDisabled?: boolean;
  isBaseDnsDomainDisabled?: boolean;
  defaultPullSecret?: string;

  managedDomains?: ManagedDomain[];
  versions: OpenshiftVersionOptionType[];
  toggleRedHatDnsService: (checked: boolean) => void;
};

const BaseDnsHelperText: React.FC<{ name?: string; baseDnsDomain?: string }> = ({
  name,
  baseDnsDomain,
}) => (
  <>
    All DNS records must be subdomains of this base and include the cluster name. This cannot be
    changed after cluster installation. The full cluster address will be: <br />
    <strong>
      {name || '[Cluster Name]'}.{baseDnsDomain || '[example.com]'}
    </strong>
  </>
);

const ClusterDetailsFormFields: React.FC<ClusterDetailsFormFieldsProps> = ({
  managedDomains = [],
  toggleRedHatDnsService,
  canEditPullSecret,
  isSNOGroupDisabled,
  isNameDisabled,
  isBaseDnsDomainDisabled,
  versions,
  defaultPullSecret,
  forceOpenshiftVersion,
}) => {
  const { values } = useFormikContext<ClusterDetailsValues>();
  const { name, baseDnsDomain, highAvailabilityMode, useRedHatDnsService } = values;
  const nameInputRef = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // TODO(mlibra): Disable fields based on props passed from the caller context. In CIM, the name or domain can not be edited.
  return (
    <Form id="wizard-cluster-details__form">
      <InputField
        ref={nameInputRef}
        label="Cluster name"
        name="name"
        isRequired
        isDisabled={isNameDisabled}
      />
      {!!managedDomains.length && (
        <CheckboxField
          name="useRedHatDnsService"
          label="Use a temporary 60-day domain"
          helperText="A base domain will be provided for temporary, non-production clusters."
          onChange={toggleRedHatDnsService}
        />
      )}
      {useRedHatDnsService ? (
        <SelectField
          label="Base domain"
          name="baseDnsDomain"
          helperText={<BaseDnsHelperText name={name} baseDnsDomain={baseDnsDomain} />}
          options={managedDomains.map((d) => ({
            label: `${d.domain} (${d.provider})`,
            value: d.domain,
          }))}
          isRequired
        />
      ) : (
        <InputField
          label="Base domain"
          name="baseDnsDomain"
          helperText={<BaseDnsHelperText name={name} baseDnsDomain={baseDnsDomain} />}
          placeholder="example.com"
          isDisabled={isBaseDnsDomainDisabled || useRedHatDnsService}
          isRequired
        />
      )}
      <SNOControlGroup
        isDisabled={isSNOGroupDisabled}
        versions={versions}
        highAvailabilityMode={highAvailabilityMode}
      />
      {forceOpenshiftVersion ? (
        <StaticTextField name="openshiftVersion" label="OpenShift version" isRequired>
          OpenShift {forceOpenshiftVersion}
        </StaticTextField>
      ) : (
        <OpenShiftVersionSelect versions={versions} />
      )}
      {canEditPullSecret && <PullSecret defaultPullSecret={defaultPullSecret} />}
    </Form>
  );
};

export default ClusterDetailsFormFields;
