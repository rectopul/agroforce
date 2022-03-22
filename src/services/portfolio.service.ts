import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';
import { ICreatePortfolioDTO } from 'src/shared/dtos/portfolioDTO/ICreatePortfolioDTO';
import { IUpdatePortfolioDTO } from 'src/shared/dtos/portfolioDTO/IUpdatePortfolioDTO';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/portfolio`;

export const portfolioService = {
  update,
  getAll,
  create,
};

async function create(data: ICreatePortfolioDTO) {
  const portfolio = await fetchWrapper.post(baseUrl, data);
  return portfolio;
}

async function update(data: IUpdatePortfolioDTO) {
  const portfolio = await fetchWrapper.put(baseUrl, data);
  return portfolio;
}

async function getAll(parameters: any) {
  const portfolio = await fetchWrapper.get(baseUrl, parameters);
  return portfolio;
}
