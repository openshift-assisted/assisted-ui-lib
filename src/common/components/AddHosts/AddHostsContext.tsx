import React from 'react';
import { Cluster } from '../../api';

export type AddHostsContextType = {
  cluster?: Cluster;
  ocpConsoleUrl?: string;
};

export const AddHostsContext = React.createContext<AddHostsContextType>({});

export const AddHostsContextProvider: React.FC<AddHostsContextType> = ({
  cluster,
  ocpConsoleUrl,
  children,
}) => (
  <AddHostsContext.Provider value={{ cluster, ocpConsoleUrl }}>{children}</AddHostsContext.Provider>
);
