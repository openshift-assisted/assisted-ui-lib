import * as React from 'react';
import { useFormikContext } from 'formik';
import { Checkbox, FormGroup } from '@patternfly/react-core';

import { RenderIf } from '../ui/RenderIf';
import { getFieldId, HelperText, TextAreaField, trimSshPublicKey } from '../ui';
import { Cluster } from '../../api';
import { NetworkConfigurationValues } from '../../types/clusters';

export const SshPublicKeyHelperText: React.FC<{
  fieldId?: string;
}> = ({ fieldId = 'sshPublicKey' }) => (
  <HelperText fieldId={fieldId}>
    SSH key used to debug OpenShift nodes. Generate a new key using <em>ssh-keygen</em> command and
    upload or paste the resulting public key here (by default it is content of the{' '}
    <em>~/.ssh/id_rsa.pub</em> file).
  </HelperText>
);

const label = 'Host SSH Public Key for troubleshooting after installation';

interface ClusterSshKeyFieldsProps {
  clusterSshKey: Cluster['sshPublicKey'];
  imageSshKey: Cluster['imageInfo']['sshPublicKey'];
}

const ClusterSshKeyFields: React.FC<ClusterSshKeyFieldsProps> = ({
  clusterSshKey,
  imageSshKey,
}) => {
  const [shareSshKey, setShareSshKey] = React.useState(false);
  const { values, setFieldValue } = useFormikContext<NetworkConfigurationValues>();

  const handleSshKeyBlur = () => {
    if (values.sshPublicKey) {
      setFieldValue('sshPublicKey', trimSshPublicKey(values.sshPublicKey));
    }
  };

  React.useEffect(() => {
    if (imageSshKey && (clusterSshKey === imageSshKey || !clusterSshKey)) {
      setShareSshKey(true);
    }
  }, [imageSshKey, clusterSshKey]);

  React.useEffect(() => {
    if (shareSshKey) {
      setFieldValue('sshPublicKey', imageSshKey);
    }
  }, [shareSshKey, imageSshKey, setFieldValue]);

  const fieldId = getFieldId('shareDiscoverySshKey', 'checkbox');
  return (
    <>
      <FormGroup fieldId={fieldId} label={label}>
        <RenderIf condition={Boolean(imageSshKey)}>
          <Checkbox
            name="shareDiscoverySshKey"
            id={fieldId}
            label="Use the same host discovery SSH key"
            aria-describedby={`${fieldId}-helper`}
            isChecked={shareSshKey}
            onChange={setShareSshKey}
          />
        </RenderIf>
        <RenderIf condition={!shareSshKey}>
          <TextAreaField
            name="sshPublicKey"
            helperText={<SshPublicKeyHelperText />}
            onBlur={handleSshKeyBlur}
          />
        </RenderIf>
      </FormGroup>
    </>
  );
};

export default ClusterSshKeyFields;
