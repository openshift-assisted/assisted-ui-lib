import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './store/rootReducer';

type RenderWithReduxOptions = RenderOptions & { preloadedState?: RootState };

export const renderWithRedux = (
  ui: React.ReactElement,
  { preloadedState, ...options }: RenderWithReduxOptions = {},
) => {
  const WithRedux = ({ children }: PropsWithChildren<unknown>) => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState,
    });

    return <Provider store={store}>{children}</Provider>;
  };

  return render(ui, { wrapper: WithRedux, ...options });
};
