import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/user/preferences`;

export const userPreferencesService = {
    getAll,
    createPreferences,
    update
};

function createPreferences(data: any) {
    return fetchWrapper.post(baseUrl, data);
}

function update(data: any) {
    return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}
