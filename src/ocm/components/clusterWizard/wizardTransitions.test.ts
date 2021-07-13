import {
  checkClusterValidationGroups,
  checkClusterValidations,
  checkHostValidationGroups,
  checkHostValidations,
} from './wizardTransition';

describe('wizardTransitions module tests', () => {
  describe('checkHostValidationGroups', () => {
    it('should return false when validationsInfo parameter is empty object', () => {
      expect(checkHostValidationGroups({}, ['hardware'], [])).toBeFalsy();
    });
  });
  describe('checkHostValidations', () => {
    it('should return false when validationsInfo parameter is empty object', () => {
      expect(checkHostValidations({}, ['connected'])).toBeFalsy();
    });
  });
  describe('checkClusterValidationGroups', () => {
    it('should return false when validationsInfo parameter is empty object', () => {
      expect(checkClusterValidationGroups({}, ['hostsData'], [])).toBeFalsy();
    });
  });
  describe('checkClusterValidations', () => {
    it('should return false when validationsInfo parameter is empty object', () => {
      expect(checkClusterValidations({}, ['machine-cidr-defined'])).toBeFalsy();
    });
  });
});
