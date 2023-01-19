import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

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

function uploadFile(data: any) {
  return fetchWrapper.postFile(`${baseUrl}/uploadFile`, data);
}

function checkFile() {
  const data = {};
  return fetchWrapper.post(`${baseUrl}/checkFile`, data);
}

export const importService = {
  getAll,
  create,
  update,
  validate,
  validateProtocol,
  uploadFile,
  checkFile
};
