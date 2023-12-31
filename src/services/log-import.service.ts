import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/log-import`;

export const logImportService = {
  getAll,
  create,
  update,
};

async function create(data: any) {
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
