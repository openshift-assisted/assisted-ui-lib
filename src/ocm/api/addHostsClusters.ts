import { AxiosPromise } from 'axios';
import { client } from './axiosClient';
import { AddHostsClusterCreateParams, Cluster, Host } from '../../common';

export const addHostsClusters = (params: AddHostsClusterCreateParams): AxiosPromise<Cluster> =>
  client.post('/add_hosts_clusters', params);

export const installHosts = (clusterId: Cluster['id']): AxiosPromise<Cluster> =>
  client.post(`/clusters/${clusterId}/actions/install_hosts`);

export const installHost = (clusterId: Cluster['id'], hostId: Host['id']): AxiosPromise<Host> =>
  client.post(`/clusters/${clusterId}/hosts/${hostId}/actions/install`);
