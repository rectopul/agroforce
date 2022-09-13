import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { ExperimentGroupRepository } from '../../repository/experiment-group.repository';
import { IExperiments } from '../../interfaces/listas/experimento/experimento.interface';
import { ExperimentController } from '../experiment/experiment.controller';

export class ExperimentGroupController {
  experimentGroupRepository = new ExperimentGroupRepository();

  experimentController = new ExperimentController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    try {
      if (options.filterExperimentGroup) {
        parameters.name = JSON.parse(`{"contains":"${options.filterExperimentGroup}"}`);
      }

      if (options.filterQuantityExperiment) {
        parameters.experimentAmount = Number(options.filterQuantityExperiment);
      }

      if (options.filterTagsToPrint) {
        parameters.tagsToPrint = Number(options.filterTagsToPrint);
      }

      if (options.filterTagsPrinted) {
        parameters.tagsPrinted = Number(options.filterTagsPrinted);
      }

      if (options.filterTotalTags) {
        parameters.totalTags = Number(options.filterTotalTags);
      }

      if (options.safraId) {
        parameters.safraId = Number(options.safraId);
      }

      const select = {
        id: true,
        name: true,
        experimentAmount: true,
        tagsToPrint: true,
        tagsPrinted: true,
        totalTags: true,
        status: true,
        experiment: true,
      };

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.experimentGroupRepository.findAll(
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
      handleError('Grupo de experimento controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Grupo de experimento erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.experimentGroupRepository.findById(id);

      if (!response) throw new Error('Grupo de experimento não encontrada');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Grupo de experimento erro');
    }
  }

  async create(data: any) {
    try {
      const assayListAlreadyExist = await this.experimentGroupRepository.findByName(
        { name: data.name, safraId: data.safraId },
      );

      if (assayListAlreadyExist) return { status: 400, message: 'Grupo de experimento já cadastrados' };

      const response = await this.experimentGroupRepository.create(data);

      return { status: 200, response, message: 'Grupo de experimento cadastrada' };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'Create', error.message);
      throw new Error('[Controller] - Create Grupo de experimento erro');
    }
  }

  async update(data: any) {
    try {
      const assayList: any = await this.experimentGroupRepository.findById(data.id);

      if (!assayList) return { status: 404, message: 'Grupo de experimento não existente' };

      const response = await this.experimentGroupRepository.update(Number(data.id), data);

      return { status: 200, response, message: 'Grupo de experimento atualizado' };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'Update', error.message);
      throw new Error('[Controller] - Update Grupo de experimento erro');
    }
  }

  async delete(id: number) {
    try {
      const { status, response } = await this.getOne(Number(id));
      response.experiment.forEach(async (item: IExperiments) => {
        await this.experimentController.update({ id: item.id, experimentGroupId: null, status: 'SORTEADO' });
      });

      if (status !== 200) return { status: 400, message: 'Grupo de experimento não encontrada' };

      await this.experimentGroupRepository.delete(Number(id));
      return { status: 200, message: 'Grupo de experimento excluída' };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete Grupo de experimento erro');
    }
  }
}
