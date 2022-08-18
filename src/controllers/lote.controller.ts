import handleError from '../shared/utils/handleError';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { LoteRepository } from '../repository/lote.repository';

export class LoteController {
  loteRepository = new LoteRepository();

  async getOne(id: number) {
    try {
      const response = await this.loteRepository.findById(id);

      if (response) {
        return { status: 200, response };
      }
      return { status: 404, response: [], message: 'Lote não encontrado' };
    } catch (error: any) {
      handleError('Lote Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Lote erro');
    }
  }

  async create(data: any) {
    try {
      const response = await this.loteRepository.create(data);
      if (response) {
        return { status: 200, response, message: 'Lote cadastrado' };
      }
      return { status: 400, message: 'Lote não cadastrado' };
    } catch (error: any) {
      handleError('Lote Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Lote erro');
    }
  }

  async update(data: any) {
    try {
      const lote = await this.loteRepository.findById(data.id);

      if (!lote) return { status: 404, message: 'Lote não existente' };

      const response = await this.loteRepository.update(data.id, data);
      if (response) {
        return { status: 200, response, message: 'Lote atualizado' };
      }
      return { status: 400, message: 'Lote não atualizado' };
    } catch (error: any) {
      handleError('Lote Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Lote erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any = '';
    parameters.AND = [];
    try {
      if (options.filterYear) {
        parameters.year = Number(options.filterYear);
      }
      if (options.filterCodLote) {
        parameters.cod_lote = JSON.parse(`{ "contains":"${options.filterCodLote}" }`);
      }
      if (options.filterNcc) {
        parameters.ncc = Number(options.filterNcc);
      }
      if (options.filterPeso) {
        parameters.peso = Number(options.filterPeso);
      }
      if (options.filterFase) {
        parameters.fase = JSON.parse(`{ "contains":"${options.filterFase}" }`);
      }
      if (options.filterSeeds) {
        parameters.quant_sementes = Number(options.filterSeeds);
      }
      if (options.filterGenotipo) {
        parameters.AND.push(JSON.parse(`{ "genotipo": {"name_genotipo": {"contains": "${options.filterGenotipo}" } } }`));
      }
      if (options.filterMainName) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "name_main": {"contains": "${options.filterMainName}" } } }`));
      }
      if (options.filterGmr) {
        const gmrMax = Number(options.filterGmr) + 1;
        parameters.AND.push(JSON.parse(`{ "genotipo": { "gmr": {"gte": "${Number(options.filterGmr).toFixed(1)}", "lt": "${gmrMax.toFixed(1)}" } } }`));
      }
      if (options.filterBgm) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "bgm":  ${Number(options.filterBgm)}  } }`));
      }
      if (options.filterTecnologiaCod) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "tecnologia": { "cod_tec": {"contains": "${options.filterTecnologiaCod}" } } } }`));
      }
      if (options.filterTecnologiaDesc) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "tecnologia": { "desc": {"contains": "${options.filterTecnologiaDesc}" } } } }`));
      }

      const select = {
        id: true,
        id_genotipo: true,
        id_s2: true,
        id_dados: true,
        year: true,
        cod_lote: true,
        ncc: true,
        fase: true,
        peso: true,
        quant_sementes: true,
        genotipo: {
          select: {
            id: true,
            name_genotipo: true,
            name_main: true,
            gmr: true,
            bgm: true,
            tecnologia: {
              select:
              {
                desc: true,
                cod_tec: true,
              },
            },
          },
        },
      };

      if (options.genotipo) {
        parameters.genotipo = options.genotipo;
      }

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.cod_lote) {
        parameters.cod_lote = options.cod_lote;
      }

      if (options.id_genotipo) {
        parameters.id_genotipo = Number(options.id_genotipo);
      }

      if (options.id_dados) {
        parameters.id_dados = Number(options.id_dados);
      }

      if (options.ncc) {
        parameters.ncc = Number(options.ncc);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.loteRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Lote Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Lote erro');
    }
  }
}
