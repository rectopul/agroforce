import { SchemaOf, object, string, number, date } from 'yup';

import { ICreateCultureDTO } from '../../dtos/culturaDTO/ICreateCultureDTO';

export const validationCreateCulture: SchemaOf<ICreateCultureDTO> = object({
  name: string().required(),
  status: number().integer().required(),
  created_by: number().integer().required(),
});
