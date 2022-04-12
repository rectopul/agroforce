import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/foco`;

interface UpdateLoteDTO {
  id: number;
  name: string;
  status?: number;
}

export const focoService = {
  update,
  getAll,
  create,
};

async function create(data: any) {
  const foco = await fetchWrapper.post(baseUrl, data);
  return foco;
}

async function update(data: UpdateLoteDTO) {
  const foco = await fetchWrapper.put(baseUrl, data);
  return foco;
}

async function getAll(parameters: any) {
  const portfolio = await fetchWrapper.get(baseUrl, parameters);
  return portfolio;
}
