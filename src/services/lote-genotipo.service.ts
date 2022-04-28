import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface ILoteGenotipoDTO {
  id: number;
  id_genotipo: number;
  name: string;
  volume: number;
  status?: number;
  created_by: number;
};

type ICreateLoteGenotipo = Omit<ILoteGenotipoDTO, "id" | "status">;
type IUpdateLoteGenotipo = Omit<ILoteGenotipoDTO, "created_by" | "status" | "id_genotipo">;
type IChangeStatusGenotipo = Omit<ILoteGenotipoDTO, "created_by" | "name" | "id_genotipo" | "volume">;

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/lote-genotipo`;

export const loteGenotipoService = {
  listAll,
  create,
  findOne,
  update,
  changeStatus,
};

async function create(data: ICreateLoteGenotipo) {
  const lote = await fetchWrapper.post(`${baseUrl}/id_genotipo`, data);
  return lote;
}

async function listAll(id_portfolio: number, id_culture: number) {
  const lote = await fetchWrapper.get(baseUrl, { id_portfolio, id_culture });
  return lote;
}

async function findOne(id: number) {
  const lote = await fetchWrapper.get(baseUrl, id);
  return lote;
}

async function update(data: IUpdateLoteGenotipo) {
  const lote = await fetchWrapper.put(baseUrl, data);
  return lote;
}

async function changeStatus(data: IChangeStatusGenotipo) {
  const lote = await fetchWrapper.put(`${baseUrl}/find-one`, data);
  return lote;
}
