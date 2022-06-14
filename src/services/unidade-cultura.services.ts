import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';


const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/unidade-cultura`;

export const unidadeCulturaService = {
    getAll,
    create,
    update
};

async function create(data: any) {
    const unidadeCultura = await fetchWrapper.post(baseUrl, data);
    return unidadeCultura;
}

async function getAll(parameters: any) {
    
    const unidadeCultura = await fetchWrapper.get(baseUrl, parameters);
    return unidadeCultura;
}

async function update(data: any) {
    const unidadeCultura = await fetchWrapper.put(baseUrl, data);
    return unidadeCultura;
}
