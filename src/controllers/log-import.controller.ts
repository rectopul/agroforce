import handleError from 'src/shared/utils/handleError';
import { number, object, SchemaOf, string } from 'yup';
import { LogImportRepository } from '../repository/log-import.repository';
import { functionsUtils } from 'src/shared/utils/functionsUtils';

export class LogImportController {
  public readonly required = 'Campo obrigatório';

  logImportRepository = new LogImportRepository();

  async getOne({ id }: any) {
    try {
      const response = await this.logImportRepository.findById(id);

      if (!response) throw new Error('Grupo não encontrado');

      return { status: 200, response };

    } catch (error: any) {
      handleError('Grupo controller', 'GetOne', error.message)
      throw new Error("[Controller] - GetOne Grupo erro")
    }
  }

  async create(data: any) {
    try {
      const schema: SchemaOf<any> = object({
        user_id: number().required(this.required),
        table: string().required(this.required),
        status: number().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: 'Dados inválidos' };

      switch (data.table) {
        case 'tecnologia':

          break;
        case 'local':
          break;
        case 'genotipo':

          break;
        default:
          return {
            status: 400, message: "A primeira coluna da planilha precisa ser a tabela que está sendo feito a importação!"
          };
          break;
      }

      const LogsAlreadyExists = await this.logImportRepository.validateImportInExecuting(data);

      if (LogsAlreadyExists) return { status: 400, message: 'Importação já está sendo executada' };

      await this.logImportRepository.create(data);

      return { status: 201, message: 'grupo cadastrado' };
    } catch (error: any) {
      handleError('Grupo controller', 'Create', error.message)
      throw new Error("[Controller] - Create Grupo erro")
    }
  }

  async update(data: any) {
    try {
      const schema: SchemaOf<any> = object({
        id: number().required(this.required),
        id_safra: number().required(this.required),
        id_foco: number().required(this.required),
        group: number().required(this.required),
        created_by: number().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: 'Dados inválidos' };

      const group: any = await this.logImportRepository.findById(data.id);

      if (!group) return { status: 400, message: 'grupo não existente' };

      await this.logImportRepository.update(data.id, data);

      return { status: 200, message: 'grupo atualizado' };
    } catch (error: any) {
      handleError('Grupo controller', 'Update', error.message)
      throw new Error("[Controller] - Update Grupo erro")
    }
  }

  async listAll(options: any) {
    const parameters: object | any = {};
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus != 2)
          parameters.status = Number(options.filterStatus);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = Object.assign({}, select);
      } else {
        select = {
          id: true,
          user_id: true,
          table: true,
          status: true,
          created_at: true
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
        orderBy
      );

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      } else {
        response.map((item: any) => {
          item.created_at = functionsUtils.formatDate(item.created_at);
        });
        return { status: 200, response, total: response.total };
      }
    } catch (error: any) {
      handleError('Log Import controller', 'GetAll', error.message)
      throw new Error("[Controller] - GetAll Log Import erro")
    }
  }
}
