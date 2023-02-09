/* eslint-disable camelcase */
import createXls from 'src/helpers/api/xlsx-global-download';
import handleError from '../shared/utils/handleError';
import { TypeAssayRepository } from '../repository/tipo-ensaio.repository';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';
import { ReporteController } from './reportes/reporte.controller';

const os = require('os');

export class TypeAssayController {
  typeAssayRepository = new TypeAssayRepository();

  reporteController = new ReporteController();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    parameters.AND = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'ENSAIO-TIPO_DE_ENSAIO');
        return { status: 200, response: sheet };
      }

      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterName) {
        parameters.name = JSON.parse(`{"contains":"${options.filterName}"}`);
      }

      if (options.filterSeedsFrom || options.filterSeedsTo) {
        if (options.filterSeedsFrom && options.filterSeedsTo) {
          parameters.AND.push(JSON.parse(` { "envelope": { "some" : {"seeds": { "gte": ${Number(options.filterSeedsFrom)}, "lte": ${Number(options.filterSeedsTo)} }, "id_safra": ${Number(options.id_safra)} }  } }`));
        } else if (options.filterSeedsFrom) {
          parameters.AND.push(JSON.parse(`{ "envelope": { "some" : {"seeds": { "gte": ${Number(options.filterSeedsFrom)} }, "id_safra": ${Number(options.id_safra)} } } }`));
        } else if (options.filterSeedsTo) {
          parameters.AND.push(JSON.parse(` { "envelope": { "some" : {"seeds": { "lte": ${Number(options.filterSeedsTo)} }, "id_safra": ${Number(options.id_safra)} } } }`));
        }
      }

      const select = {
        id: true,
        name: true,
        culture: true,
        protocol_name: true,
        envelope: { select: { id_safra: true, safra: true, seeds: true } },
        status: true,
      };

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.name) {
        parameters.name = options.name;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy && (options.orderBy != 'envelope.seeds' && options.orderBy != 'envelope.safra.safraName')) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      } else {
        orderBy = '{ "name": "desc"}';
      }

      const response = await this.typeAssayRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((item: any) => {
        if(item.envelope && item.envelope.length>0) { 
          item.envelope.map((envelope: any) => {
            if (envelope.id_safra === Number(options.id_safra)) {
              item.envelope = envelope;
            }
          }) 
        }else{
            let env: any = {};
            env.seeds = '';
            env.safra = {
              safraName : ''
            };
            item.envelope = env;
        }
      });

      if (options.orderBy == 'envelope.seeds' && options.typeOrder == 'asc') {
        response.sort((a: any, b: any) => b.envelope.seeds - a.envelope.seeds);
      } else if (options.orderBy == 'envelope.seeds' && options.typeOrder == 'desc') {
        response.sort((a: any, b: any) => a.envelope.seeds - b.envelope.seeds);
      }

      if(options.orderBy == 'envelope.safra.safraName' && options.typeOrder == 'asc'){
        response.sort((a: any, b: any) => b.envelope.safra.safraName - a.envelope.safra.safraName);
      }else if(options.orderBy == 'envelope.safra.safraName' && options.typeOrder == 'desc'){
        response.sort((a: any, b: any) => a.envelope.safra.safraName - b.envelope.safra.safraName);
      }

      if (!response || response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'Nenhum envelope encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Tipo de ensaio controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Tipo de ensaio erro');
    }
  }

  async getOne(id: number) {
    try {
      if (id) {
        const response = await this.typeAssayRepository.findOne(Number(id));
        if (!response) {
          return { status: 400, response: [], message: 'Tipo de ensaio não encontrado' };
        }
        return { status: 200, response };
      }
      return { status: 400, response: [], message: 'Id não informado' };
    } catch (error: any) {
      handleError('Tipo de ensaio controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Tipo de ensaio erro');
    }
  }

  async getByData(data: any) {
    try {
      const response = await this.typeAssayRepository.findOneByData(data);
      if (!response) {
        return { status: 404, response: [], message: 'Tipo de ensaio não encontrado' };
      }
      return { status: 200, response };
    } catch (error: any) {
      handleError('Tipo de ensaio controller', 'GetByName', error.message);
      throw new Error('[Controller] - GetByName Tipo de ensaio erro');
    }
  }

  async create(data: object | any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      const assayTypeAlreadyExist = await this.getByData(data);
      if (assayTypeAlreadyExist.status === 200) return { status: 404, message: 'Tipo de ensaio já existe, favor checar registros inativos.' };
      const response = await this.typeAssayRepository.create(data);

      await this.reporteController.create({
        userId: data.created_by, module: 'TIPO DE ENSAIO', operation: 'CRIAÇÃO', oldValue: data.name, ip: String(ip),
      });
      if (!response) {
        return { status: 400, response: [], message: 'Tipo de ensaio não cadastrado' };
      }

      return { status: 200, response };
    } catch (error: any) {
      handleError('Tipo de ensaio controller', 'Create', error.message);
      throw new Error('[Controller] - Create Tipo de ensaio erro');
    }
  }

  async update(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
      const { created_by } = data;
      delete data.created_by;
      if (data.status || data.status == 0) {
        const assayTypeAlreadyExist = await this.getOne(data.id);
        if (assayTypeAlreadyExist.status !== 200) return { status: 400, message: 'Tipo de ensaio não encontrado' };

        const response = await this.typeAssayRepository.update(data.id, data);
        if (!response) {
          return { status: 400, response: [], message: 'Tipo de ensaio não atualizado' };
        }
        if (response.status === 1) {
          await this.reporteController.create({
            userId: created_by, module: 'TIPO DE ENSAIO', operation: 'ATIVAÇÃO', oldValue: response.name, ip: String(ip),
          });
        }
        if (response.status === 0) {
          await this.reporteController.create({
            userId: created_by, module: 'TIPO DE ENSAIO', operation: 'INATIVAÇÃO', oldValue: response.name, ip: String(ip),
          });
        }
        return { status: 200, response };
      }
      const assayTypeAlreadyExist = await this.getByData(data);
      if (assayTypeAlreadyExist.status === 200) return { status: 400, message: 'Tipo de ensaio já registrado' };
      await this.reporteController.create({
        userId: created_by, module: 'TIPO DE ENSAIO', operation: 'EDIÇÃO', oldValue: data.name, ip: String(ip),
      });
      const response = await this.typeAssayRepository.update(data.id, data);
      if (!response) {
        return { status: 400, response: [], message: 'Tipo de ensaio não atualizado' };
      }
      return { status: 200, response };
    } catch (error: any) {
      handleError('Tipo de ensaio controller', 'Update', error.message);
      throw new Error('[Controller] - Update Tipo de ensaio erro');
    }
  }
}
