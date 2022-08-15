/* eslint-disable camelcase */
import handleError from '../shared/utils/handleError';
import { TypeAssayRepository } from '../repository/tipo-ensaio.repository';

export class TypeAssayController {
  typeAssayRepository = new TypeAssayRepository();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterName) {
        parameters.name = JSON.parse(`{"contains":"${options.filterName}"}`);
      }

      if (options.filterProtocolName) {
        parameters.protocol_name = JSON.parse(`{"contains":"${options.filterProtocolName}"}`);
      }

      const select = {
        id: true,
        name: true,
        protocol_name: true,
        envelope: true,
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

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

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
      const response = await this.typeAssayRepository.findOneByData(data, 1);
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
      const assayTypeAlreadyExist = await this.getByData(data);
      if (assayTypeAlreadyExist.status === 200) return { status: 404, message: 'Tipo de ensaio já existe' };
      const response = await this.typeAssayRepository.create(data);
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
      if (data.status === 0 || data.status === 1) {
        const assayTypeAlreadyExist = await this.getOne(data.id);
        if (assayTypeAlreadyExist.status !== 200) return { status: 400, message: 'Tipo de ensaio não encontrado' };
        const response = await this.typeAssayRepository.update(data.id, data);
        if (!response) {
          return { status: 400, response: [], message: 'Tipo de ensaio não atualizado' };
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
