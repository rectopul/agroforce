import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/foco`;

async function create(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

async function update(data: any) {
  return fetchWrapper.put(baseUrl, data);
}

async function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

export const focoService = {
  update,
  getAll,
  create,
};
