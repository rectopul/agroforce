import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/experiment-genotipe`;

function create(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

function update(data: any) {
  return fetchWrapper.put(baseUrl, data);
}

// function validateProtocol(data: any) {
//   return fetchWrapper.post(`${baseUrl}/validateProtocol`, data);
// }

function getLastNpeDisponible(data: any) {
  return fetchWrapper.post(`${baseUrl}/getLastNpeDisponible`, data);
}

export const experimentGenotipeService = {
  create,
  update,
  getAll,
  getLastNpeDisponible,
};
