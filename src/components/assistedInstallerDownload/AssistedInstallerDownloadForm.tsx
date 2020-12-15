import React from 'react';
import * as Yup from 'yup';
import Axios, { CancelTokenSource } from 'axios';
import {
  ActionGroup,
  Alert,
  AlertVariant,
  AlertActionCloseButton,
  Button,
  ButtonVariant,
  Form,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import UploadField from '../ui/formik/UploadField';
import { Formik, FormikHelpers } from 'formik';
import CheckboxField from '../ui/formik/CheckboxField';
import HelperText from '../ui/formik/HelperText';
import { DownloadAssistedInstallerValues } from './types';
import LoadingState from '../ui/uiState/LoadingState';
import { getErrorMessage, handleApiError } from '../../api/utils';
// import { AssistedServiceIsoCreateParams } from '../../api/types';
import { sshPublicKeyValidationSchema, validJSONSchema } from '../ui/formik/validationSchemas';
import { Link } from 'react-router-dom';
import { postAssistedServiceIso } from '../../api/assistedServiceIso';

// TODO(jtomasek): remove this in favor of the type from ../../api/types
type AssistedServiceIsoCreateParams = {
  sshPublicKey: string;
  pullSecret: string;
};

const sshPublicKeyHelperText = (
  <HelperText fieldId="sshPublicKey">
    Provide an SSH public key to be able to access the machine running the installer ISO. To
    generate a new key, use the <em>ssh-keygen</em> command and paste the resulting public key (i.e.
    content of <em>~/.ssh/id_rsa.pub</em> file) here.
  </HelperText>
);

type DownloadAssistedInstallerProps = {
  pullSecret?: string;
  setImageInfo: (data: any) => void;
};

const DownloadAssistedInstallerForm: React.FC<DownloadAssistedInstallerProps> = ({
  pullSecret,
  setImageInfo,
}) => {
  const cancelSourceRef = React.useRef<CancelTokenSource>();

  React.useEffect(() => {
    cancelSourceRef.current = Axios.CancelToken.source();
    return () => cancelSourceRef.current?.cancel('Image generation cancelled by user.');
  }, []);

  const initialValues: DownloadAssistedInstallerValues = {
    sshPublicKeyToggle: false,
    sshPublicKey: '',
    pullSecretToggle: false,
    pullSecret: pullSecret || '',
  };

  const validationSchema = React.useCallback(
    () =>
      Yup.object({
        sshPublicKeyToggle: Yup.boolean(),
        sshPublicKey: Yup.string().when('sshPublicKeyToggle', {
          is: true,
          then: sshPublicKeyValidationSchema.required('SSH Public Key is required.'),
          otherwise: sshPublicKeyValidationSchema,
        }),
        pullSecretToggle: Yup.boolean(),
        pullSecret: Yup.string().when('pullSecretToggle', {
          is: true,
          then: validJSONSchema.required('Pull secret is required.'),
          otherwise: validJSONSchema,
        }),
      }),
    [],
  );

  const handleSubmit = async (
    values: DownloadAssistedInstallerValues,
    formikActions: FormikHelpers<DownloadAssistedInstallerValues>,
  ) => {
    formikActions.setStatus({ error: null });
    try {
      const params: AssistedServiceIsoCreateParams = {
        sshPublicKey: values.sshPublicKey,
        pullSecret: values.pullSecret,
      };
      // const { data } = await postAssistedServiceIso(params, {
      //   cancelToken: cancelSourceRef.current?.token,
      // });
      // setImageInfo(data)

      // TODO(jtomasek):remove this in favor of above when the API works
      const delay = () => new Promise((resolve) => setTimeout(resolve, 5000));
      await delay();
      setImageInfo({
        sshPublicKey: params.sshPublicKey,
      });
    } catch (error) {
      handleApiError<AssistedServiceIsoCreateParams>(error, () => {
        formikActions.setStatus({
          error: {
            title: 'Failed to download the installer image',
            message: getErrorMessage(error),
          },
        });
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ error: null }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleSubmit,
        isSubmitting,
        status,
        setStatus,
        setFieldValue,
        setFieldTouched,
        values,
        initialValues,
        isValid,
        errors,
      }) => {
        const onSshKeyBlur = () => {
          if (values.sshPublicKey) {
            setFieldValue('sshPublicKey', values.sshPublicKey.trim());
          }
        };
        const resetFieldOnDisabled = (fieldName: string) => async (value: boolean) => {
          if (!value) {
            await setFieldValue(fieldName, initialValues[fieldName]);
            setFieldTouched(fieldName, false);
          }
        };
        return (
          <Grid>
            <GridItem lg={8}>
              <Form onSubmit={handleSubmit}>
                <TextContent>
                  <Text component={TextVariants.h2}>Configuration</Text>
                </TextContent>
                <CheckboxField
                  name="sshPublicKeyToggle"
                  label="Include SSH Key for troubleshooting"
                  onChange={resetFieldOnDisabled('sshPublicKey')}
                  helperText="Providing a key will allow you to log into the local installer."
                  isDisabled={isSubmitting}
                />
                {values.sshPublicKeyToggle && (
                  <UploadField
                    label="SSH public key"
                    name="sshPublicKey"
                    helperText={sshPublicKeyHelperText}
                    idPostfix="assisted-installer-download-form"
                    onBlur={onSshKeyBlur}
                    dropzoneProps={{
                      accept: '.pub',
                      maxSize: 2048,
                      onDropRejected: ({ setError }) => () => setError('File not supported.'),
                    }}
                    isDisabled={isSubmitting}
                    isRequired
                  />
                )}
                <CheckboxField
                  name="pullSecretToggle"
                  label="Pull Secret"
                  onChange={resetFieldOnDisabled('pullSecret')}
                  helperText="Edit the Pull Secred used by Assisted Installer"
                  isDisabled={isSubmitting}
                />
                {values.pullSecretToggle && (
                  <UploadField
                    label="Pull Secret"
                    name="pullSecret"
                    idPostfix="assisted-installer-download-form"
                    dropzoneProps={{
                      maxSize: 2048,
                      onDropRejected: ({ setError }) => () => setError('File not supported.'),
                    }}
                    isDisabled={isSubmitting}
                    isRequired
                  />
                )}
                {status.error && (
                  <Alert
                    variant={AlertVariant.danger}
                    title={status.error.title}
                    actionClose={
                      <AlertActionCloseButton onClose={() => setStatus({ error: null })} />
                    }
                    isInline
                  >
                    {status.error.message}
                  </Alert>
                )}
                <ActionGroup>
                  <Button
                    variant={ButtonVariant.primary}
                    type="submit"
                    isDisabled={!isValid || isSubmitting}
                  >
                    {isSubmitting
                      ? 'Generating Assisted Installer ISO...'
                      : 'Generate Assisted Installer ISO'}
                  </Button>
                  <Button
                    variant={ButtonVariant.secondary}
                    component={(props) => (
                      <Link to={`/install/metal`} {...props}>
                        Back
                      </Link>
                    )}
                  />
                </ActionGroup>
              </Form>
            </GridItem>
          </Grid>
        );
      }}
    </Formik>
  );
};

export default DownloadAssistedInstallerForm;
