import { prisma } from "../pages/api/db/db";

export class LotePortfolioRepository {
  async findAll() {
    const lotePortfolio = await prisma.lote.findMany();

    return lotePortfolio;
  }
}
