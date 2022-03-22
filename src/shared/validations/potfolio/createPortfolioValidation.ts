import { SchemaOf, object, string, number, date } from 'yup';

import { ICreatePortfolioDTO } from '../../dtos/portfolioDTO/ICreatePortfolioDTO';

export const validationCreatePortfolio: SchemaOf<ICreatePortfolioDTO> = object({
  id_culture: number().integer().required(),
  genealogy: string().required(),
  cruza: string().trim().required(),
  status: number().integer().required(),
  created_by: number().integer().required(),
});
