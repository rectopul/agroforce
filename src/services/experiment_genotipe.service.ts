import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/experiment_genotipe`;

function create(data: any) {
    return fetchWrapper.post(baseUrl, data);
}

export const experimentGenotipeService = {
    create,
};
