/* eslint-disable camelcase */
import handleError from '../shared/utils/handleError';
import { TypeAssayRepository } from '../repository/tipo-ensaio.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';
import createXls from 'src/helpers/api/xlsx-global-download';

export class TypeAssayController {
  typeAssayRepository = new TypeAssayRepository();

  reporteRepository = new ReporteRepository();

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
        envelope: {
          select: {
            seeds: true,
            id_safra: true,
            safra: true,
          },
        },
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

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response = await this.typeAssayRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((item: any) => {
        item.envelope.map((envelope: any) => {
          if (envelope.id_safra === Number(options.id_safra)) {
            item.envelope = envelope;
          }
        });
      });
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

      await this.reporteRepository.create({
        madeBy: response.created_by, module: 'Tipo de Ensaio', operation: 'Cadastro', name: response.name, ip: JSON.stringify(ip), idOperation: response.id,
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
      if (data) {
        const assayTypeAlreadyExist = await this.getOne(data.id);
        if (assayTypeAlreadyExist.status !== 200) return { status: 400, message: 'Tipo de ensaio não encontrado' };
        const response = await this.typeAssayRepository.update(data.id, data);
        if (!response) {
          return { status: 400, response: [], message: 'Tipo de ensaio não atualizado' };
        }
        if (response.status === 1) {
          await this.reporteRepository.create({
            madeBy: response.created_by, module: 'Tipo de Ensaio', operation: 'Edição', name: response.name, ip: JSON.stringify(ip), idOperation: response.id,
          });
        }
        if (response.status === 0) {
          await this.reporteRepository.create({
            madeBy: response.created_by, module: 'Tipo de Ensaio', operation: 'Inativação', name: response.name, ip: JSON.stringify(ip), idOperation: response.id,
          });
        }
        return { status: 200, response };
      }
      const assayTypeAlreadyExist = await this.getByData(data);
      if (assayTypeAlreadyExist.status === 200) return { status: 400, message: 'Tipo de ensaio já registrado' };
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
