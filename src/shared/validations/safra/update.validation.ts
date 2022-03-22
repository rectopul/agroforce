import { SchemaOf, object, string, number } from 'yup';

import { ISafraUpdateDTO } from '../../dtos/ISafraUpdateDTO';

export const validationSafraUpdate: SchemaOf<ISafraUpdateDTO> = object({
  id: number().integer().required(),
  id_culture: number().integer().required(),
  year: string().required(),
  typeCrop: string().required(),
  plantingStartTime: string().required(),
  plantingEndTime: string().required(),
  status: number().integer().required(),
});
