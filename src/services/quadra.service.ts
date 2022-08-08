import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;

async function create(data: any) {
  const result = await fetchWrapper.post(baseUrl, data);
  return result;
}

async function update(data: any) {
  const result = await fetchWrapper.put(baseUrl, data);
  return result;
}

async function getAll(parameters: any) {
  const result = await fetchWrapper.get(baseUrl, parameters);
  return result;
}

async function list(id_culture: number) {
  const result = await fetchWrapper.get(baseUrl, id_culture);
  return result;
}

export const quadraService = {
  update,
  getAll,
  create,
  list,
};
