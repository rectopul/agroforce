import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;

export const cultureService = {
    getAll,
    createCulture
};

function createCulture(data: any) {
    return fetchWrapper.post(baseUrl, data);
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}
