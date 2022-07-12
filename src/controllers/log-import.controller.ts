import handleError from 'src/shared/utils/handleError';
import {
  number, object, SchemaOf, string,
} from 'yup';
import { functionsUtils } from 'src/shared/utils/functionsUtils';
import { LogImportRepository } from '../repository/log-import.repository';

export class LogImportController {
  public readonly required = 'Campo obrigatório';

  logImportRepository = new LogImportRepository();

  async getOne({ id }: any) {
    try {
      const response = await this.logImportRepository.findById(id);

      if (!response) throw new Error('Grupo não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Grupo controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Grupo erro');
    }
  }

  async create(data: any) {
    try {
      const LogsAlreadyExists = await this.logImportRepository.validateImportInExecuting(data);

      if (LogsAlreadyExists) return { status: 400, message: 'Importação já está sendo executada' };

      const response = await this.logImportRepository.create(data);

      return { status: 201, response, message: 'grupo cadastrado' };
    } catch (error: any) {
      handleError('Grupo controller', 'Create', error.message);
      throw new Error('[Controller] - Create Grupo erro');
    }
  }

  async update({ id, status }: any) {
    try {
      const logImport: any = await this.logImportRepository.findById(id);

      if (!logImport) return { status: 400, message: 'Log não exsite' };

      await this.logImportRepository.update(id, status);

      return { status: 200, message: 'Log atualizado' };
    } catch (error: any) {
      handleError('LogImport controller', 'Update', error.message);
      throw new Error('[Controller] - Update LogImport erro');
    }
  }

  async listAll(options: any) {
    const parameters: object | any = {};
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
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
          user_id: true,
          table: true,
          status: true,
          created_at: true,
        };
      }

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.id_foco) {
        parameters.id_foco = Number(options.id_foco);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

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
        item.created_at = functionsUtils.formatDate(item.created_at);
      });
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Log Import controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Log Import erro');
    }
  }
}
