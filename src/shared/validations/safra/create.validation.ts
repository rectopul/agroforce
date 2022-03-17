import { SchemaOf, object, string, number, date } from 'yup';

import { ISafraPropsDTO } from '../../dtos/ISafraPropsDTO';

export const validationSafra: SchemaOf<ISafraPropsDTO> = object({
  id_culture: number().integer().required(),
  year: date().required(),
  typeCrop: string().trim().required(),
  plantingStartTime: string().trim().required(),
  plantingEndTime: string().trim().required(),
  status: number().integer().min(1).required(),
  created_by: object({
    id: number().integer().required(),
  }).required(),
});
