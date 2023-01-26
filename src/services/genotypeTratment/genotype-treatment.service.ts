import getConfig from 'next/config';

import { fetchWrapper } from '../../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;

function create(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

function update(data: any) {
  return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

function getOne(data: { id: any }) {
  return fetchWrapper.post(`${baseUrl}/getOne`, data);
}

export const genotypeTreatmentService = {
  getAll,
  create,
  update,
  getOne,
};
