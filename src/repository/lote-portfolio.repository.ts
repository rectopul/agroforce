import { prisma } from "../pages/api/db/db";

export class LotePortfolioRepository {
  async findAll(id_portfolio: number, id_culture: number) {
    const lotePortfolio = await prisma.lote_portfolio.findMany({
      where: {
        id_portfolio,
        portfolio: {
          culture: {
            id: id_culture
          }
        }
      },
      select: {
        id: true,

        lote: {
          select: {
            id: true,
            name: true,
            volume: true,
            status: true,
          }
        },
        portfolio: {
          select: {
            id: true,
            id_culture: true,
            genealogy: true,
          }
        }
      },
    });

    return lotePortfolio;
  }
}
