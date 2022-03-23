import { SchemaOf, object, string, number, date } from 'yup';

import { IUpdateCultureDTO } from '../../dtos/culturaDTO/IUpdateCultureDTO';

export const validationUpdateCulture: SchemaOf<IUpdateCultureDTO> = object({
  id: number().integer().required(),
  name: string().required(),
  status: number().integer().required(),
  created_by: number().integer().required(),
});
