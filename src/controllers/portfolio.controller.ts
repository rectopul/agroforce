import { IUpdatePortfolioDTO } from 'src/shared/dtos/portfolioDTO/IUpdatePortfolioDTO';
import { validationUpdatePortfolio } from 'src/shared/validations/potfolio/updatePortfolioValidation';
import { PortfolioRepository } from '../repository/portfolio.repository';

import { ICreatePortfolioDTO } from '../shared/dtos/portfolioDTO/ICreatePortfolioDTO';
import { validationCreatePortfolio } from '../shared/validations/potfolio/createPortfolioValidation';

export class PortfolioController {
  portfolioRepository = new PortfolioRepository();

  async getOnePortfolio(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.portfolioRepository.findOne(id);

      if (!response) throw new Error("Dados inválidos");

      return {status: 200 , response};
    } catch (e) {
      return {status: 400, message: 'Portfólio não encontrado'};
    }
  }

  async createPortfolio(data: ICreatePortfolioDTO) {
    try {
      // Validação
      const valid = validationCreatePortfolio.isValidSync(data);

      if (!valid) throw new Error('Dados inválidos');

      // Salvando
      await this.portfolioRepository.create(data);

      return {status: 201, message: "Portfólio cadastrado com sucesso!"}
    } catch(err) {
      return { status: 404, message: "Erro"}
    }
  }

  async updatePortfolio(data: IUpdatePortfolioDTO) {
    try {
      // Validação
      const valid = validationUpdatePortfolio.isValidSync(data);

      if (!valid) throw new Error('Dados inválidos');

      // Salvando
      await this.portfolioRepository.update(data.id, data);

      return {status: 200, message: "Portfólio atualizado!"}
    } catch (err) {
      console.log(err)
      return { status: 404, message: "Erro ao atualizar" }
    }
  }
}
