import * as React from 'react';
import * as Yup from 'yup';
import {
  Alert,
  AlertActionCloseButton,
  AlertVariant,
  Button,
  Form,
  Grid,
  GridItem,
  Spinner,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { Formik, FormikProps } from 'formik';

import {
  httpProxyValidationSchema,
  InputField,
  noProxyValidationSchema,
  PullSecretField,
  sshPublicKeyValidationSchema,
  LabelField,
  UploadSSH,
  ProxyFields,
} from '../../../common';

export type EnvironmentStepFormValues = {
  name: string;
  location: string;
  baseDomain: string;
  pullSecret: string;
  sshPublicKey: string;
  httpProxy: string;
  httpsProxy: string;
  noProxy: string;
  enableProxy: boolean;
  labels: string[];
};

const validationSchema = (usedNames: string[]) =>
  Yup.lazy<EnvironmentStepFormValues>((values) =>
    Yup.object<EnvironmentStepFormValues>().shape({
      name: Yup.string()
        .required()
        .test(
          'duplicate-name',
          'Infrastructure environment with the same name already exists!',
          (value: string) => !usedNames.find((n) => n === value),
        ),
      location: Yup.string().required(),
      baseDomain: Yup.string().required(),
      pullSecret: Yup.string().required(),
      sshPublicKey: sshPublicKeyValidationSchema.required(
        'An SSH key is required to debug hosts as they register.',
      ),
      httpProxy: httpProxyValidationSchema(values, 'httpsProxy'),
      httpsProxy: httpProxyValidationSchema(values, 'httpProxy'), // share the schema, httpS is currently not supported
      noProxy: noProxyValidationSchema,
      labels: Yup.array()
        .of(Yup.string())
        .required()
        .test(
          'label-equals-validation',
          'Label selector needs to be in a `key=value` form',
          (values: string[]) =>
            values.every((value) => {
              const parts = value.split('=');
              return parts.length === 2;
            }),
        ),
    }),
  );

const initialValues: EnvironmentStepFormValues = {
  name: '',
  location: '',
  baseDomain: '',
  pullSecret: '',
  sshPublicKey: '',
  httpProxy: '',
  httpsProxy: '',
  noProxy: '',
  enableProxy: false,
  labels: [],
};

type InfraEnvFormProps = {
  usedNames: string[];
  // eslint-disable-next-line
  onSubmit: (values: EnvironmentStepFormValues) => Promise<any>;
  onFinish: (values: EnvironmentStepFormValues) => void;
  onClose: VoidFunction;
};

const InfraEnvForm: React.FC<InfraEnvFormProps> = ({ usedNames, onSubmit, onClose, onFinish }) => {
  const [error, setError] = React.useState<string | undefined>();
  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ error: null }}
      validationSchema={validationSchema(usedNames)}
      onSubmit={async (values: EnvironmentStepFormValues) => {
        try {
          await onSubmit(values);
          onFinish(values);
        } catch (e) {
          setError(e?.message ?? 'An error occured');
        }
      }}
    >
      {({ isValid, isSubmitting, submitForm }: FormikProps<EnvironmentStepFormValues>) => (
        <Stack hasGutter>
          <StackItem>
            <Grid hasGutter span={8}>
              <GridItem>
                <Title headingLevel="h1" size={TitleSizes.xl}>
                  Configure environment
                </Title>
              </GridItem>
              <GridItem>
                Infrastructure Environments are used by Clusters. Create an Infrastructure
                Environment in order to add resources to your cluster.
              </GridItem>
              <GridItem>
                <Form>
                  <InputField label="Name" name="name" isRequired />
                  <InputField label="Base domain" name="baseDomain" isRequired />
                  <InputField label="Location" name="location" isRequired />
                  <LabelField label="Labels" name="labels" isRequired />
                  <PullSecretField isOcm={false} />
                  <UploadSSH />
                  <ProxyFields />
                </Form>
              </GridItem>
            </Grid>
          </StackItem>
          {error && (
            <StackItem>
              <Alert
                variant={AlertVariant.danger}
                actionClose={<AlertActionCloseButton onClose={() => setError(undefined)} />}
                title="Error creating InfraEnv"
              >
                {error}
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <>
              <Button
                variant="primary"
                type="submit"
                isDisabled={!isValid || isSubmitting}
                onClick={submitForm}
              >
                Create {isSubmitting && <Spinner isSVG size="md" />}
              </Button>
              <Button variant="link" onClick={onClose} isDisabled={isSubmitting}>
                Cancel
              </Button>
            </>
          </StackItem>
        </Stack>
      )}
    </Formik>
  );
};

export default InfraEnvForm;
