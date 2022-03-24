import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();

const apiDepartment = 'user/departament' || 'department';
const baseUrl = `${publicRuntimeConfig.apiUrl}/${apiDepartment}`;

export const departmentService = {
    getAll,
    createProfile,
    update
};

async function createProfile(data: any) {
    const result = await fetchWrapper.post(baseUrl, data);
    return result;
}

async function getAll(parameters: any) {
    const result = await fetchWrapper.get(baseUrl, parameters);
    return result;
}

async function update(parameters: any) {
    const result = await fetchWrapper.put(baseUrl, parameters);
    return result;
}
