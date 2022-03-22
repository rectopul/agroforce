import { SchemaOf, object, string, number, date } from 'yup';

import { ICreateFocoDTO } from '../../dtos/focoDTO/ICreateFocoDTO';

export const validationFocoCreate: SchemaOf<ICreateFocoDTO> = object({
  name: string().required(),
  created_by: number().integer().required(),
});
