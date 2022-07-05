import handleError from '../shared/utils/handleError';
import handleOrderForeigin from '../shared/utils/handleOrderForeigin';
import { AssayListRepository } from '../repository/assay-list.repository';

export class AssayListController {
  assayListRepository = new AssayListRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.filterFoco) {
        parameters.foco = JSON.parse(`{ "name": { "contains": "${options.filterFoco}" } }`);
      }

      if (options.filterTypeAssay) {
        parameters.type_assay = JSON.parse(`{ "name": { "contains": "${options.filterTypeAssay}" } }`);
      }

      if (options.filterTechnology) {
        parameters.tecnologia = JSON.parse(`{ "name": {"contains": "${options.filterTechnology}" } }`);
      }

      if (options.filterGli) {
        parameters.gli = JSON.parse(`{"contains": "${options.filterGli}" }`);
      }

      if (options.filterPeriod) {
        parameters.period = JSON.parse(`{ "contains": "${options.filterPeriod}" }`);
      }

      if (options.filterBgm) {
        parameters.bgm = JSON.parse(`{ "contains": "${options.filterBgm}" }`);
      }

      if (options.filterProject) {
        parameters.project = JSON.parse(`{ "contains": "${options.filterProject}" }`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          id_safra: true,
          foco: { select: { name: true } },
          type_assay: { select: { name: true } },
          tecnologia: { select: { name: true } },
          gli: true,
          period: true,
          protocol_name: true,
          bgm: true,
          project: true,
          status: true,
        };
      }

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeigin(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }
      const response: object | any = await this.assayListRepository.findAll(
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
      handleError('Lista de ensaio controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Lista de ensaio erro');
    }
  }

  async getOne({ id }: any) {
    try {
      const response = await this.assayListRepository.findById(id);

      if (!response) throw new Error('Lista de ensaio não encontrada');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Lista de ensaio controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Lista de ensaio erro');
    }
  }

  async create(data: any) {
    try {
      const assayListAlreadyExist = await this.assayListRepository.findByName(data);

      if (assayListAlreadyExist) return { status: 409, message: 'Lista de ensaio já cadastrados' };

      await this.assayListRepository.create(data);

      return { status: 201, message: 'Lista de ensaio cadastrada' };
    } catch (error: any) {
      handleError('Lista de ensaio controller', 'Create', error.message);
      throw new Error('[Controller] - Create Lista de ensaio erro');
    }
  }

  async update(data: any) {
    try {
      const assayList: any = await this.assayListRepository.findById(data.id);

      if (!assayList) return { status: 404, message: 'Lista de ensaio não existente' };

      await this.assayListRepository.update(data.id, data);

      return { status: 200, message: 'Lista de ensaio atualizado' };
    } catch (error: any) {
      handleError('Lista de ensaio controller', 'Update', error.message);
      throw new Error('[Controller] - Update Lista de ensaio erro');
    }
  }

  async delete(id: any) {
    return { status: 500 };
  }
}
