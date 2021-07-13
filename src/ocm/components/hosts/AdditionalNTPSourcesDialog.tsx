import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Form,
  Modal,
  ModalVariant,
  ModalBoxBody,
  ModalBoxFooter,
  Button,
  AlertActionCloseButton,
  AlertVariant,
  AlertActionLink,
} from '@patternfly/react-core';
import {
  Cluster,
  ClusterUpdateParams,
  TextAreaField,
  trimCommaSeparatedList,
  ntpSourceValidationSchema,
} from '../../../common';
import { patchCluster } from '../../api/clusters';
import { updateCluster } from '../../reducers/clusters/currentClusterSlice';
import { getErrorMessage, handleApiError } from '../../api/utils';
import { useModalDialogsContext } from './ModalDialogsContext';

type AdditionalNTPSourcesFormProps = {
  cluster: Cluster;
  onClose: () => void;
};

const AdditionalNTPSourcesForm: React.FC<AdditionalNTPSourcesFormProps> = ({
  cluster,
  onClose,
}) => {
  const dispatch = useDispatch();

  const initialValues: ClusterUpdateParams = {
    additionalNtpSource: cluster.additionalNtpSource || '',
  };

  const validationSchema = Yup.object().shape({
    additionalNtpSource: ntpSourceValidationSchema.required(),
  });

  const handleSubmit = async (
    values: ClusterUpdateParams,
    formikHelpers: FormikHelpers<ClusterUpdateParams>,
  ) => {
    formikHelpers.setStatus({ error: null });
    try {
      const { data } = await patchCluster(cluster.id, values);
      dispatch(updateCluster(data));
      onClose();
    } catch (e) {
      handleApiError<ClusterUpdateParams>(e, () =>
        formikHelpers.setStatus({
          error: {
            title: 'Failed to add NTP sources',
            message: getErrorMessage(e),
          },
        }),
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      initialTouched={{ additionalNtpSource: true }}
      initialStatus={{ error: null }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        submitForm,
        status,
        setStatus,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        isValid,
        dirty,
        values,
      }) => {
        const formatAdditionalNtpSource = () => {
          if (values.additionalNtpSource) {
            setFieldValue(
              'additionalNtpSource',
              trimCommaSeparatedList(values.additionalNtpSource),
            );
            setFieldTouched('additionalNtpSource');
          }
        };

        return (
          <>
            <ModalBoxBody>
              <Form>
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
                <TextAreaField
                  name="additionalNtpSource"
                  label="Additional NTP Sources"
                  helperText="A comma separated list of IP or domain names of the NTP pools or servers. Additional NTP sources are added to all hosts to ensure all hosts clocks are synchronized with a valid NTP server. It may take a few minutes for the new NTP sources to sync."
                  onBlur={formatAdditionalNtpSource}
                  spellCheck={false}
                  isRequired
                />
              </Form>
            </ModalBoxBody>
            <ModalBoxFooter>
              <Button
                key="submit"
                onClick={submitForm}
                isDisabled={isSubmitting || !isValid || !dirty}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </Button>
              <Button key="cancel" variant="link" onClick={onClose}>
                Cancel
              </Button>
            </ModalBoxFooter>
          </>
        );
      }}
    </Formik>
  );
};

type AdditionalNTPSourcesDialogProps = {
  isOpen: boolean;
  cluster: Cluster;
  onClose: () => void;
};

export const AdditionalNTPSourcesDialog: React.FC<AdditionalNTPSourcesDialogProps> = ({
  cluster,
  isOpen,
  onClose,
}) => (
  <Modal
    aria-label="Add NTP sources"
    title="Add NTP sources"
    isOpen={isOpen}
    onClose={onClose}
    variant={ModalVariant.small}
    hasNoBodyWrapper
  >
    <AdditionalNTPSourcesForm cluster={cluster} onClose={onClose} />
  </Modal>
);

export const AdditionalNTPSourcesDialogToggle: React.FC = () => {
  const {
    additionalNTPSourcesDialog: { open },
  } = useModalDialogsContext();

  return <AlertActionLink onClick={() => open()}>Add NTP sources</AlertActionLink>;
};
