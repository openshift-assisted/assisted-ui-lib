import { AxiosPromise, AxiosRequestConfig } from 'axios';
import {
  Cluster,
  ClusterCreateParams,
  Host,
  ClusterUpdateParams,
  ImageCreateParams,
  Credentials,
  Presigned,
  EventList,
  Event,
  LogsType,
} from './types';
import { client } from './axiosClient';
import { API_ROOT } from './constants';

export const getClusters = (): AxiosPromise<Cluster[]> => client.get('/clusters');

export const getCluster = (id: string): AxiosPromise<Cluster> => client.get(`/clusters/${id}`);
export const getClustersByOpenshiftId = (openshiftId: string): AxiosPromise<Cluster[]> =>
  client.get(`/clusters?openshift_cluster_id=${openshiftId}`);

export const postCluster = (params: ClusterCreateParams): AxiosPromise<Cluster> =>
  client.post('/clusters', params);

export const patchCluster = (id: string, params: ClusterUpdateParams): AxiosPromise<Cluster> =>
  client.patch(`/clusters/${id}`, params);

export const deleteCluster = (id: string): AxiosPromise<void> => client.delete(`/clusters/${id}`);

export const getClusterHosts = (id: string): AxiosPromise<Host[]> =>
  client.get(`/clusters/${id}/hosts`);

export const enableClusterHost = (clusterId: string, hostId: string): AxiosPromise<Cluster> =>
  client.post(`/clusters/${clusterId}/hosts/${hostId}/actions/enable`);

export const disableClusterHost = (clusterId: string, hostId: string): AxiosPromise<Cluster> =>
  client.delete(`/clusters/${clusterId}/hosts/${hostId}/actions/enable`);

export const resetClusterHost = (clusterId: string, hostId: string): AxiosPromise<Host> =>
  client.post(`/clusters/${clusterId}/hosts/${hostId}/actions/reset`);

export const deleteClusterHost = (clusterId: string, hostId: string): AxiosPromise<void> =>
  client.delete(`/clusters/${clusterId}/hosts/${hostId}`);

export const postInstallCluster = (clusterId: string): AxiosPromise<Cluster> =>
  client.post(`/clusters/${clusterId}/actions/install`);

export const postResetCluster = (clusterId: string): AxiosPromise<Cluster> =>
  client.post(`/clusters/${clusterId}/actions/reset`);

export const postCancelInstallation = (clusterId: string): AxiosPromise<Cluster> =>
  client.post(`/clusters/${clusterId}/actions/cancel`);

export const createClusterDownloadsImage = (
  id: string,
  params: ImageCreateParams,
  axiosOptions: AxiosRequestConfig,
): AxiosPromise<Cluster> => client.post(`/clusters/${id}/downloads/image`, params, axiosOptions);

type getPresignedFileUrlProps = {
  clusterId: string;
  fileName: 'logs' | 'kubeconfig' | 'kubeconfig-noingress';
  hostId?: string;
  logsType?: LogsType;
};
export const getPresignedFileUrl = ({
  clusterId,
  fileName,
  hostId,
  logsType,
}: getPresignedFileUrlProps): AxiosPromise<Presigned> =>
  client.get(
    `/clusters/${clusterId}/downloads/files-presigned?file_name=${fileName}${
      logsType ? `&logs_type=${logsType}` : ''
    }${hostId ? `&host_id=${hostId}` : ''}`,
  );

export const getClusterFileDownload = (clusterID: Cluster['id'], fileName: string): AxiosPromise =>
  client.get(`/clusters/${clusterID}/downloads/files?file_name=${fileName}`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  });

export const getClusterDownloadsImageUrl = (clusterId: string) =>
  `${API_ROOT}/clusters/${clusterId}/downloads/image`;

export const getClusterCredentials = (clusterID: string): AxiosPromise<Credentials> =>
  client.get(`/clusters/${clusterID}/credentials`);

export const getHostLogsDownloadUrl = (hostId: string, clusterId?: string) => {
  return `${API_ROOT}/clusters/${clusterId}/logs?logs_type=host&host_id=${hostId}`;
};

export const getClusterLogsDownloadUrl = (clusterId: string) => {
  return `${API_ROOT}/clusters/${clusterId}/logs?logs_type=all`;
};

export const getEvents = (
  clusterID: Event['clusterId'],
  hostID: Event['hostId'],
): AxiosPromise<EventList> =>
  client.get(`/clusters/${clusterID}/events${hostID ? `?host_id=${hostID}` : ''}`);
