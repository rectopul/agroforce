import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/foco`;

interface UpdateLoteDTO {
	id: number;
	name: string;
	status?: number;
	group?: number;
	id_culture?: number;
}

export const focoService = {
  update,
  getAll,
  create,
};

async function create(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

async function update(data: UpdateLoteDTO) {
  return fetchWrapper.put(baseUrl, data);
}

async function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}
