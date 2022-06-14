import { QuadraRepository } from "src/repository/quadra.repository";

export class QuadraController {
  public readonly required = 'Campo obrigatório';

  quadraRepository = new QuadraRepository();

  async listAll(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (typeof (options.status) === 'string') {
          options.filterStatus = parseInt(options.filterStatus);
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        } else {
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        }
      } else {
        parameters.status = 1;
      }

      if (options.filterSearch) {
        options.filterSearch = '{"contains":"' + options.filterSearch + '"}';
        // parameters.genotipo  = JSON.parse(options.filterSearch);
        // parameters.cruza = JSON.parse(options.filterSearch);
      }

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] === 'tecnologia') {
            select[objSelect[item]] = true;
          } else {
            select[objSelect[item]] = true;
          }
        });
        select = Object.assign({}, select);
      } else {
        select = { id: true, cod_quadra: true, local_preparo: true, local_plantio: true, larg_q: true, comp_p: true, linha_p: true, comp_c: true, esquema: true, tiro_fixo: true, disparo_fixo: true, q: true, Safra: { select: { safraName: true } }, status: true };
      }
      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
      }

      if (options.cod_quadra) {
        parameters.cod_quadra = options.cod_quadra;
      }

      if (options.take) {
        if (typeof (options.take) === 'string') {
          take = parseInt(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof (options.skip) === 'string') {
          skip = parseInt(options.skip);
        } else {
          skip = options.skip;
        }
      }

      if (options.orderBy) {
        orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
      }

      let response: object | any = await this.quadraRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );

      if (!response && response.total <= 0) {
        return { status: 400, response: [], total: 0, message: 'nenhum resultado encontrado' };
      } else {
        return { status: 200, response, total: response.total }
      }
    } catch (err) {
      console.log(err)
      return { status: 400, response: [], total: 0 }
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.quadraRepository.findOne(id);

      if (!response) throw new Error("Item não encontrado");

      return { status: 200, response };
    } catch (err) {
      return { status: 400, message: err }
    }
  }

  async create(data: any) {
    try {
      let response = await this.quadraRepository.create(data);
      return { status: 201, message: "Genealogia cadastrada", response }
    } catch (err) {
      console.log(err);
      return { status: 400, message: "Erro no cadastrado" }
    }
  }

  async update(data: any) {
    try {

      const quadra: any = await this.quadraRepository.findOne(data.id);

      if (!quadra) return { status: 400, message: 'Genótipo não encontrado' };

      await this.quadraRepository.update(quadra.id, data);

      return { status: 200, message: "Genótipo atualizado" }
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Erro ao atualizar' }
    }
  }
}
