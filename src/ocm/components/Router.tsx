import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Clusters, ClusterPage, NewClusterPage } from './clusters';
import { store } from '../store';
import { FeatureGateContextProvider, FeatureListType } from '../../common';
import { isSingleClusterMode, routeBasePath } from '../config';
import SingleCluster from './SingleCluster';
import { AssistedUILibVersion } from './ui';

export const AssistedUiRouter: React.FC<{ allEnabledFeatures: FeatureListType }> = ({
  allEnabledFeatures,
}) => (
  <Provider store={store}>
    <Router features={allEnabledFeatures} />
  </Provider>
);

export const Router: React.FC<{ features: FeatureListType }> = ({ features, children }) => (
  <FeatureGateContextProvider features={features}>
    <AssistedUILibVersion />
    {isSingleClusterMode() ? (
      <Switch>
        <Route path={`${routeBasePath}/clusters/:clusterId`} component={ClusterPage} />
        <Route path={`${routeBasePath}/clusters`} component={SingleCluster} />
        {children}
        <Redirect to={`${routeBasePath}/clusters`} />
      </Switch>
    ) : (
      <Switch>
        <Route path={`${routeBasePath}/clusters/~new`} component={NewClusterPage} />
        <Route path={`${routeBasePath}/clusters/:clusterId`} component={ClusterPage} />
        <Route path={`${routeBasePath}/clusters`} component={Clusters} />
        {children}
        <Redirect to={`${routeBasePath}/clusters`} />
      </Switch>
    )}
  </FeatureGateContextProvider>
);
