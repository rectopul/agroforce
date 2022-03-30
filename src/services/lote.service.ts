import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

interface CreateLoteDTO {
  name: string;
  volume: number;
  created_by: number;
}

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/lote`;

export const cultureService = {
  getAll,
  create,
  update
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
