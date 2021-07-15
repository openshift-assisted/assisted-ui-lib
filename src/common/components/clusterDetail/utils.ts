import { MonitoredOperatorsList } from '../../api';

export const getOlmOperators = (monitoredOperators: MonitoredOperatorsList = []) =>
  monitoredOperators.filter((operator) => operator.operatorType === 'olm');
