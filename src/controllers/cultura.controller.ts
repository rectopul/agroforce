import {CulturaRepository} from '../repository/culture.repository';
import { ICreateCultureDTO } from 'src/shared/dtos/culturaDTO/ICreateCultureDTO';
import { IUpdateCultureDTO } from 'src/shared/dtos/culturaDTO/IUpdateCultureDTO';
import { validationCreateCulture } from 'src/shared/validations/cultura/createValidation';
import { validationUpdateCulture } from 'src/shared/validations/cultura/updateValidation';

export class CulturaController {
    culturaRepository = new CulturaRepository();

    async getAllCulture(options: any) {
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
          parameters.name  = JSON.parse(options.filterSearch);
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
            name:true,
            status: true
          };
        }
    
        if (options.name) {
          parameters.name = options.name;
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
        
        let response: object | any = await this.culturaRepository.findAll(
          parameters,
          select,
          take,
          skip,
          orderBy
        );
        if (!response && response.total) { 
          throw "falha na requisição, tente novamente";
        } else {
          return {status: 200, response, total: response.total}
        }    
      };
    
      async getOneFoco(id: number) {
        try {
          if (!id) throw new Error("Dados inválidos");
    
          const response = await this.culturaRepository.findOne(id);
    
          if (!response) throw new Error("Dados inválidos");
    
          return {status: 200 , response};
        } catch (e) {
          return {status: 400, message: 'Portfólio não encontrado'};
        }       
    }

    async getOneCulture(id: number) {
        try {
            if (!id) throw new Error("Dados inválidos");
      
            const response = await this.culturaRepository.findOne(id);
      
            if (!response) throw new Error("Dados inválidos");
      
            return {status: 200 , response};
        } catch (e) {
        return {status: 400, message: 'Cultura não encontrada'};
        }
    }

    async postCulture(data: ICreateCultureDTO) {
        try {
            // Validação
            const valid = validationCreateCulture.isValidSync(data);
        
            if (!valid) throw new Error('Dados inválidos');
        
            // Salvando
            await this.culturaRepository.create(data);
        
            return {status: 201, message: "Cultura cadastrada com sucesso!"}
        } catch(err) {
            return { status: 404, message: "Erro"}
        }
    }

    async updateCulture(data: IUpdateCultureDTO) {
        try {
            // Validação
            const valid = validationUpdateCulture.isValidSync(data);
      
            if (!valid) throw new Error('Dados inválidos');
      
            // Salvando
            await this.culturaRepository.update(data.id, data);
      
            return { status: 200, message: "Cultura atualizada" }
        } catch (err) {
            return { status: 404, message: "Erro ao atualizar" }
        }
    }
}
