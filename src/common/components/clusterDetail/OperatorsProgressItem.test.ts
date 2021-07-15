import { MonitoredOperator, OperatorStatus } from '../../../common';
import { getAggregatedStatus, getLabel } from './OperatorsProgressItem';

const generateOperatorMock = (name: string, status?: OperatorStatus): MonitoredOperator => ({
  operatorType: 'olm',
  name,
  status,
});

describe('OperatorsProgressItem', () => {
  describe('getAggregatedStatus', () => {
    it('status should be `failed` if there are some failed operators', () => {
      const operators = [
        generateOperatorMock('aaa', 'failed'),
        generateOperatorMock('bbb', 'progressing'),
        generateOperatorMock('ccc', 'available'),
        generateOperatorMock('ddd', 'failed'),
        generateOperatorMock('eee'),
      ];
      expect(getAggregatedStatus(operators)).toEqual('failed');
    });
    it('status should be `progressing` if there are no failed operators and some progressing', () => {
      const operators = [
        generateOperatorMock('bbb', 'progressing'),
        generateOperatorMock('ccc', 'available'),
        generateOperatorMock('eee'),
      ];
      expect(getAggregatedStatus(operators)).toEqual('progressing');
    });
    it('status should be `pending` if there are opertators without status or in available status', () => {
      const operators = [
        generateOperatorMock('aaa', 'available'),
        generateOperatorMock('bbb', 'available'),
        generateOperatorMock('ccc', 'available'),
        generateOperatorMock('eee'),
      ];
      expect(getAggregatedStatus(operators)).toEqual('pending');
    });
    it('status should be `available` only if all operators are in available state', () => {
      const operators = [
        generateOperatorMock('aaa', 'available'),
        generateOperatorMock('bbb', 'available'),
        generateOperatorMock('ccc', 'available'),
      ];
      expect(getAggregatedStatus(operators)).toEqual('available');
    });
  });

  describe('getLabel', () => {
    it('should reflect failed operators count if there are failed operators', () => {
      const operators = [
        generateOperatorMock('aaa', 'failed'),
        generateOperatorMock('bbb', 'available'),
        generateOperatorMock('ccc'),
      ];
      expect(getLabel(operators)).toEqual('1/3 operators failed');
    });
    it('should reflect failed operators count if there is one operator and it fails', () => {
      const operators = [generateOperatorMock('aaa', 'failed')];
      expect(getLabel(operators)).toEqual('1 operator failed');
    });
    it('should reflect that operators are installing if there are progressing operators and no failed ones', () => {
      const operators = [
        generateOperatorMock('ddd', 'progressing'),
        generateOperatorMock('aaa', 'progressing'),
        generateOperatorMock('bbb', 'available'),
        generateOperatorMock('ccc'),
      ];
      expect(getLabel(operators)).toEqual('Installing 4 operators');
    });
    it('should inform that operators will be installed if all operators are without status', () => {
      const operators = [
        generateOperatorMock('ddd'),
        generateOperatorMock('aaa'),
        generateOperatorMock('bbb'),
        generateOperatorMock('ccc'),
      ];
      expect(getLabel(operators)).toEqual('4 operators');
    });
  });
});
