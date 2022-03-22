import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';
import { ICreateFocoDTO } from 'src/shared/dtos/focoDTO/ICreateFocoDTO';
import { IUpdateFocoDTO } from 'src/shared/dtos/focoDTO/IUpdateFocoDTO';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/foco`;

export const focoService = {
  update,
  getAll,
  create,
};

async function create(data: ICreateFocoDTO) {
  const foco = await fetchWrapper.post(baseUrl, data);
  return foco;
}

async function update(data: IUpdateFocoDTO) {
  const foco = await fetchWrapper.put(baseUrl, data);
  return foco;
}

async function getAll(parameters: any) {
  const portfolio = await fetchWrapper.get(baseUrl, parameters);
  return portfolio;
}
