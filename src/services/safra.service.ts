import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';
import { ISafraPropsDTO } from 'src/shared/dtos/ISafraPropsDTO';
import { ISafraUpdateDTO } from 'src/shared/dtos/ISafraUpdateDTO';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/safra`;

export const safraService = {
    getAll,
    create,
    updateSafras
};

async function create(data: ISafraPropsDTO) {
    return fetchWrapper.post(baseUrl, data);
}

function updateSafras(data: ISafraUpdateDTO) {
    return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}
