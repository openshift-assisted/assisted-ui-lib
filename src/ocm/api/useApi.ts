import React from 'react';
import { AxiosPromise } from 'axios';
import { ResourceUIState } from '../../common';
import { captureException } from '../sentry';

type ApiCall<P, T> = (params: P) => AxiosPromise<T>;

type State<T> = {
  data?: T;
  uiState: ResourceUIState;
};

type Action<T> = {
  type: 'REQUEST' | 'SUCCESS' | 'ERROR';
  payload?: T;
};

type Config = {
  manual?: boolean;
  initialUIState?: ResourceUIState;
};

type Cfg = {
  manual: boolean;
  initialUIState: ResourceUIState;
};

const reducer = <T>(state: State<T>, { type, payload }: Action<T>) => {
  switch (type) {
    case 'REQUEST':
      return { ...state, uiState: ResourceUIState.LOADING };
    case 'SUCCESS':
      if (payload instanceof Array && !payload.length) {
        return { ...state, uiState: ResourceUIState.EMPTY, data: payload };
      } else {
        return { ...state, uiState: ResourceUIState.LOADED, data: payload };
      }
    case 'ERROR':
      return { ...state, uiState: ResourceUIState.ERROR };
    default:
      return state;
  }
};

const createInitialState = <T>(config: Cfg): State<T> => ({
  uiState: config.initialUIState,
  data: undefined,
});

const fetchData = async <P, D>(
  dispatch: React.Dispatch<Action<D>>,
  apiCall: ApiCall<P, D>,
  params?: P,
) => {
  dispatch({ type: 'REQUEST' });
  try {
    const { data } = await apiCall(params!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    dispatch({ type: 'SUCCESS', payload: data });
  } catch (e) {
    captureException(e);
    dispatch({ type: 'ERROR' });
  }
};

const useApi = <Data, P>(
  apiCall: ApiCall<P, Data>,
  params?: P,
  config?: Config,
): [State<Data>, (params?: P) => void] => {
  const cfg = { manual: false, initialUIState: ResourceUIState.LOADING, ...config };

  const [state, dispatch] = React.useReducer(reducer, createInitialState<Data>(cfg));

  const stringifiedParams = typeof params === 'string' ? params : JSON.stringify(params);

  React.useEffect(() => {
    if (!cfg.manual) {
      fetchData(dispatch, apiCall, params);
    }
  }, [apiCall, stringifiedParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = React.useCallback(
    (newParams?: P) => {
      fetchData(dispatch, apiCall, newParams || params);
    },
    [params, stringifiedParams], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [state as State<Data>, refetch];
};

export default useApi;
