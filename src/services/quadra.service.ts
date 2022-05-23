import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;

export const quadraService = {
  update,
  getAll,
  create,
  list
};

async function create(data: any) {
  const genotipo = await fetchWrapper.post(baseUrl, data);
  return genotipo;
}

async function update(data: any) {
  const genotipo = await fetchWrapper.put(baseUrl, data);
  return genotipo;
}

async function getAll(parameters: any) {
  const genotipo = await fetchWrapper.get(baseUrl, parameters);
  return genotipo;
}

async function list(id_culture: number) {
  const genotipo = await fetchWrapper.get(baseUrl, id_culture);
  return genotipo;
}
