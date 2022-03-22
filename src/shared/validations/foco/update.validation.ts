import { SchemaOf, object, string, number } from 'yup';

import { IUpdateFocoDTO } from '../../dtos/focoDTO/IUpdateFocoDTO';

export const validationFocoUpdate: SchemaOf<IUpdateFocoDTO> = object({
  id: number().integer().required(),
  name: string().required(),
  created_by: number().integer().required(),
  status: number().integer().required(),
});
