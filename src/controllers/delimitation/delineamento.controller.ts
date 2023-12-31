import createXls from 'src/helpers/api/xlsx-global-download';
import { DelineamentoRepository } from '../../repository/delineamento.repository';
import handleError from '../../shared/utils/handleError';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';
import { ReporteController } from '../reportes/reporte.controller';

export class DelineamentoController {
  Repository = new DelineamentoRepository();

  reporteController = new ReporteController();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    const equalsOrContains = options.importValidate ? 'equals' : 'contains';
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'DELINEAMENTO');
        return { status: 200, response: sheet };
      }
      if (options.filterRepetitionFrom || options.filterRepetitionTo) {
        if (options.filterRepetitionFrom && options.filterRepetitionTo) {
          parameters.repeticao = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)}, "lte": ${Number(options.filterRepetitionTo)} }`);
        } else if (options.filterRepetitionFrom) {
          parameters.repeticao = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)} }`);
        } else if (options.filterRepetitionTo) {
          parameters.repeticao = JSON.parse(`{"lte": ${Number(options.filterRepetitionTo)} }`);
        }
      }

      if (options.filterTratRepetitionFrom || options.filterTratRepetitionTo) {
        if (options.filterTratRepetitionFrom && options.filterTratRepetitionTo) {
          parameters.trat_repeticao = JSON.parse(`{"gte": ${Number(options.filterTratRepetitionFrom)}, "lte": ${Number(options.filterTratRepetitionTo)} }`);
        } else if (options.filterTratRepetitionFrom) {
          parameters.trat_repeticao = JSON.parse(`{"gte": ${Number(options.filterTratRepetitionFrom)} }`);
        } else if (options.filterTratRepetitionTo) {
          parameters.trat_repeticao = JSON.parse(`{"lte": ${Number(options.filterTratRepetitionTo)} }`);
        }
      }

      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterName) {
        parameters.name = JSON.parse(`{"${equalsOrContains}": "${options.filterName}"}`);
      }

      if (options.filterRepeat) {
        parameters.repeticao = Number(options.filterRepeat);
      }

      if (options.filterTreatment) {
        parameters.trat_repeticao = Number(options.filterTreatment);
      }

      const select = {
        id: true,
        name: true,
        culture: true,
        repeticao: true,
        trat_repeticao: true,
        status: true,
      };

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.status) {
        parameters.status = Number(options.status);
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.repeticao) {
        parameters.repeticao = options.repeticao;
      }

      if (options.trat_repeticao) {
        parameters.trat_repeticao = options.trat_repeticao;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const response = await this.Repository.findAll(parameters, select, take, skip, orderBy);
      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Delineamento controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Delineamento erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.Repository.findOne(id);
      if (!response) {
        return { status: 400, response: { error: 'local não existe' } };
      }
      return { status: 200, response };
    } catch (error: any) {
      handleError('Delineamento controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Delineamento erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.Repository.create(data);
      if (response) {
        return { status: 200, message: 'Delineamento criado', response };
      }
      return { status: 400, message: 'Erro ao criar delineamento' };
    } catch (error: any) {
      handleError('Delineamento controller', 'Create', error.message);
      throw new Error('[Controller] - Create Delineamento erro');
    }
  }

  async update(data: any) {
    try {
      if (data) {
        const delineamento = await this.Repository.update(data.id, data);
        const operation = data.status === 1 ? 'ATIVAÇÃO' : 'INATIVAÇÃO';
        if (!delineamento) return { status: 400, message: 'Delineamento não encontrado' };
        if (data.status === 1 || data.status === 0) {
          const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
          await this.reporteController.create({
            userId: data.created_by, module: 'DELINEAMENTO', operation, oldValue: delineamento.name, ip: String(ip),
          });
        }
        return { status: 200, message: 'Delineamento atualizada' };
      }
      const response = await this.Repository.update(data.id, data);
      if (response) {
        return { status: 200, message: 'Delineamento atualizado com sucesso' };
      }
      return { status: 400, message: 'Erro ao atualizar delineamento' };
    } catch (error: any) {
      handleError('Delineamento controller', 'Update', error.message);
      throw new Error('[Controller] - Update Delineamento erro');
    }
  }
}
