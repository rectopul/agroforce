import { FocoRepository } from '../repository/foco.repository';

import { IUpdateFocoDTO } from 'src/shared/dtos/focoDTO/IUpdateFocoDTO';
import { ICreateFocoDTO } from '../shared/dtos/focoDTO/ICreateFocoDTO';

import { validationFocoUpdate } from 'src/shared/validations/foco/update.validation';
import { validationFocoCreate } from '../shared/validations/foco/create.validation';

export class FocoController {
  focoRepository = new FocoRepository();

  async listAllFocos(options: any) {
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
    
    let response: object | any = await this.focoRepository.findAll(
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

      const response = await this.focoRepository.findOne(id);

      if (!response) throw new Error("Dados inválidos");

      return {status: 200 , response};
    } catch (e) {
      return {status: 400, message: 'Portfólio não encontrado'};
    }
  };

  async createFoco(data: ICreateFocoDTO) {
    try {
      // Validação
      const valid = validationFocoCreate.isValidSync(data);

      if (!valid) throw new Error('Dados inválidos');

      // Salvando
      await this.focoRepository.create(data);

      return {status: 201, message: "Foco cadastrado com sucesso!"}
    } catch(err) {
      return { status: 404, message: "Erro"}
    }
  };

  async updateFoco(data: IUpdateFocoDTO) {
    try {
      // Validação
      const valid = validationFocoUpdate.isValidSync(data);

      if (!valid) throw new Error('Dados inválidos');

      // Salvando
      await this.focoRepository.update(data.id, data);

      return {status: 200, message: "Foco atualizado!"}
    } catch (err) {
      return { status: 404, message: "Erro ao atualizar" }
    }
  };
};
