import _ from 'lodash';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCluster } from '../../api/clusters';
import { Cluster, Host } from '../../../common';
import { handleApiError } from '../../api/utils';
import { ResourceUIState } from '../../../common';

export type RetrievalErrorType = {
  code: string;
};

type CurrentClusterStateSlice = {
  data?: Cluster;
  uiState: ResourceUIState;
  isReloadScheduled: number;
  errorDetail?: RetrievalErrorType;
};

export const fetchClusterAsync = createAsyncThunk<
  Cluster | void,
  string,
  {
    rejectValue: RetrievalErrorType;
  }
>('currentCluster/fetchClusterAsync', async (clusterId, { rejectWithValue }) => {
  try {
    const { data } = await getCluster(clusterId);
    return data;
  } catch (e) {
    return handleApiError(e, () => rejectWithValue(e.response.data));
  }
});

const initialState: CurrentClusterStateSlice = {
  data: undefined,
  uiState: ResourceUIState.LOADING,
  errorDetail: undefined,
  isReloadScheduled: 0,
};

export const currentClusterSlice = createSlice({
  initialState,
  name: 'currentCluster',
  reducers: {
    updateCluster: (state, action: PayloadAction<Cluster>) => ({ ...state, data: action.payload }),
    updateHost: (state, action: PayloadAction<Host>) => {
      const hostIndex = _.findIndex(state.data?.hosts, (host) => host.id === action.payload.id);
      if (hostIndex >= 0) {
        _.set(state, `data.hosts[${hostIndex}]`, action.payload);
      }
      return state;
    },
    cleanCluster: () => initialState,
    forceReload: (state) => ({
      ...state,
      isReloadScheduled: state.isReloadScheduled + 1,
    }),
    cancelForceReload: (state) => ({
      ...state,
      isReloadScheduled: 0,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClusterAsync.pending, (state) => ({
        ...state,
        uiState:
          state.uiState === ResourceUIState.LOADED
            ? ResourceUIState.RELOADING
            : ResourceUIState.LOADING,
      }))
      .addCase(fetchClusterAsync.fulfilled, (state, action) => ({
        ...state,
        data: action.payload as Cluster,
        uiState: ResourceUIState.LOADED,
      }))
      .addCase(fetchClusterAsync.rejected, (state, action) => ({
        ...state,
        uiState: ResourceUIState.ERROR,
        errorDetail: action.payload as RetrievalErrorType,
      }));
  },
});

export const {
  updateCluster,
  updateHost,
  cleanCluster,
  forceReload,
  cancelForceReload,
} = currentClusterSlice.actions;
export default currentClusterSlice.reducer;
