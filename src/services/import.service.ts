import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

export const importService = {
  getAll,
  create,
  update,
  validate,
  validateProtocol
};

function create(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

function update(data: any) {
  return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

function validate(data: any) {
  return fetchWrapper.post(`${baseUrl}/validate`, data);
}

function validateProtocol(data: any) {
  return fetchWrapper.post(`${baseUrl}/validateProtocol`, data);
}
