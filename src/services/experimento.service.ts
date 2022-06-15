import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/experimento`;

export const experimentoService = {
  update,
  getAll,
  create,
  list
};

async function create(data: any) {
  const experimento = await fetchWrapper.post(baseUrl, data);
  return experimento;
}

async function update(data: any) {
  const experimento = await fetchWrapper.put(baseUrl, data);
  return experimento;
}

async function getAll(parameters: any) {
  const experimento = await fetchWrapper.get(baseUrl, parameters);
  return experimento;
}

async function list(id_culture: number) {
  const experimento = await fetchWrapper.get(baseUrl, id_culture);
  return experimento;
}
