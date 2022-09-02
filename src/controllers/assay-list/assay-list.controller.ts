import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { AssayListRepository } from '../../repository/assay-list.repository';
import { GenotypeTreatmentController } from '../genotype-treatment/genotype-treatment.controller';
import { functionsUtils } from '../../shared/utils/functionsUtils';

export class AssayListController {
  assayListRepository = new AssayListRepository();

  genotypeTreatmentController = new GenotypeTreatmentController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    try {
      if (options.filterProtocol) {
        parameters.protocol_name = JSON.parse(`{"contains":"${options.filterProtocol}"}`);
      }
      if (options.filterFoco) {
        parameters.foco = JSON.parse(`{ "name": { "contains": "${options.filterFoco}" } }`);
      }
      if (options.filterTypeAssay) {
        parameters.type_assay = JSON.parse(`{ "name": { "contains": "${options.filterTypeAssay}" } }`);
      }
      if (options.filterTechnology) {
        parameters.tecnologia = JSON.parse(`{ "name": {"contains": "${options.filterTechnology}" } }`);
      }
      if (options.filterCod) {
        parameters.tecnologia = JSON.parse(`{ "cod_tec": {"contains": "${options.filterCod}" } }`);
      }
      if (options.filterGenotipo) {
        parameters.AND.push(JSON.parse(`{ "genotipo": {"name_genotipo": {"contains": "${options.filterGenotipo}" } } }`));
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
      if (options.filterStatusAssay) {
        parameters.status = JSON.parse(`{ "contains": "${options.filterStatusAssay}" }`);
      }
      /*
      if (options.filterTratFrom || options.filterTratTo) {
        if (options.filterTratFrom && options.filterTratTo) {
          parameters.project = JSON.parse(`{"gte": "${Number(options.filterTratFrom)}", "lte": "${Number(options.filterTratTo)}" }`);
        } else if (options.filterTratFrom) {
          parameters.peso = JSON.parse(`{"gte": "${Number(options.filterTratFrom)}" }`);
        } else if (options.filterTratTo) {
          parameters.peso = JSON.parse(`{"lte": "${Number(options.filterTratTo)}" }`);
        }
      }
      */

      const select = {
        id: true,
        id_safra: true,
        protocol_name: true,
        foco: { select: { name: true } },
        type_assay: { select: { name: true } },
        tecnologia: { select: { name: true, cod_tec: true } },
        genotype_treatment: true,
        treatmentsNumber: true,
        gli: true,
        bgm: true,
        status: true,
        project: true,
        comments: true,
        experiment: true,
        period: true,
      };

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.gli) {
        parameters.gli = options.gli;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.assayListRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((item: any) => {
        const newItem = item;
        newItem.countNT = functionsUtils
          .countChildrenForSafra(item.genotype_treatment, Number(options.id_safra));
        return newItem;
      });

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Lista de ensaio controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Lista de ensaio erro');
    }
  }

  async getOne(id: number) {
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

      if (assayListAlreadyExist) return { status: 400, message: 'Lista de ensaio já cadastrados' };

      const response = await this.assayListRepository.create(data);

      return { status: 200, response, message: 'Lista de ensaio cadastrada' };
    } catch (error: any) {
      handleError('Lista de ensaio controller', 'Create', error.message);
      throw new Error('[Controller] - Create Lista de ensaio erro');
    }
  }

  async update(data: any) {
    try {
      const assayList: any = await this.assayListRepository.findById(data.id);

      if (!assayList) return { status: 404, message: 'Lista de ensaio não existente' };

      const response = await this.assayListRepository.update(Number(data.id), data);

      return { status: 200, response, message: 'Lista de ensaio atualizado' };
    } catch (error: any) {
      handleError('Lista de ensaio controller', 'Update', error.message);
      throw new Error('[Controller] - Update Lista de ensaio erro');
    }
  }

  async delete(id: number) {
    try {
      const { status: statusAssay, response } = await this.getOne(Number(id));

      if (statusAssay !== 200) return { status: 400, message: 'Lista de ensaio não encontrada' };
      if (response?.status === 'UTILIZADO') return { status: 400, message: 'Ensaio já relacionado com um experimento ' };

      const { status } = await this.genotypeTreatmentController.deleteAll(id);

      if (status === 200) {
        await this.assayListRepository.delete(Number(id));
        return { status: 200, message: 'Lista de ensaio excluída' };
      }
      return { status: 400, message: 'Lista de ensaio não excluída' };
    } catch (error: any) {
      handleError('Lista de ensaio controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete Lista de ensaio erro');
    }
  }
}
