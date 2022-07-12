import handleError from 'src/shared/utils/handleError';
import { TecnologiaRepository } from '../repository/tecnologia.repository';

export class TecnologiaController {
  tecnologiaRepository = new TecnologiaRepository();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
      }

      if (options.filterName) {
        parameters.name = JSON.parse(`{ "contains":"${options.filterName}" }`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true, name: true, desc: true, cod_tec: true, status: true,
        };
      }

      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.cod_tec) {
        parameters.cod_tec = options.cod_tec;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const response = await this.tecnologiaRepository.findAll(parameters, select, take, skip, orderBy);
      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Tecnologia controller', 'getAll', error.message);
      throw new Error('[Controller] - getAll Tecnologia erro');
    }
  }

  async getOne(id: number) {
    try {
      if (id) {
        const response = await this.tecnologiaRepository.findOne(id);
        if (response) {
          return { status: 200, response };
        }
        return { status: 404, response: { error: 'Tecnologia não encontrada' } };
      }
      return { status: 405, response: { error: 'ID indefinido' } };
    } catch (error: any) {
      handleError('Tecnologia controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Tecnologia erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.tecnologiaRepository.create(data);
      if (response) {
        return { status: 201, message: 'Tecnologia cadastrada' };
      }
      return { status: 400, message: 'Erro ao cadastrar tecnologia' };
    } catch (error: any) {
      handleError('Tecnologia controller', 'Create', error.message);
      throw new Error('[Controller] - Create Tecnologia erro');
    }
  }

  async update(data: any) {
    try {
      const response = await this.tecnologiaRepository.update(data.id, data);
      if (response) {
        return { status: 200, message: { message: 'Tecnologia atualizado com sucesso' } };
      }
      return { status: 400, message: { message: ' Erro ao atualizar tecnologia' } };
    } catch (error: any) {
      handleError('Tecnologia controller', 'Update', error.message);
      throw new Error('[Controller] - Update Tecnologia erro');
    }
  }
}
