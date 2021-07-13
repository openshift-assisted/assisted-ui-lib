import { Cluster } from '../api';

export type ProxyFieldsType = {
  enableProxy: boolean;
  httpProxy: Cluster['httpProxy'];
  httpsProxy: Cluster['httpsProxy'];
  noProxy: Cluster['noProxy'];
};
