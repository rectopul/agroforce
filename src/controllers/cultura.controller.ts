/* eslint-disable camelcase */
import {
  number, object, SchemaOf, string,
} from 'yup';
import { CulturaRepository } from '../repository/culture.repository';
import handleError from '../shared/utils/handleError';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';
import createXls from '../helpers/api/xlsx-global-download';
import { ReporteController } from './reportes/reporte.controller';

interface CultureDTO {
  id: number;
  name: string;
  desc: string;
  created_by: number;
  status: number;
}

type CreateCultureDTO = Omit<CultureDTO, ''>;
type UpdateCultureDTO = Omit<CultureDTO, ''>;
type FindOne = Omit<CultureDTO, 'name' | 'created_by' | 'status'>;

export class CulturaController {
  public readonly required = 'Campo obrigatório';

  culturaRepository = new CulturaRepository();

  reporteController = new ReporteController();

  async getAllCulture(options: any) {
    options = await removeEspecialAndSpace(options);
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      if (options.createFile) {
        const sheet = await createXls(options, 'TMG-CULTURA');
        return { status: 200, response: sheet };
      }

      if (options.filterStatus) {
        if (options.filterStatus !== '2') { parameters.status = Number(options.filterStatus); }
      }

      if (options.filterSearch) {
        parameters.desc = JSON.parse(`{"contains":"${options.filterSearch}"}`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item: any) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          name: true,
          desc: true,
          status: true,
        };
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.desc) {
        parameters.desc = options.desc;
      }

      if (options.take) {
        if (typeof options.take === 'string') {
          take = Number(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof options.skip === 'string') {
          skip = Number(options.skip);
        } else {
          skip = options.skip;
        }
      }

      if (options.orderBy) {
        orderBy = `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.culturaRepository.findAll(
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
    } catch (err) {
      handleError('Culture Controller', 'GetAll', err);
      throw new Error('[Controller] - GetAll Culture erro');
      // return { status: 400, message: err };
    }
  }

  async getOneFoco(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.culturaRepository.findOne(id);

      if (!response) throw new Error('Dados inválidos');

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Item não encontrado' };
    }
  }

  async getOneCulture(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.culturaRepository.findOne(id);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Item não encontrada' };
    }
  }

  async postCulture(data: CreateCultureDTO) {
    try {
      const cultureAlreadyExists = await this.culturaRepository.findByName(
        data.name,
      );

      if (cultureAlreadyExists) {
        return { status: 400, message: 'Cultura ja cadastrado, favor checar registros inativos.' };
      }
      const culture = await this.culturaRepository.create(data);

      const { ip } = await fetch('https://api.ipify.org/?format=json')
        .then((results) => results.json())
        .catch(() => '0.0.0.0');
      await this.reporteController.create({
        userId: data.created_by, module: 'CULTURA', operation: 'CRIAÇÃO', oldValue: data.name, ip: String(ip),
      });
      return { status: 200, message: 'Cultura cadastrada' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Cultura não cadastrada' };
    }
  }

  async updateCulture(data: any) {
    try {
      const culture = await this.culturaRepository.findOne(data.id);

      const { created_by } = data;
      // eslint-disable-next-line no-param-reassign
      delete data.created_by;

      if (!culture) return { status: 400, message: 'Cultura não existente' };

      const cultureAlreadyExists = await this.culturaRepository.findByName(
        data.name,
      );

      if (cultureAlreadyExists && cultureAlreadyExists.id !== culture.id) {
        return { status: 400, message: 'Cultura ja cadastrada' };
      }

      const response = await this.culturaRepository.update(data.id, data);
      if (!response) {
        return { status: 400, response: [], message: 'Tipo de ensaio não atualizado' };
      }

      const { ip } = await fetch('https://api.ipify.org/?format=json')
        .then((results) => results.json())
        .catch(() => '0.0.0.0');
      if (data.status === 1) {
        await this.reporteController.create({
          userId: created_by, module: 'CULTURA', operation: 'ATIVAÇÃO', oldValue: response.desc, ip: String(ip),
        });
      } else if (data.status === 0) {
        await this.reporteController.create({
          userId: created_by, module: 'CULTURA', operation: 'INATIVAÇÃO', oldValue: response.desc, ip: String(ip),
        });
      } else {
        await this.reporteController.create({
          userId: created_by, module: 'CULTURA', operation: 'EDIÇÃO', oldValue: data.desc, ip: String(ip),
        });
      }

      return { status: 200, message: 'Cultura atualizada' };
    } catch (err) {
      return { status: 404, message: 'Erro ao atualizar' };
    }
  }
}
