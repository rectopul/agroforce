import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';


const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/tecnologia`;

export const tecnologiaService = {
    getAll,
    create,
    update,
    getLocal
};

async function create(data: any) {
    const tecnologia = await fetchWrapper.post(baseUrl, data);
    return tecnologia;
}

async function update(data: any) {
    const tecnologia = await fetchWrapper.put(baseUrl, data);
    return tecnologia;
}

async function getAll(parameters: any) {
    const tecnologia = await fetchWrapper.get(baseUrl, parameters);
    return tecnologia;
}

async function getLocal(parameters: any) {
    const tecnologia = await fetchWrapper.get(`${baseUrl}/local`, parameters);
    return tecnologia;
}
