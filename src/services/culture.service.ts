import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';


interface CultureUpdate {
    id: number;
    name: string;
    desc: string;
    status?: number;
}

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;

export const cultureService = {
    getAll,
    createCulture,
    updateCulture
};

async function createCulture(data: any) {
    const culture = await fetchWrapper.post(baseUrl, data);
    return culture;
}

async function getAll(parameters: any) {
    const culture = await fetchWrapper.get(baseUrl, parameters);
    return culture;
}

async function updateCulture(data: CultureUpdate) {
    const culture = await fetchWrapper.put(baseUrl, data);
    return culture;
}
