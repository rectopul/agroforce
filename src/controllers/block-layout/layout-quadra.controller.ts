import handleError from '../../shared/utils/handleError';
import { LayoutQuadraRepository } from '../../repository/layout-quadra.repository';

export class LayoutQuadraController {
  Repository = new LayoutQuadraRepository();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterCodigo) {
        parameters.id = Number(options.filterCodigo);
      }

      if (options.filterEsquema) {
        parameters.esquema = JSON.parse(`{"contains":"${options.filterEsquema}"}`);
      }

      if (options.filterDisparos) {
        parameters.disparos = Number(options.filterDisparos);
      }

      if (options.filterTiros) {
        parameters.tiros = Number(options.filterTiros);
      }

      if (options.filterPlantadeira) {
        parameters.plantadeira = JSON.parse(`{"contains":"${options.filterPlantadeira}"}`);
      }

      if (options.filterParcelas) {
        parameters.parcelas = Number(options.filterParcelas);
      }

      if (options.esquema) {
        parameters.esquema = options.esquema;
      }

      if (options.status) {
        parameters.status = Number(options.status);
      }

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const select = {
        id: true,
        esquema: true,
        plantadeira: true,
        disparos: true,
        tiros: true,
        parcelas: true,
        status: true,
        id_culture: true,
      };

      const response = await this.Repository.findAll(parameters, select, take, skip, orderBy);

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Layout de Quadra Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Layout de Quadra erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.Repository.findOne(id);
      if (!response) {
        return { status: 400, response: [], message: 'Layout não encontrado' };
      }
      return { status: 200, response };
    } catch (error: any) {
      handleError('Layout de Quadra Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetAll Layout de Quadra erro');
    }
  }

  async create(data: object | any) {
    try {
      console.log(data);
      const response = await this.Repository.create(data);
      if (response) {
        return { status: 200, message: 'Layout criado', response };
      }
      return { status: 400, message: 'Erro ao criar layout' };
    } catch (error: any) {
      handleError('Layout de Quadra Controller', 'Create', error.message);
      throw new Error('[Controller] - GetAll Layout de Quadra erro');
    }
  }

  async update(data: any) {
    try {
      if (data.status === 0 || data.status === 1) {
        const layout = await this.Repository.update(data.id, data);
        if (!layout) return { status: 400, message: 'Layout de quadra não encontrado' };
        return { status: 200, message: 'Layout de quadra atualizada' };
      }

      const response = await this.Repository.update(data.id, data);
      if (response) {
        return { status: 200, message: { message: 'Layout atualizado com sucesso' } };
      }
      return { status: 400, message: { message: 'Erro ao atualizar layout' } };
    } catch (error: any) {
      handleError('Layout de Quadra Controller', 'Update', error.message);
      throw new Error('[Controller] - GetAll Layout de Quadra erro');
    }
  }
}
