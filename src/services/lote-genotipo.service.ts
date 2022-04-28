import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface ILoteGenotipoDTO {
  id: number;
  id_genotipo: number;
  name: string;
  volume: number;
  status: number;
  created_by: number;
};

type ICreateLoteGenotipo = Omit<ILoteGenotipoDTO, "id" | "status">;

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/lote-genotipo`;

export const loteGenotipoService = {
  listAll,
  create,
};

async function create(data: ICreateLoteGenotipo) {
  const lote = await fetchWrapper.post(`${baseUrl}/id_genotipo`, data);
  return lote;
}

async function listAll(id_portfolio: number, id_culture: number) {
  const lote = await fetchWrapper.get(baseUrl, { id_portfolio, id_culture });
  return lote;
}
