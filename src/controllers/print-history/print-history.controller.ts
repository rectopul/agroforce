import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { PrintHistoryRepository } from '../../repository/print-history.repository';
import { IReturnObject } from '../../interfaces/shared/Import.interface';
import { ExperimentGenotipeController } from '../experiment-genotipe.controller';

export class PrintHistoryController {
  printHistoryRepository = new PrintHistoryRepository();

  async getOne(id: number) {
    try {
      const response = await this.printHistoryRepository.findById(id);

      if (response) {
        return { status: 200, response };
      }
      return { status: 404, response: [], message: 'Histórico de impressão não encontrado' };
    } catch (error: any) {
      handleError('Histórico de impressão Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Histórico de impressão erro');
    }
  }

  async create({ idList, userId }: any) {
    try {
      const experimentGenotipeController = new ExperimentGenotipeController();

      idList.map(async (id: number) => {
        const { response }: IReturnObject = await this.getAll({ experimentGenotypeId: id });
        const {
          response: parcela,
        }: IReturnObject = await experimentGenotipeController.getOne(id);
        const changes = response?.length || 0;
        await this.printHistoryRepository.create({
          experimentGenotypeId: id,
          changes,
          status: parcela?.status,
          userId,
        });
      });
    } catch (error: any) {
      handleError('Histórico de impressão Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Histórico de impressão erro');
    }
  }

  async update(data: any) {
    try {
      const history = await this.printHistoryRepository.findById(data.id);

      if (!history) return { status: 404, message: 'Histórico de impressão não existente' };

      const response = await this.printHistoryRepository.update(data.id, data);
      if (response) {
        return { status: 200, response, message: 'Histórico de impressão atualizado' };
      }
      return { status: 400, message: 'Histórico de impressão não atualizado' };
    } catch (error: any) {
      handleError('Histórico de impressão Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Histórico de impressão erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any = '';
    try {
      const select = {
        id: true,
        experimentGenotypeId: true,
        status: true,
        userId: true,
        changedAt: true,
      };

      if (options.id) {
        parameters.id = Number(options.id);
      }

      if (options.experimentGenotypeId) {
        parameters.experimentGenotypeId = Number(options.experimentGenotypeId);
      }

      if (options.status) {
        parameters.status = JSON.parse(`{ "contains":"${options.status}" }`);
      }

      if (options.user) {
        parameters.user = JSON.parse(`{ "name": { "contains":"${options.user}" } }`);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.printHistoryRepository.findAll(
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
      handleError('Histórico de impressão Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Histórico de impressão erro');
    }
  }

  async deleteAll(idList: any) {
    try {
      const response = await this.printHistoryRepository.deleteMany(idList);
      if (response) {
        return { status: 200 };
      }
      return { status: 400 };
    } catch (error: any) {
      handleError('Histórico de impressão Controller', 'DeleteAll', error.message);
      throw new Error('[Controller] - DeleteAll Histórico de impressão erro');
    }
  }
}
