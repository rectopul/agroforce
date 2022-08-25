import { LayoutQuadraRepository } from '../../repository/layout-quadra.repository';
import handleError from '../../shared/utils/handleError';
import { LayoutChildrenController } from '../layout-children.controller';

export class LayoutQuadraController {
  layoutQuadraRepository = new LayoutQuadraRepository();

  layoutChildrenController = new LayoutChildrenController();

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
        tiros: true,
        disparos: true,
        parcelas: true,
        status: true,
        id_culture: true,
      };

      const response = await this.layoutQuadraRepository.findAll(
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
    } catch (error: any) {
      handleError('Layout Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Layout erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.layoutQuadraRepository.findOne(id);
      if (!response) {
        return { status: 400, response: [], message: 'Layout não encontrado' };
      }
      return { status: 200, response };
    } catch (error: any) {
      handleError('Layout Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Layout erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.layoutQuadraRepository.create(data);
      if (response) {
        return { status: 200, message: 'Layout criado', response };
      }
      return { status: 400, message: 'Falha ao criar layout' };
    } catch (error: any) {
      handleError('Layout Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Layout erro');
    }
  }

  async update(data: any) {
    try {
      console.log(data);
      if (data.status === 0 || data.status === 1) {
        const layout = await this.layoutQuadraRepository.update(data.id, data);

        if (!layout) return { status: 400, message: 'Layout de quadra não encontrado' };
        return { status: 200, message: 'Layout de quadra atualizada' };
      }

      const response = await this.layoutQuadraRepository.update(data.id, data);
      if (response) {
        return { status: 200, message: { message: 'Layout atualizado com sucesso' } };
      }
      return { status: 400, message: { message: 'erro ao tentar fazer o update' } };
    } catch (error: any) {
      handleError('Layout Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Layout erro');
    }
  }
}
