import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/safra`;

export const safraService = {
    getAll,
    create,
    updateSafras
};

async function create(data: any) {
    return fetchWrapper.post(baseUrl, data);
}

function updateSafras(data: any) {
    return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}
