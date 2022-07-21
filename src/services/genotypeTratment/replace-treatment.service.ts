import getConfig from 'next/config';

import { fetchWrapper } from '../../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/replace-treatment`;

function replace(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

function getAll(data: any) {
  return fetchWrapper.get(baseUrl, data);
}

export const replaceTreatmentService = {
  replace,
  getAll,
};
