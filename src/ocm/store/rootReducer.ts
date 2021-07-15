import { combineReducers } from 'redux';
import clustersReducer from '../reducers/clusters/clustersSlice';
import currentClusterReducer from '../reducers/clusters/currentClusterSlice';

const rootReducer = combineReducers({
  clusters: clustersReducer,
  currentCluster: currentClusterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
