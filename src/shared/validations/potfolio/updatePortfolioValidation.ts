import { SchemaOf, object, string, number, date } from 'yup';

import { IUpdatePortfolioDTO } from '../../dtos/portfolioDTO/IUpdatePortfolioDTO';

export const validationUpdatePortfolio: SchemaOf<IUpdatePortfolioDTO> = object({
  id: number().integer().required(),
  id_culture: number().integer().required(),
  genealogy: string().required(),
  cruza: string().trim().required(),
  status: number().integer().required(),
  created_by: number().integer().required(),
});
