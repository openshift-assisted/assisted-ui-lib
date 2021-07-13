import type { Cluster, Host } from '../../../common';
import { calculateCollectedLogsCount, filterHostsByLogStates } from './utils';
import { uniqueId } from 'lodash';

const hostTemplate: Host = {
  id: '',
  kind: 'Host',
  href: '',
  status: 'error',
  statusInfo: '',
};

const clusterTemplate: Cluster = {
  id: '',
  kind: 'Cluster',
  href: '',
  status: 'error',
  statusInfo: '',
  imageInfo: {},
};

const copyWithNewId = <T extends { id: string }>(template: T, id: string) => {
  return {
    ...template,
    id,
  };
};

const generateHosts = (template: Host, count = 5) => {
  const hosts = [];
  for (let i = 0; i < count; i++) {
    hosts.push(copyWithNewId(template, uniqueId('#')));
  }

  return hosts;
};

describe('clusters/utils', () => {
  describe('filterHostsByLogStates', () => {
    it('includes only hosts with specific LogStates', () => {
      const hosts = generateHosts(hostTemplate);
      Object.assign(hosts[0], { logsInfo: 'completed' });
      Object.assign(hosts[1], { logsInfo: 'timeout' });
      Object.assign(hosts[2], { logsInfo: 'requested' });
      Object.assign(hosts[3], { logsInfo: 'collecting' });
      const cluster = copyWithNewId(clusterTemplate, uniqueId('#'));
      cluster.hosts = hosts;

      const expected = 2;
      const actual = filterHostsByLogStates(cluster, ['completed', 'timeout']);
      expect(actual.length).toBe(expected);
    });
  });

  describe('calculateCollectedLogsCount', () => {
    describe('when cluster.logsInfo is undefined, and host.logsInfo is undefined', () => {
      it('returns 0', () => {
        const cluster = copyWithNewId(clusterTemplate, uniqueId('#'));
        const hosts = generateHosts(hostTemplate);
        cluster.hosts = hosts;

        const expected = 0;
        const actual = calculateCollectedLogsCount(cluster);
        expect(actual).toBe(expected);
      });
    });
    describe('when cluster.logsInfo is undefined, and host.logsInfo is in ["completed", "timeout"] for some host in cluster.hosts', () => {
      it('returns the number of hosts with host.logsInfo in ["completed", "timeout"]', () => {
        const cluster = copyWithNewId(clusterTemplate, uniqueId('#'));
        const hosts = generateHosts(hostTemplate, 3);
        Object.assign(hosts[0], { logsInfo: 'completed' });
        Object.assign(hosts[1], { logsInfo: 'timeout' });
        cluster.hosts = hosts;

        const expected = 2;
        const actual = calculateCollectedLogsCount(cluster);
        expect(actual).toBe(expected);
      });
    });
    describe('when cluster.logsInfo is in ["completed", "timeout"], but host.logsInfo is undefined for every host in cluster.hosts', () => {
      it('returns 1', () => {
        const cluster = copyWithNewId(clusterTemplate, uniqueId('#'));
        const hosts = generateHosts(hostTemplate);
        cluster.hosts = hosts;
        cluster.logsInfo = 'completed';

        const expected = 1;
        const actual = calculateCollectedLogsCount(cluster);
        expect(actual).toBe(expected);
      });
    });
    describe('when cluster.logsInfo is in ["completed", "timeout"], and host.logsInfo is in ["completed", "timeout"] for every host in cluster.hosts', () => {
      it('returns 1 + cluster.hosts.length', () => {
        const cluster = copyWithNewId(clusterTemplate, uniqueId('#'));
        const hosts = generateHosts(hostTemplate, 2);
        Object.assign(hosts[0], { logsInfo: 'completed' });
        Object.assign(hosts[1], { logsInfo: 'timeout' });
        cluster.hosts = hosts;
        cluster.logsInfo = 'completed';

        const expected = 3;
        const actual = calculateCollectedLogsCount(cluster);
        expect(actual).toBe(expected);
      });
    });
  });
});

export {};
