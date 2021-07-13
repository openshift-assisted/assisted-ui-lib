import React from 'react';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Form,
  Modal,
  ModalBoxBody,
  ModalBoxFooter,
  ModalVariant,
  TextInputTypes,
} from '@patternfly/react-core';
import { Formik, FormikConfig, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  hostnameValidationSchema,
  ipOrDomainValidationSchema,
  macAddressValidationSchema,
} from '../ui/formik/validationSchemas';
import { InputField } from '../ui';
import { AddBmcValues } from './types';

type AddBmcFormProps = {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreate: (values: AddBmcValues) => Promise<any>;
};

const validationSchema = Yup.object({
  hostname: hostnameValidationSchema.required(),
  bmcAddress: ipOrDomainValidationSchema.required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  bootMACAddress: macAddressValidationSchema.required(),
});

const emptyValues: AddBmcValues = {
  hostname: '',
  bmcAddress: '',
  username: '',
  password: '',
  bootMACAddress: '',
  disableCertificateVerification: true, // TODO(mlibra)
  online: false, // TODO(mlibra)
};

const AddBmcForm: React.FC<AddBmcFormProps> = ({ onClose, onCreate }) => {
  const [error, setError] = React.useState();

  const handleSubmit: FormikConfig<AddBmcValues>['onSubmit'] = async (values) => {
    try {
      setError(undefined);
      await onCreate(values);
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Formik
      initialValues={emptyValues}
      isInitialValid={false}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid, submitForm }: FormikProps<AddBmcValues>) => {
        return (
          <>
            <ModalBoxBody>
              <Form id="add-bmc-form">
                <InputField
                  label="Host name"
                  name="hostname"
                  placeholder="Enter the name for the Host"
                  isRequired
                />
                <InputField
                  label="Baseboard Management Controller Address"
                  name="bmcAddress"
                  placeholder="Enter the address"
                  isRequired
                />
                <InputField
                  label="Username"
                  name="username"
                  placeholder="Enter a username for the BMC"
                  isRequired
                />
                <InputField
                  type={TextInputTypes.password}
                  label="Password"
                  name="password"
                  placeholder="Enter a password for the BMC"
                  isRequired
                />
                <InputField
                  label="Boot MAC Address"
                  name="bootMACAddress"
                  placeholder="Enter a MAC address of network device used for provisioning"
                  isRequired
                />
              </Form>
              {error && (
                <Alert
                  title="Failed to add host"
                  variant={AlertVariant.danger}
                  isInline
                  actionClose={() => setError(undefined)}
                >
                  {error}
                </Alert>
              )}
            </ModalBoxBody>
            <ModalBoxFooter>
              <Button onClick={submitForm} isDisabled={isSubmitting || !isValid}>
                Create
              </Button>
              <Button onClick={onClose} variant={ButtonVariant.secondary}>
                Cancel
              </Button>
            </ModalBoxFooter>
          </>
        );
      }}
    </Formik>
  );
};

const AddBmcModal: React.FC<AddBmcFormProps & { isOpen: boolean }> = ({ isOpen, ...props }) => (
  <Modal
    aria-label="Add host as baseboard management controller"
    title="Add Host"
    isOpen={isOpen}
    onClose={props.onClose}
    variant={ModalVariant.small}
    hasNoBodyWrapper
    id="add-bmc-modal"
  >
    <AddBmcForm {...props} />
  </Modal>
);

export default AddBmcModal;
