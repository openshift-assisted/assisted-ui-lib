import { RootState } from '../store/rootReducer';

export const selectCurrentClusterState = (state: RootState) => state.currentCluster;
export const selectCurrentCluster = (state: RootState) => state.currentCluster.data;
export const selectCurrentClusterUIState = (state: RootState) => state.currentCluster.uiState;
