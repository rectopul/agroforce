import handleError from '../shared/utils/handleError';
import { GenotipoRepository } from '../repository/genotipo.repository';
import { functionsUtils } from '../shared/utils/functionsUtils';
import handleOrderForeign from '../shared/utils/handleOrderForeign';

export class GenotipoController {
  genotipoRepository = new GenotipoRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== 2) parameters.status = Number(options.filterStatus);
      }
      if (options.filterGenotipo) {
        parameters.name_genotipo = JSON.parse(`{"contains":"${options.filterGenotipo}"}`);
      }

      if (options.filterMainName) {
        parameters.name_main = JSON.parse(`{"contains":"${options.filterMainName}"}`);
      }

      if (options.filterGmr) {
        parameters.gmr = Number(options.filterGmr);
      }

      if (options.filterTecnologia) {
        parameters.tecnologia = JSON.parse(`{ "name": {"contains": "${options.filterTecnologia}" } }`);
      }

      if (options.filterCruza) {
        let temp = options.filterCruza.split(' ');
        temp = temp[1] ? `${temp[0]}+${temp[1]}` : temp[0];
        parameters.cruza = JSON.parse(`{"contains":"${temp}"}`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
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
          status: true,
          tecnologia: { select: { name: true, cod_tec: true } },
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

      if (!response || response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }
      response.map((item: any) => {
        item.countChildren = functionsUtils
          .countChildrenForSafra(item.lote, Number(options.id_safra));
      });
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

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Genotipo Controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Genotipo erro');
    }
  }

  async create(data: any) {
    try {
      const response = await this.genotipoRepository.create(data);
      return { status: 201, message: 'Genealogia cadastrada', response };
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
