/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { PrintHistoryRepository } from '../../repository/print-history.repository';

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

  async create({
    userId, operation, module, oldValue,
  }: any) {
    try {
      const data = {
        module,
        userId,
        operation,
        oldValue,
      };
      await this.printHistoryRepository.create(data);
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
    parameters.AND = [];
    parameters.OR = [];
    let orderBy: object | any = '';
    try {
      const select = {
        id: true,
        experimentGenotypeId: true,
        status: true,
        userId: true,
        modulo: true,
        createdAt: true,
        user: true,
        experiment_genotipe: true,
      };

      if (options.filterOperation) {
        const statusParams = options.filterOperation?.split(',');
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[0]}" } }`));
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[1]}" } }`));
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[2]}" } }`));
      }

      if (options.filterMadeBy) {
        parameters.user = JSON.parse(`{ "name": { "contains":"${options.filterMadeBy}" } }`);
      }

      if (options.filterStartDate || options.filterEndDate) {
        if (options.filterStartDate && options.filterEndDate) {
          parameters.AND.push({ createdAt: { gte: new Date(`${options.filterStartDate}T00:00:00.000z`), lte: new Date(`${options.filterEndDate}T23:59:59.999z`) } });
        } else if (options.filterStartDate) {
          parameters.AND.push({ createdAt: { gte: new Date(`${options.filterStartDate}T00:00:00.000z`) } });
        } else if (options.filterEndDate) {
          parameters.AND.push({ createdAt: { lte: new Date(`${options.filterEndDate}T23:59:59.999z`) } });
        }
      }

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

      if (parameters.OR.length === 0) {
        delete parameters.OR;
      }

      if (parameters.AND.length === 0) {
        delete parameters.AND;
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
