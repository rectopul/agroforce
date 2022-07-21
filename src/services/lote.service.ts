import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface CreateLoteDTO {
  id_genotipo: number;
  name: string;
  volume: number;
  created_by: number;
}

interface UpdateLoteDTO {
  id: number;
  name: string;
  volume: number;
  status?: number;
}

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/lote`;
// const baseUrlRelation = `${publicRuntimeConfig.apiUrl}/lote-portfolio/lote`;

export const loteService = {
  getAll,
  create,
  update,
};

async function create(data: CreateLoteDTO) {
  const lote = await fetchWrapper.post(baseUrl, data);
  return lote;
}

async function getAll(parameters: any) {
  const lote = await fetchWrapper.get(baseUrl, parameters);
  return lote;
}

async function update(data: any) {
  const lote = await fetchWrapper.put(baseUrl, data);
  return lote;
}
