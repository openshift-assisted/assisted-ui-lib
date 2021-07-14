import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Modal,
  ModalVariant,
  ButtonVariant,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens';

import { postResetCluster } from '../../api/clusters';
import { getErrorMessage, handleApiError } from '../../api/utils';
import { updateCluster } from '../../reducers/clusters/currentClusterSlice';
import { calculateCollectedLogsCount } from '../clusters/utils';
import { useModalDialogsContext } from '../hosts/ModalDialogsContext';
import { ErrorState, LoadingState } from '../../../common';

const ResetClusterModal: React.FC = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<{ title: string; message: string } | null>(null);
  const { resetClusterDialog } = useModalDialogsContext();
  const { data, isOpen, close: onClose } = resetClusterDialog;
  const cluster = data?.cluster;

  if (!cluster) {
    return null;
  }

  const handleClose = () => {
    setIsSubmitting(false);
    setError(null);
    onClose();
  };

  const handleReset = async () => {
    setIsSubmitting(true);
    try {
      setError(null);
      const { data } = await postResetCluster(cluster.id);
      dispatch(updateCluster(data));
      onClose();
    } catch (e) {
      handleApiError(e, () => {
        setError({ title: 'Failed to reset cluster installation', message: getErrorMessage(e) });
      });
    }
    setIsSubmitting(false);
  };

  const collectedLogsPercentage = `${Math.round(
    (calculateCollectedLogsCount(cluster) / ((cluster.hosts?.length || 0) + 1)) * 100,
  )} `;

  const getModalContent = () => {
    if (isSubmitting) {
      return <LoadingState content="Resetting cluster installation..." />;
    }

    if (error) {
      return <ErrorState title={error.title} content={error.message} />;
    }

    return (
      <TextContent>
        <Text component="p">
          This will reset the installation and return to the cluster configuration. Some hosts may
          need to be re-registered by rebooting into the Discovery ISO.
        </Text>

        <Text component="p">
          <strong>Download the installation logs</strong> to troubleshoot or report a bug.
          <br />
          Currently, {collectedLogsPercentage}% of the installation logs were collected and are
          ready for download.
        </Text>

        <Text component="p">
          <ExclamationTriangleIcon className="status-icon" color={warningColor.value} size="sm" />{' '}
          Logs won't be available after the installation is reset.
        </Text>

        <Text component="p">Are you sure you want to reset the cluster?</Text>
      </TextContent>
    );
  };

  const actions = [
    <Button
      key="reset"
      variant={ButtonVariant.danger}
      onClick={handleReset}
      isDisabled={isSubmitting}
    >
      Reset Cluster
    </Button>,
  ];

  actions.push(
    <Button
      key="cancel"
      variant={ButtonVariant.link}
      onClick={handleClose}
      isDisabled={isSubmitting}
    >
      Cancel
    </Button>,
  );

  return (
    <Modal
      title="Reset Cluster Installation"
      isOpen={isOpen}
      variant={ModalVariant.small}
      actions={actions}
      onClose={handleClose}
    >
      {getModalContent()}
    </Modal>
  );
};

export default ResetClusterModal;
