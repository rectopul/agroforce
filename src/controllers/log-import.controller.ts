import handleError from '../shared/utils/handleError';
import { functionsUtils } from '../shared/utils/functionsUtils';
import { LogImportRepository } from '../repository/log-import.repository';
import handleOrderForeign from '../shared/utils/handleOrderForeign';

export class LogImportController {
  public readonly required = 'Campo obrigatório';

  logImportRepository = new LogImportRepository();

  async getOne(id: number) {
    try {
      const response = await this.logImportRepository.findById(Number(id));

      if (!response) return { status: 400, response, message: 'Log Import não encontrado' };

      return { status: 200, response };
    } catch (error: any) {
      handleError('Log Import controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Log Import erro');
    }
  }

  async create(data: any) {
    
    try {
      const LogsAlreadyExists = await this.logImportRepository.validateImportInExecuting();

      if (LogsAlreadyExists) return { status: 400, message: 'Importação já está sendo executada' };

      const response = await this.logImportRepository.create(data);

      return { status: 200, response, message: 'Log Import cadastrado' };
    } catch (error: any) {
      handleError('Log Import controller', 'Create', error.message);
      throw new Error('[Controller] - Create Log Import erro');
    }
  }

  async update(data: any) {
    try {
      const logImport: any = await this.getOne(data.id);

      if (!logImport) return { status: 400, message: 'Log não existe' };
      if (logImport.response.state === 'FALHA') {
        return { status: 200, logImport };
      }

      await this.logImportRepository.update(data.id, data);

      return { status: 200, message: 'Log atualizado' };
    } catch (error: any) {
      handleError('LogImport controller', 'Update', error.message);
      throw new Error('[Controller] - Update LogImport erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    parameters.AND = [];
    let orderBy: string;
    try {
      if (options.filterUser) {
        parameters.user = JSON.parse(`{"name": {"contains":"${options.filterUser}"} }`);
      }

      if (options.filterTable) {
        parameters.table = JSON.parse(`{"contains":"${options.filterTable}"}`);
      }

      if (options.filterState) {
        parameters.state = JSON.parse(`{"contains":"${options.filterState}"}`);
      }

      if (options.filterStartDate) {
        const newStartDate = new Date(options.filterStartDate);
        parameters.AND.push({ created_at: { gte: newStartDate } });
      }

      if (options.filterEndDate) {
        const newEndDate = new Date(options.filterEndDate);
        parameters.AND.push({ created_at: { lte: newEndDate } });
      }

      const select = {
        id: true,
        user: { select: { name: true } },
        table: true,
        state: true,
        status: true,
        created_at: true,
      };

      if (options.status) {
        parameters.status = Number(options.status);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      } else {
        orderBy = '{ "id": "desc" }';
      }

      const response: object | any = await this.logImportRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      response.map((item: any) => {
        const newItem = item;
        newItem.created_at = functionsUtils.formatDate(item.created_at);
        return newItem;
      });
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Log Import controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Log Import erro');
    }
  }
}
