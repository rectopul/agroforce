import { prisma } from "../pages/api/db/db";

 interface CreateLotePortfolioDTO {
  id_lote: number;
  id_portfolio: number;
 }

export class LoteRepository {
  async create(data: CreateLotePortfolioDTO) {
    const lotePortfolio = await prisma.lotePortfolio.create({
      data
    });

    return lotePortfolio;
  }
}
