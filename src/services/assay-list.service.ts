import getConfig from 'next/config';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/assay-list`;

export const delineamentoService = {
	getAll,
	create,
	update,
	_delete
};

function create(data: any) {
	return fetchWrapper.post(baseUrl, data);
}

function update(data: any) {
	return fetchWrapper.put(baseUrl, data);
}

function getAll(parameters: any) {
	return fetchWrapper.get(baseUrl, parameters);
}

function _delete(parameters: any) {
	return fetchWrapper._delete(baseUrl, parameters);
}