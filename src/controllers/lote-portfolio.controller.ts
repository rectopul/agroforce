import { LotePortfolioRepository } from "src/repository/lote-portfolio.repository";

export class LotePortfolioController {
  lotePortfolioRepository = new LotePortfolioRepository();


  async list(id_portfolio: number, id_culture: number) {
    try {
      const response = await this.lotePortfolioRepository.findAll(id_portfolio, id_culture)

      if (!response) {
        return { status: 400, response: [] }
      }

      return {status: 200 , response};
    } catch (e) {
      return { status: 400, response: [] };
    }
  }
}
