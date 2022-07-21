import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/envelope`;

export const envelopeService = {
  getAll,
  create,
  update,
};

async function create(data: any) {
  const envelope = await fetchWrapper.post(baseUrl, data);
  return envelope;
}

async function getAll(parameters: any) {
  const envelope = await fetchWrapper.get(baseUrl, parameters);
  return envelope;
}

async function update(data: any) {
  const envelope = await fetchWrapper.put(baseUrl, data);
  return envelope;
}
