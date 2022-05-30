import { LayoutChildrenRepository } from "src/repository/layout-children.repository";

export class LayoutChildrenController {
  public readonly required = 'Campo obrigatório';

  disparoRepository = new LayoutChildrenRepository();

  async listAll(options: any) {
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
      } else {
        parameters.status = 1;
      }

      if (options.filterSearch) {
        options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';

      }

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] == 'tecnologia') {
            select[objSelect[item]] = true;
          } else { 
            select[objSelect[item]] = true;
          }
        });
        select = Object.assign({}, select);
      } else {
        select = {id: true, sl: true, sc: true, s_aloc: true, tiro: true, disparo: true, dist:true, st:true, cj:true, spc:true, scolheita:true, tipo_parcela:true, status: true};
      }
      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
      }

      if (options.id_layout) {
        parameters.id_layout = parseInt(options.id_layout);
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
      
      let response: object | any = await this.disparoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );

      if (!response && response.total <= 0) { 
        return {status: 400, response:[], total: 0, message: 'nenhum resultado encontrado'};
      } else {
        return {status: 200, response, total: response.total}
      }    
    } catch(err) { 
      console.log(err)
      return { status: 400, response: [], total: 0 }
    }   
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.disparoRepository.findOne(id);

      if (!response) throw new Error("Item não encontrado");

      return {status: 200 , response};
    } catch (err) {
      return {status: 400, message: err}
    }
  }

  async create(data: any) {
    try {
      console.log(data)
      let response = await this.disparoRepository.create(data);
      return {status: 201, message: "Disparo cadastrado"}
    } catch(err) {
      console.log(err);
      return {status: 400, message: "Erro no cadastrado"}
    }
  }

  async update(data: any) {
    try {

      const quadra: any = await this.disparoRepository.findOne(data.id);
      
      if (!quadra) return { status: 400, message: 'Genótipo não encontrado' };

      quadra.id_culture = data.id_culture;
      quadra.id_tecnologia = data.id_tecnologia;
      quadra.quadra = data.quadra;
      quadra.cruza = data.cruza;
      quadra.status = data.status;

      await this.disparoRepository.update(quadra.id, quadra);

      return {status: 200, message: "Genótipo atualizado"}
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Erro ao atualizar' }
    }
  }
}
