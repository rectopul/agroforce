import { SchemaOf, object, string, number, date } from 'yup';

import { ISafraPropsDTO } from '../../dtos/ISafraPropsDTO';

export const validationSafra: SchemaOf<ISafraPropsDTO> = object({
  id: number().integer(),
  id_culture: number().integer().required(),
  year: string().required(),
  typeCrop: string().trim().required(),
  plantingStartTime: string().trim().required(),
  plantingEndTime: string().trim().required(),
  main_safra: number().integer().min(1),
  status: number().integer().min(1).required(),
  created_by: number().integer().required(),
});
