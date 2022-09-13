import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/experiment_genotipe`;

function create(data: any) {
    return fetchWrapper.post(baseUrl, data);
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}

export const experimentGenotipeService = {
    create,
    getAll,
};