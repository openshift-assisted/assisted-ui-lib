import * as React from 'react';
import { useField } from 'formik';

import { UploadField, trimSshPublicKey } from '../../../common';
import { SshPublicKeyHelperText } from './ClusterSshKeyFields';

const UploadSSH: React.FC = () => {
  const [{ name, value }, , { setValue }] = useField('sshPublicKey');

  return (
    <UploadField
      label="SSH public key"
      name={name}
      helperText={<SshPublicKeyHelperText />}
      idPostfix="discovery"
      onBlur={() => value && setValue(trimSshPublicKey(value))}
      dropzoneProps={{
        accept: '.pub',
        maxSize: 2048,
        onDropRejected: ({ setError }) => () => setError('File not supported.'),
      }}
    />
  );
};

export default UploadSSH;
