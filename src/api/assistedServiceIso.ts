import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { client } from './axiosClient';
// import { AssistedServiceIsoCreateParams } from './types';
import { API_ROOT } from './constants';

// TODO(jtomasek): remove this in favor of the type from ./types
type AssistedServiceIsoCreateParams = {
  sshPublicKey: string;
  pullSecret: string;
};

export const postAssistedServiceIso = (
  params: AssistedServiceIsoCreateParams,
  axiosOptions: AxiosRequestConfig,
): AxiosPromise<void> => client.post('/assisted-service-iso', params, axiosOptions);

export const getAssistedServiceIsoUrl = () => `${API_ROOT}/assisted-service-iso/data`;
