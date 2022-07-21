import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/epoca`;

interface IEpoca {
  id: number;
  id_culture: number;
  name: string;
  status?: number;
  created_by: number;
}

type ICreateEpoca = Omit<IEpoca, 'id' | 'status'>;
type IUpdateEpoca = Omit<IEpoca, 'id_culture' | 'created_by'>;

export const epocaService = {
  update,
  getAll,
  create,
};

async function create(data: ICreateEpoca) {
  const foco = await fetchWrapper.post(baseUrl, data);
  return foco;
}

async function update(data: IUpdateEpoca) {
  const foco = await fetchWrapper.put(baseUrl, data);
  return foco;
}

async function getAll(parameters: any) {
  const portfolio = await fetchWrapper.get(baseUrl, parameters);
  return portfolio;
}
