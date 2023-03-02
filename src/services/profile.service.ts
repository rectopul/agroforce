import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/user/profile`;

function createProfile(data: any) {
  return fetchWrapper.post(baseUrl, data);
}

function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

function update(data: any) {
  return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/profile`, data);
}

export const profileService = {
  getAll,
  createProfile,
  update,
};
