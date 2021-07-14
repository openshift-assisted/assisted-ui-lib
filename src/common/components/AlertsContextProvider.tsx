import React from 'react';
import alertsReducer, {
  AlertProps,
  addAlert as addAlertAction,
  removeAlert as removeAlertAction,
  clearAlerts as clearAlertsAction,
  AlertPayload,
} from '../reducers/alertsSlice';

export type AlertsContextType = {
  alerts: AlertProps[];
  addAlert: (alert: AlertPayload) => void;
  removeAlert: (alertKey: string) => void;
  clearAlerts: () => void;
};

export const AlertsContext = React.createContext<AlertsContextType>({
  alerts: [],
  addAlert: () => null,
  removeAlert: () => null,
  clearAlerts: () => null,
});

export const AlertsContextProvider: React.FC = ({ children }) => {
  const [alerts, dispatchAlertsAction] = React.useReducer(alertsReducer, []);
  const addAlert = (alert: AlertPayload) => dispatchAlertsAction(addAlertAction(alert));
  const removeAlert = (alertKey: string) => dispatchAlertsAction(removeAlertAction(alertKey));
  const clearAlerts = () => dispatchAlertsAction(clearAlertsAction());
  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = React.useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within AlertsContextProvider');
  }
  return context;
};
