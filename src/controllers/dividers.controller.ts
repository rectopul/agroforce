import { DisparoRepository } from '../repository/dividers.repository';
import handleError from '../shared/utils/handleError';
import handleOrderForeign from '../shared/utils/handleOrderForeign';

export class DividersController {
  public readonly required = 'Campo obrigatório';

  disparoRepository = new DisparoRepository();

  async listAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    try {
      const select = {
        id: true,
        divisor: true,
        sem_metros: true,
        t4_i: true,
        t4_f: true,
        di: true,
        df: true,
        quadra: { select: { esquema: true } },
      };

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.id_quadra) {
        parameters.id_quadra = Number(options.id_quadra);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.disparoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (!response && response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Divisores controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Divisores erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.disparoRepository.findOne(id);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Divisores controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Divisores erro');
    }
  }

  async create(data: any) {
    try {
      await this.disparoRepository.create(data);
      return { status: 200, message: 'Disparo cadastrado' };
    } catch (error: any) {
      handleError('Divisores controller', 'Create', error.message);
      throw new Error('[Controller] - Create Divisores erro');
    }
  }

  async update(data: any) {
    try {
      const quadra: any = await this.disparoRepository.findOne(data.id);

      if (!quadra) return { status: 400, message: 'Genótipo não encontrado' };

      quadra.id_culture = data.id_culture;
      quadra.id_tecnologia = data.id_tecnologia;
      quadra.quadra = data.quadra;
      quadra.cruza = data.cruza;
      quadra.status = data.status;

      await this.disparoRepository.update(quadra.id, quadra);

      return { status: 200, message: 'Genótipo atualizado' };
    } catch (error: any) {
      handleError('Divisores controller', 'Update', error.message);
      throw new Error('[Controller] - Update Divisores erro');
    }
  }
}
