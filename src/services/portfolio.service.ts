import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface IPortfolioUpdate {
  id_portfolio: number;
  id_culture_portfolio: number;
  genealogy: string;
  cruza: string;
  status?: number;
}

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/portfolio`;

export const portfolioService = {
  update,
  getAll,
  create,
};

async function create(data: any) {
  const portfolio = await fetchWrapper.post(baseUrl, data);
  return portfolio;
}

async function update(data: IPortfolioUpdate) {
  const portfolio = await fetchWrapper.put(baseUrl, data);
  return portfolio;
}

async function getAll(parameters: any) {
  const portfolio = await fetchWrapper.get(baseUrl, parameters);
  return portfolio;
}
