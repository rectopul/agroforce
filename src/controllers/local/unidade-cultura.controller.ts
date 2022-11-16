import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { UnidadeCulturaRepository } from '../../repository/unidade-cultura.repository';
import { IReturnObject } from '../../interfaces/shared/Import.interface';
import { SafraController } from '../safra.controller';

export class UnidadeCulturaController {
  public readonly required = 'Campo obrigatório';

  unidadeCulturaRepository = new UnidadeCulturaRepository();

  safraController = new SafraController();

  async getAll(options: any) {
    console.log('🚀 ~ file: unidade-cultura.controller.ts ~ line 15 ~ UnidadeCulturaController ~ getAll ~ options', options);
    const parameters: object | any = {};
    let orderBy: object | any;
    try {
      if (options.filterNameUnityCulture) {
        parameters.name_unity_culture = JSON.parse(`{ "contains": "${options.filterNameUnityCulture}" }`);
      }

      if (options.filterYear) {
        parameters.year = Number(options.filterYear);
      }

      if (options.filterYearFrom || options.filterYearTo) {
        if (options.filterYearFrom && options.filterYearTo) {
          parameters.year = JSON.parse(`{"gte": ${Number(options.filterYearFrom)}, "lte": ${Number(options.filterYearTo)} }`);
        } else if (options.filterYearFrom) {
          parameters.year = JSON.parse(`{"gte": ${Number(options.filterYearFrom)} }`);
        } else if (options.filterYearTo) {
          parameters.year = JSON.parse(`{"lte": ${Number(options.filterYearTo)} }`);
        }
      }

      if (options.filterNameLocalCulture) {
        parameters.local = JSON.parse(`{ "name_local_culture": { "contains": "${options.filterNameLocalCulture}" } }`);
      }

      if (options.filterLabel) {
        parameters.local = JSON.parse(`{ "label": { "contains": "${options.filterLabel}" } }`);
      }

      if (options.filterMloc) {
        parameters.local = JSON.parse(`{ "mloc": { "contains": "${options.filterMloc}" } }`);
      }

      if (options.filterAdress) {
        parameters.local = JSON.parse(`{ "adress": {"contains": "${options.filterAdress}" } }`);
      }

      if (options.filterLabelCountry) {
        parameters.local = JSON.parse(`{ "label_country": {"contains": "${options.filterLabelCountry}" } }`);
      }

      if (options.filterLabelRegion) {
        parameters.local = JSON.parse(`{ "label_region": {"contains": "${options.filterLabelRegion}" } }`);
      }

      if (options.filterNameLocality) {
        parameters.local = JSON.parse(`{ "name_locality": {"contains": "${options.filterNameLocality}" } }`);
      }

      const select = {
        id: true,
        id_unity_culture: true,
        id_local: true,
        name_unity_culture: true,
        year: true,
        local: true,
        dt_export: true,
      };

      if (options.id_safra) {
        const { response }: any = await this.safraController.getOne(Number(options.id_safra));
        parameters.year = response.year;
      }

      if (options.id_unity_culture) {
        parameters.id_unity_culture = options.id_unity_culture;
      }

      if (options.name_unity_culture) {
        parameters.name_unity_culture = options.name_unity_culture;
      }

      if (options.id_local) {
        parameters.id_local = Number(options.id_local);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        if (!options.excel) {
          if (typeof options.orderBy !== 'string') {
            if (options.orderBy[1] == '' || !options.orderBy[1]) {
              orderBy = [`{"${options.orderBy[0]}":"${options.typeOrder[0]}"}`, `{"${options.orderBy[1]}":"${options.typeOrder[1]}"}`];
            } else {
              orderBy = handleOrderForeign(options.orderBy[1], options.typeOrder[1]);
              orderBy = orderBy || `{"${options.orderBy[1]}":"${options.typeOrder[1]}"}`;
            }
          } else {
            orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
            orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
          }
        }
      }

      const response: object | any = await this.unidadeCulturaRepository.findAll(
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
      handleError('Unidade cultura controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Unidade Cultura erro');
    }
  }

  async getOne({ id }: any) {
    try {
      const response = await this.unidadeCulturaRepository.findById(id);

      if (!response) throw new Error('Unidade de cultura não encontrada');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Unidade cultura controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Unidade Cultura erro');
    }
  }

  async create(data: any) {
    try {
      const unidadeCulturaAlreadyExist = await this.unidadeCulturaRepository.findByName(data);

      if (unidadeCulturaAlreadyExist) return { status: 409, message: 'Dados já cadastrados' };

      await this.unidadeCulturaRepository.create(data);

      return { status: 200, message: 'Unidade de cultura cadastrada' };
    } catch (error: any) {
      handleError('Unidade cultura controller', 'Create', error.message);
      throw new Error('[Controller] - Create Unidade Cultura erro');
    }
  }

  async update(data: any) {
    try {
      const unidadeCultura: any = await this.unidadeCulturaRepository.findById(data.id);

      if (!unidadeCultura) return { status: 400, message: 'Unidade de cultura não existente' };

      await this.unidadeCulturaRepository.update(data.id, data);

      return { status: 200, message: 'Unidade de cultura atualizado' };
    } catch (error: any) {
      handleError('Unidade cultura controller', 'Update', error.message);
      throw new Error('[Controller] - Update Unidade Cultura erro');
    }
  }

  async delete(data: any) {
    try {
      const { status }: any = await this.getOne({ id: Number(data.id) });

      if (status !== 200) return { status: 400, message: 'Unidade de cultura não encontrada' };

      await this.unidadeCulturaRepository.delete(Number(data.id));
      return { status: 200, message: 'Unidade de cultura excluída' };
    } catch (error: any) {
      handleError('Unidade de cultura controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete Unidade de cultura erro');
    }
  }
}
