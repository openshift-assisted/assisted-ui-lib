import _ from 'lodash';
import React, { PropsWithChildren, useContext, useEffect } from 'react';
import { getClustersDefaultConfiguration } from '../../api/clusters';
import { ClusterDefaultConfig } from '../../../common';

type State<T> = { status: 'idle' | 'loading' | 'succeeded' | 'failed'; data: T };
type Actions<T> = { type: 'request' } | { type: 'failure' | 'success'; data: T };

const reducer: React.Reducer<State<ClusterDefaultConfig>, Actions<ClusterDefaultConfig>> = (
  state,
  action,
) => {
  let newState: State<ClusterDefaultConfig>;
  switch (action.type) {
    case 'request':
      newState = { status: 'loading', data: {} };
      break;
    case 'success':
      newState = { status: 'succeeded', data: action.data };
      break;
    case 'failure':
      newState = { status: 'failed', data: action.data };
      break;
    default:
      newState = state;
      break;
  }

  return newState;
};

export const ClusterDefaultConfigurationContext = React.createContext<ClusterDefaultConfig>({});

export const ClusterDefaultConfigurationProvider = ({
  children,
  errorUI,
  loadingUI,
}: PropsWithChildren<{ errorUI: React.ReactNode; loadingUI: React.ReactNode }>) => {
  const [state, dispatch] = React.useReducer(reducer, { status: 'idle', data: {} });

  useEffect(() => {
    let mounted = true;
    const fetchAndSetDefaultConfiguration = async () => {
      try {
        if (mounted) dispatch({ type: 'request' });
        const { data } = await getClustersDefaultConfiguration();
        if (mounted) dispatch({ type: 'success', data });
      } catch {
        if (mounted) dispatch({ type: 'failure', data: {} });
      }
    };
    fetchAndSetDefaultConfiguration();

    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const render = (state: State<ClusterDefaultConfig>) => {
    let result: {
      ui: React.ReactNode;
      value: ClusterDefaultConfig;
    } = { ui: loadingUI, value: state.data };

    switch (state.status) {
      case 'idle':
      case 'loading':
        break;
      case 'failed':
        result = { ...result, ui: errorUI };
        break;
      case 'succeeded':
        result = { ...result, ui: children };
        break;
    }

    return result;
  };

  const { ui, value } = render(state);

  return (
    <ClusterDefaultConfigurationContext.Provider value={value}>
      {ui}
    </ClusterDefaultConfigurationContext.Provider>
  );
};

export const useDefaultConfiguration = (keys: Array<keyof ClusterDefaultConfig>) => {
  // TODO(mlibra): There is no more the need to pick just selected values here, we can pass all the retrieved data
  return _.pick(useContext(ClusterDefaultConfigurationContext), keys);
};
