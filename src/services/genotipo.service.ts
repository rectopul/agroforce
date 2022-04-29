import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface IGenotipoUpdate {
  id: number;
  id_culture: number;
  genealogy: string;
  cruza: string;
  status?: number;
}

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/genotipo`;

export const genotipoService = {
  update,
  getAll,
  create,
  list
};

async function create(data: any) {
  const genotipo = await fetchWrapper.post(baseUrl, data);
  return genotipo;
}

async function update(data: IGenotipoUpdate) {
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
