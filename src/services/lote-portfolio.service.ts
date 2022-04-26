import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/lote-portfolio`;

export const lotePortfolioService = { listAll };

async function listAll(id_portfolio: number, id_culture: number) {
  const lote = await fetchWrapper.get(baseUrl, { id_portfolio, id_culture });
  return lote;
}
