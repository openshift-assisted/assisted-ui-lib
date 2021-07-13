import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Cluster, POLLING_INTERVAL } from '../../../common';
import {
  fetchClusterAsync,
  cleanCluster,
  forceReload,
  cancelForceReload,
  RetrievalErrorType,
} from '../../reducers/clusters/currentClusterSlice';
import { selectCurrentClusterState } from '../../selectors';
import { ResourceUIState } from '../../../common';

export const useFetchCluster = (clusterId: string) => {
  const dispatch = useDispatch();
  return React.useCallback(() => dispatch(fetchClusterAsync(clusterId)), [clusterId, dispatch]);
};

export const useClusterPolling = (
  clusterId: string,
): {
  cluster: Cluster | undefined;
  uiState: ResourceUIState;
  errorDetail: RetrievalErrorType | undefined;
} => {
  const { isReloadScheduled, uiState, data, errorDetail } = useSelector(selectCurrentClusterState);
  const dispatch = useDispatch();
  const fetchCluster = useFetchCluster(clusterId);

  React.useEffect(() => {
    if (isReloadScheduled) {
      const bannedUIStates = [
        ResourceUIState.LOADING,
        ResourceUIState.RELOADING,
        ResourceUIState.ERROR,
      ];
      if (!bannedUIStates.includes(uiState)) {
        fetchCluster();
      }
    }
    dispatch(cancelForceReload());
  }, [fetchCluster, dispatch, isReloadScheduled, uiState]);

  React.useEffect(() => {
    fetchCluster();
    const timer = window.setInterval(() => dispatch(forceReload()), POLLING_INTERVAL);
    return () => {
      clearInterval(timer);
      dispatch(cancelForceReload());
      dispatch(cleanCluster());
    };
  }, [dispatch, fetchCluster]);

  return { cluster: data, uiState, errorDetail };
};
