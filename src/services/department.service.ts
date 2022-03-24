import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}/user/departament`;
const baseUrl2 = `${publicRuntimeConfig.apiUrl}/department`;

export const departmentService = {
    getAll,
    create,
    update
};

async function create(data: any) {
    const result = await fetchWrapper.post(baseUrl2, data);
    return result;
}

async function getAll(parameters: any) {
    const result = await fetchWrapper.get(baseUrl2, parameters);
    return result;
}

async function update(parameters: any) {
    const result = await fetchWrapper.put(baseUrl2, parameters);
    return result;
}
