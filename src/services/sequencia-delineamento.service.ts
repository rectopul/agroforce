import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface ISequenciaDelineamento {
  id: number;
  id_delineamento: number;
  name: string;
  repeticao: number;
  sorteio: number;
  nt: number;
  bloco: number;
  status?: number;
  created_by: number;
}

type ICreateSequenciaDelineamento = Omit<
  ISequenciaDelineamento, 'id' | 'status'
>;

type IUpdateSequenciaDelineamento = Omit<
  ISequenciaDelineamento, 'id_delineamento' | 'status' | 'created_by'
>;

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/sequencia-delineamento`;

export const sequenciaDelineamentoService = {
  list,
  create,
  update,
  getAll,
};

async function create(data: ICreateSequenciaDelineamento) {
  const genotipo = await fetchWrapper.post(`${baseUrl}/id_delineamento`, data);
  return genotipo;
}

async function update(data: IUpdateSequenciaDelineamento) {
  const genotipo = await fetchWrapper.put(baseUrl, data);
  return genotipo;
}

async function getAll(parameters: any) {
  const genotipo = await fetchWrapper.get(`${baseUrl}/list`, parameters);
  return genotipo;
}

async function list(id_culture: number) {
  const genotipo = await fetchWrapper.get(baseUrl, id_culture);
  return genotipo;
}
