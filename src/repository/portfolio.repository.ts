import {prisma} from '../pages/api/db/db';
import { ICreatePortfolioDTO } from 'src/shared/dtos/portfolioDTO/ICreatePortfolioDTO';
import { IUpdatePortfolioDTO } from 'src/shared/dtos/portfolioDTO/IUpdatePortfolioDTO';

export class PortfolioRepository {
  async create(data: ICreatePortfolioDTO) {
    const portfolio = await prisma.portfolio.create({ data });
    return portfolio;
  }

  async findOne(id: number) {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    });
    return portfolio;
  }

  async update(id: number, data: IUpdatePortfolioDTO) {
    const portfolio = await this.findOne(id);

    if (portfolio !== null) {
      const result = await prisma.portfolio.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }
}
