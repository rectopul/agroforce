import createXls from 'src/helpers/api/xlsx-global-download';
import handleError from '../../shared/utils/handleError';
import { GenotipoRepository } from '../../repository/genotipo.repository';
import { functionsUtils } from '../../shared/utils/functionsUtils';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';

export class GenotipoController {
  genotipoRepository = new GenotipoRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    parameters.AND = [];
    let orderBy: object | any;
    const equalsOrContains = options.importValidate ? 'equals' : 'contains';
    let select: any = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'TMG-GENOTIPE');
        return { status: 200, response: sheet };
      }

      if (options.filterGenotipo) {
        parameters.name_genotipo = JSON.parse(`{"${equalsOrContains}":"${options.filterGenotipo}"}`);
      }

      if (options.filterMainName) {
        parameters.name_main = JSON.parse(`{"${equalsOrContains}":"${options.filterMainName}"}`);
      }

      if (options.filterGmr) {
        const gmrMax = Number(options.filterGmr) + 1;
        parameters.gmr = JSON.parse(`{"gte": "${Number(options.filterGmr).toFixed(1)}", "lt": "${gmrMax.toFixed(1)}" }`);
      }

      if (options.filterGmrRangeFrom || options.filterGmrRangeTo) {
        if (options.filterGmrRangeFrom && options.filterGmrRangeTo) {
          parameters.gmr = JSON.parse(`{"gte": "${Number(options.filterGmrRangeFrom)}", "lte": "${Number(options.filterGmrRangeTo)}" }`);
        } else if (options.filterGmrRangeFrom) {
          parameters.gmr = JSON.parse(`{"gte": "${Number(options.filterGmrRangeFrom)}" }`);
        } else if (options.filterGmrRangeTo) {
          parameters.gmr = JSON.parse(`{"lte": "${Number(options.filterGmrRangeTo)}" }`);
        }
      }

      if (options.filterLotsFrom || options.filterLotsTo) {
        if (options.filterLotsFrom && options.filterLotsTo) {
          parameters.numberLotes = JSON.parse(`{"gte": ${Number(options.filterLotsFrom)}, "lte": ${Number(options.filterLotsTo)} }`);
        } else if (options.filterLotsFrom) {
          parameters.numberLotes = JSON.parse(`{"gte": ${Number(options.filterLotsFrom)} }`);
        } else if (options.filterLotsTo) {
          parameters.numberLotes = JSON.parse(`{"lte": ${Number(options.filterLotsTo)} }`);
        }
      }

      if (options.filterCodTecnologia) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": { "cod_tec": {"${equalsOrContains}": "${options.filterCodTecnologia}" } } }`));
      }

      if (options.filterTecnologiaDesc) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": { "name": {"${equalsOrContains}": "${options.filterTecnologiaDesc}" } } }`));
      }

      if (options.filterCruza) {
        let temp = options.filterCruza.split(' ');
        temp = temp[1] ? `${temp[0]}+${temp[1]}` : temp[0];
        parameters.cruza = JSON.parse(`{"${equalsOrContains}":"${temp}"}`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item: any) => {
          if (objSelect[item] === 'number_lotes') {
            select.lote = true;
          } else {
            select[objSelect[item]] = true;
          }
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          id_s1: true,
          id_dados: true,
          id_tecnologia: true,
          name_genotipo: true,
          name_main: true,
          name_public: true,
          name_experiment: true,
          name_alter: true,
          elit_name: true,
          tecnologia: {
            select: {
              name: true,
              id: true,
              cod_tec: true,
            },
          },
          culture: {
            select: {
              name: true,
              desc: true,
            },
          },
          numberLotes: true,
          type: true,
          gmr: true,
          bgm: true,
          cruza: true,
          progenitor_f_direto: true,
          progenitor_m_direto: true,
          progenitor_f_origem: true,
          progenitor_m_origem: true,
          progenitores_origem: true,
          parentesco_completo: true,
          lote: true,
        };
      }

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.id_dados) {
        parameters.id_dados = String(options.id_dados);
      }

      if (options.name_genotipo) {
        parameters.name_genotipo = options.name_genotipo;
      }

      if (options.cruza) {
        parameters.cruza = options.cruza;
      }

      if (options.genealogy) {
        parameters.genealogy = options.genealogy;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.genotipoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((genotipo: any) => {
        const dts = genotipo.lote.map((lote: any) => lote.dt_export);
        const maxDt = Math.max(...dts);
        genotipo.dt_export = (maxDt) ? new Date(maxDt) : '';

        // dt_rde
        const dtRde = genotipo.lote.map((lote: any) => lote.dt_rde);
        const maxDtRde = Math.max(...dtRde);
        genotipo.dt_rde = (maxDtRde) ? maxDtRde : '';
        
      });

      if (!response || response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }

      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Genotipo Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Genotipo erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.genotipoRepository.findOne(id);

      if (!response) return { status: 400, response };

      return { status: 200, response };
    } catch (error: any) {
      handleError('Genotipo Controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Genotipo erro');
    }
  }

  async getOneByName(name: any) {
    try {
      const response = await this.genotipoRepository.findOneByName(name);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Genotipo Controller', 'getOneByName', error.message);
      throw new Error('[Controller] - getOne Genotipo erro');
    }
  }

  async create(data: any) {
    try {
      const response = await this.genotipoRepository.create(data);
      return { status: 200, message: 'Genealogia cadastrada', response };
    } catch (error: any) {
      handleError('Genotipo Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Genotipo erro');
    }
  }

  async update(data: any) {
    try {
      const genotipo: any = await this.genotipoRepository.findOne(data.id);

      if (!genotipo) return { status: 400, message: 'Genótipo não encontrado' };

      await this.genotipoRepository.update(genotipo.id, data);

      return { status: 200, message: 'Genótipo atualizado' };
    } catch (error: any) {
      handleError('Genotipo Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Genotipo erro');
    }
  }
}
