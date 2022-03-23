import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';
import { ICreateCultureDTO } from 'src/shared/dtos/culturaDTO/ICreateCultureDTO';
import { IUpdateCultureDTO } from 'src/shared/dtos/culturaDTO/IUpdateCultureDTO';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;

export const cultureService = {
    getAll,
    createCulture,
    updateCulture
};

async function createCulture(data: ICreateCultureDTO) {
    const culture = await fetchWrapper.post(baseUrl, data);
    return culture;
}

async function getAll(parameters: any) {
    const culture = await fetchWrapper.get(baseUrl, parameters);
    return culture;
}

async function updateCulture(data: IUpdateCultureDTO) {
    const culture = await fetchWrapper.put(baseUrl, data);
    return culture;
}
