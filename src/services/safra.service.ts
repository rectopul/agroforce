import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface Safra {
    id: number;
    id_culture: number;
    year: string;
    typeCrop: string;
    plantingStartTime: string;
    plantingEndTime: string;
    main_safra?: number;
    status?: number;
    created_by: number;
};

type UpdateSafra = Omit<Safra, 'id_culture' | 'created_by' | 'main_safra'>;

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

function updateSafras(data: UpdateSafra) {
    return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}
