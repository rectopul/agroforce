import { IUpdatePortfolioDTO } from 'src/shared/dtos/portfolioDTO/IUpdatePortfolioDTO';
import { validationUpdatePortfolio } from 'src/shared/validations/potfolio/updatePortfolioValidation';
import { PortfolioRepository } from '../repository/portfolio.repository';

import { ICreatePortfolioDTO } from '../shared/dtos/portfolioDTO/ICreatePortfolioDTO';
import { validationCreatePortfolio } from '../shared/validations/potfolio/createPortfolioValidation';
import { portfolio as Portfolio } from '@prisma/client';
interface IListPortfolio {
  where: Portfolio | undefined;
  select: any; 
  take: number;
  skip: number;
  orderBy: string | any;
}
export class PortfolioController {
  portfolioRepository = new PortfolioRepository();

  async listAllPortfolios(options: any) {
    const parameters: object | any = new Object();
    let take; 
    let skip;
    let orderBy: object | any;
    let select: any = [];

    if (options.filterStatus) {
      if (typeof(options.status) === 'string') {
        options.filterStatus = parseInt(options.filterStatus);
        if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
      } else {
        if (options.filterStatus != 2) parameters.status =parseInt(options.filterStatus);
      }
    }

    if (options.filterSearch) {
      options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';
      parameters.genealogy  = JSON.parse(options.filterSearch);
      parameters.cruza =JSON.parse(options.filterSearch);
    }

    if (options.paramSelect) {
      let objSelect = options.paramSelect.split(',');
      Object.keys(objSelect).forEach((item) => {
        select[objSelect[item]] = true;
      });
      select = Object.assign({}, select);
    } else {
      select = {
        id: true, 
        id_culture: true, 
        genealogy:true, 
        cruza:true, 
        status: true 
      };
    }

    if (options.genealogy) {
      parameters.genealogy = options.genealogy;
    }
    
    if (options.cruza) {
      parameters.cruza = options.cruza;
    }

    if (options.cruza) {
      parameters.cruza = options.cruza;
    }

    if (options.id_culture) {
      parameters.id_culture = options.id_culture;
    }

    if (options.take) {
      if (typeof(options.take) === 'string') {
        take = parseInt(options.take);
      } else {
        take = options.take;
      }
    }

    if (options.skip) {
      if (typeof(options.skip) === 'string') {
        skip = parseInt(options.skip);
      } else {
        skip = options.skip;
      }
    }

    if (options.orderBy) {
        orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
    }
    
    let response: object | any = await this.portfolioRepository.findAll(
      parameters,
      select, 
      take, 
      skip, 
      orderBy 
    );

    if (!response) { 
      throw "falha na requisição, tente novamente";
    } else {
      return {status: 200, response, total: response.total}
    }    
  }

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
