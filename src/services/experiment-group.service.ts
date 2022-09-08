import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/experiment-group`;

function create(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

function update(data: any) {
  return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

function deleted(parameters: any) {
  return fetchWrapper.deleted(baseUrl, parameters);
}

export const experimentGroupService = {
  getAll,
  create,
  update,
  deleted,
};
