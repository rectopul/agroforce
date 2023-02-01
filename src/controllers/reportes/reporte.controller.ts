/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { ReporteRepository } from '../../repository/reporte.repository';

export class ReporteController {
  reporteRepository = new ReporteRepository();

  async getOne(id: number) {
    try {
      const response = await this.reporteRepository.findOne(id);

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
    userId, operation, module, oldValue, ip,
  }: any) {
    try {
      oldValue = String(oldValue);
      const data = {
        module,
        userId,
        operation,
        oldValue,
        ip,
      };
      await this.reporteRepository.create(data);
    } catch (error: any) {
      handleError('Histórico de impressão Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Histórico de impressão erro');
    }
  }

  async update(data: any) {
    try {
      const history = await this.reporteRepository.findOne(data.id);

      if (!history) return { status: 404, message: 'Histórico de impressão não existente' };

      const response = await this.reporteRepository.update(data.id, data);
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
    console.log('🚀 ~ file: reporte.controller.ts:64 ~ ReporteController ~ getAll ~ options', options);
    const parameters: object | any = {};
    parameters.AND = [];
    parameters.OR = [];
    let orderBy: object | any = '';
    try {
      const select = {
        madeIn: true,
        module: true,
        operation: true,
        oldValue: true,
        user: true,
      };

      if (options.filterOperation) {
        const statusParams = options.filterOperation?.split(',');
        parameters.OR.push(JSON.parse(`{"operation": {"equals": "${statusParams[0]}" } }`));
        parameters.OR.push(JSON.parse(`{"operation": {"equals": "${statusParams[1]}" } }`));
        parameters.OR.push(JSON.parse(`{"operation": {"equals": "${statusParams[2]}" } }`));
        parameters.OR.push(JSON.parse(`{"operation": {"equals": "${statusParams[3]}" } }`));
        parameters.OR.push(JSON.parse(`{"operation": {"equals": "${statusParams[4]}" } }`));
        parameters.OR.push(JSON.parse(`{"operation": {"equals": "${statusParams[5]}" } }`));
        parameters.OR.push(JSON.parse(`{"operation": {"equals": "${statusParams[6]}" } }`));
      }

      if (options.filterMadeBy) {
        parameters.user = JSON.parse(`{ "name": { "contains":"${options.filterMadeBy}" } }`);
      }

      if (options.filterModule) {
        parameters.module = JSON.parse(`{ "contains":"${options.filterModule}" }`);
      }

      if (options.filterValue) {
        parameters.oldValue = JSON.parse(`{ "contains":"${options.filterValue}" }`);
      }

      if (options.filterStartDate || options.filterEndDate) {
        if (options.filterStartDate && options.filterEndDate) {
          parameters.AND.push({ madeIn: { gte: new Date(`${options.filterStartDate}T00:00:00.000z`), lte: new Date(`${options.filterEndDate}T23:59:59.999z`) } });
        } else if (options.filterStartDate) {
          parameters.AND.push({ madeIn: { gte: new Date(`${options.filterStartDate}T00:00:00.000z`) } });
        } else if (options.filterEndDate) {
          parameters.AND.push({ madeIn: { lte: new Date(`${options.filterEndDate}T23:59:59.999z`) } });
        }
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

      const response: object | any = await this.reporteRepository.findAll(
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
}
