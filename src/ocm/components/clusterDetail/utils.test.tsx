import { getClusterMemoryAmount } from './utils';
import { Cluster } from '../../../common';

const cluster = {
  hosts: [
    {
      id: '2391c735-7c5c-4528-b174-2e13c0c72b47',
      inventory: '{"cpu":{"count":2},"memory":{"usable_bytes":9323937792}}',
      status: 'error',
      role: 'worker',
    },
    {
      id: '47b3897e-795f-4a3c-a4a2-11876a1fa610',
      inventory: '{"cpu":{"count":4},"memory":{"usable_bytes":17809014784}}',
      status: 'error',
      role: 'master',
    },
    {
      id: 'ea458081-1c75-4a2e-a960-c2e4fa320547',
      inventory: '{"cpu":{"count":4},"memory":{"usable_bytes":17809014784}}',
      status: 'error',
      role: 'master',
    },
    {
      id: '03f3c095-1c13-476c-8ecb-997af7ac6205',
      inventory: '{"cpu":{"count":4},"memory":{"usable_bytes":17809014784}}',
      status: 'error',
      role: 'master',
    },
    {
      id: '386a741c-2e2c-48f0-ab29-98a620ff5a79',
      inventory: '{"cpu":{"count":2},"memory":{"usable_bytes":9323937792}}',
      status: 'error',
      role: 'worker',
    },
  ],
} as Cluster;

describe('clusterDetail/utils', () => {
  describe('getClusterMemoryAmount', () => {
    it('returns the total amount of memory', () => {
      const actual = getClusterMemoryAmount(cluster);
      expect(actual).toBeCloseTo(18647875584, 0);
    });
  });
});
