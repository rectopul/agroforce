import { PortfolioRepository } from "src/repository/portfolio.repository";
export class PortfolioController {
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

  async createPortfolio(data: any) {
    try {
      await this.portfolioRepository.create(data);

      return {status: 201, message: "Item cadastrado"}
    } catch(err) {
      return {status: 400, message: err}
    }
  }

  async updatePortfolio(data: any) {
    try {
      await this.portfolioRepository.update(data.id, data);

      return {status: 200, message: "Item atualizado!"}
    } catch (err) {
     return {status: 400, message: err}
    }
  }
}
