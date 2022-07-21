import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/layout-quadra`;

export const layoutQuadraService = {
  getAll,
  create,
  update,
  getLocal,
};

function create(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

function update(data: any) {
  return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

function getLocal(parameters: any) {
  return fetchWrapper.get(`${baseUrl}/local`, parameters);
}
