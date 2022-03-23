import { FocoRepository } from '../repository/foco.repository';

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

      if (!response) throw new Error("Item não encontrado");

      return {status: 200 , response};
    } catch (e) {
      return {status: 400, message: 'Item não encontrado'};
    }
  };

  async createFoco(data: any) {
    try {
      await this.focoRepository.create(data);

      return {status: 201, message: "Item cadastrado"}
    } catch(err) {
      return { status: 404, message: "Item não cadastrado"}
    }
  };

  async updateFoco(data: any) {
    try {
      await this.focoRepository.update(data.id, data);

      return {status: 200, message: "Item atualizado"}
    } catch (err) {
      return { status: 404, message: "Item não encontrado" }
    }
  };
};