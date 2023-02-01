import createXls from 'src/helpers/api/xlsx-global-download';
import handleError from '../shared/utils/handleError';
import { functionsUtils } from '../shared/utils/functionsUtils';
import { LogImportRepository } from '../repository/log-import.repository';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';

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
    console.log('🚀 ~ file: log-import.controller.ts:42 ~ LogImportController ~ update ~ data', data);
    try {
      if (data.reset) {
        const response = await this.logImportRepository.reset();

        if (response) {
          return { status: 200, message: 'Reset realizado' };
        }
        return { status: 400, message: 'Falha ao realizar reset' };
      }
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
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'RD');
        return { status: 200, response: sheet };
      }
      if (options.filterUser) {
        parameters.user = JSON.parse(`{"name": {"contains":"${options.filterUser}"} }`);
      }

      if (options.filterTable) {
        parameters.table = JSON.parse(`{"contains":"${options.filterTable}"}`);
      }

      if (options.filterState) {
        parameters.state = JSON.parse(`{"contains":"${options.filterState}"}`);
      }

      if (options.filterStartDate || options.filterEndDate) {
        if (options.filterStartDate && options.filterEndDate) {
          parameters.AND.push({ created_at: { gte: new Date(`${options.filterStartDate}T00:00:00.000z`), lte: new Date(`${options.filterEndDate}T23:59:59.999z`) } });
        } else if (options.filterStartDate) {
          parameters.AND.push({ created_at: { gte: new Date(`${options.filterStartDate}T00:00:00.000z`) } });
        } else if (options.filterEndDate) {
          parameters.AND.push({ created_at: { lte: new Date(`${options.filterEndDate}T23:59:59.999z`) } });
        }
      }

      if (options.filterStartFinishDate || options.filterEndFinishDate) {
        if (options.filterStartFinishDate && options.filterEndFinishDate) {
          parameters.AND.push({ created_at: { gte: new Date(`${options.filterStartFinishDate}T00:00:00.000z`), lte: new Date(`${options.filterEndFinishDate}T23:59:59.999z`) } });
        } else if (options.filterStartFinishDate) {
          parameters.AND.push({ created_at: { gte: new Date(`${options.filterStartFinishDate}T00:00:00.000z`) } });
        } else if (options.filterEndFinishDate) {
          parameters.AND.push({ created_at: { lte: new Date(`${options.filterEndFinishDate}T23:59:59.999z`) } });
        }
      }

      const select = {
        id: true,
        user: { select: { name: true } },
        table: true,
        state: true,
        safra: {
          select: {
            culture: true,
            safraName: true,
          },
        },
        status: true,
        invalid_data: true,
        created_at: true,
        updated_at: true,
        filePath: true,
      };

      if (options.idSafra) {
        parameters.idSafra = Number(options.idSafra);
      }

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
        newItem.updated_at = newItem.updated_at ? functionsUtils.formatDate(item.updated_at) : null;
        return newItem;
      });
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Log Import controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Log Import erro');
    }
  }
}
