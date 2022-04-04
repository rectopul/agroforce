import { PortfolioRepository } from "src/repository/portfolio.repository";
import { number, object, SchemaOf, string } from 'yup';

interface Portfolio {
  id: number;
  id_culture: number;
  genealogy: string;
  cruza: string;
  status: number;
  created_by: number;
};

type CreatePortfolio = Omit<Portfolio, 'id'>;
type UpdatePortfolio = Omit<Portfolio, 'created_by'>;
export class PortfolioController {
  public readonly required = 'Campo obrigatório';

  portfolioRepository = new PortfolioRepository();

  async listAllPortfolios(options: any) {
    const parameters: object | any = new Object();
    let take; 
    let skip;
    let orderBy: object | any;
    let select: any = [];
    try {
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
        parameters.cruza = JSON.parse(options.filterSearch);
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
      if (!response && response.total <= 0) { 
        return {status: 400, response: '', total: 0}  
      } else {
        return {status: 200, response, total: response.total}
      }    
    } catch(err) {  
      return {status: 400, message: err}
    }   
  }

  async getOnePortfolio(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.portfolioRepository.findOne(id);

      if (!response) throw new Error("Item não encontrado");

      return {status: 200 , response};
    } catch (err) {
      return {status: 400, message: err}
    }
  }

  async createPortfolio(data: CreatePortfolio) {
    try {
      const schema: SchemaOf<CreatePortfolio> = object({
        id_culture: number().integer().required(this.required),
        genealogy: string().required(this.required),
        cruza: string().required(this.required),
        status: number().integer().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      const portfolioAlreadyExists = await this.portfolioRepository.findByGenealogy(data.genealogy);

      if (portfolioAlreadyExists) {
        return { status: 400, message: "Genealogia já cadastra. favor consultar os inativos" };
      }

      await this.portfolioRepository.create(data);

      return {status: 201, message: "Genealogia cadastrada"}
    } catch(err) {
      return {status: 400, message: "Erro no cadastrado"}
    }
  }

  async updatePortfolio(data: UpdatePortfolio) {
    try {
      const schema: SchemaOf<UpdatePortfolio> = object({
        id: number().integer().required(this.required),
        id_culture: number().integer().required(this.required),
        genealogy: string().required(this.required),
        cruza: string().required(this.required),
        status: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      const portfolio = await this.portfolioRepository.findOne(data.id);
      
      if (!portfolio) return { status: 400, message: 'Portfólio não encontrado' };

      const loteAlreadyExists = await this.portfolioRepository.findByGenealogy(data.genealogy);

      if (loteAlreadyExists && loteAlreadyExists.id !== portfolio.id) {
        return { status: 400, message: 'Genealogia do portfólio já cadastro. favor consultar os inativos' }
      }

      portfolio.id_culture = data.id_culture;
      portfolio.genealogy = data.genealogy;
      portfolio.cruza = data.cruza;
      portfolio.status = data.status;

      await this.portfolioRepository.update(portfolio.id, portfolio);

      return {status: 200, message: "Genealogia atualizada"}
    } catch (err) {
      return { status: 404, message: 'Erro ao atualizar' }
    }
  }
}
