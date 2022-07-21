import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

interface DepartmentDTO {
    id: number;
    name: string;
    status?: number;
    created_by: number;
}

type CreateDepartmentDTO = Omit<DepartmentDTO, 'id' | 'status'>;
type UpdateDepartmentDTO = Omit<DepartmentDTO, 'created_by'>;

const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}/department`;

export const departmentService = {
  getAll,
  create,
  update,
};

async function create(data: CreateDepartmentDTO) {
  const result = await fetchWrapper.post(baseUrl, data);
  return result;
}

async function getAll(parameters: any) {
  const result = await fetchWrapper.get(baseUrl, parameters);
  return result;
}

async function update(parameters: UpdateDepartmentDTO) {
  const result = await fetchWrapper.put(baseUrl, parameters);
  return result;
}
