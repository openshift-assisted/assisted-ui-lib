import { EventListFetchProps } from '../../../common';
import { getEvents, handleApiError } from '../../api';

export const onFetchEvents: EventListFetchProps['onFetchEvents'] = async (
  props,
  onSuccess,
  onError,
) => {
  try {
    const { data } = await getEvents(props.clusterId, props.hostId);
    onSuccess(data);
  } catch (error) {
    handleApiError(error, () => {
      onError('Failed to load events');
    });
  }
};
