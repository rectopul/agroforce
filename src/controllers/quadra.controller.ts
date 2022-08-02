import handleError from '../shared/utils/handleError';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { QuadraRepository } from '../repository/quadra.repository';

export class QuadraController {
  quadraRepository = new QuadraRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== 2) parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        parameters.cod_quadra = JSON.parse(`{"contains":"${options.filterSearch}"}`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          cod_quadra: true,
          local_plantio: true,
          larg_q: true,
          comp_p: true,
          linha_p: true,
          comp_c: true,
          esquema: true,
          tiro_fixo: true,
          disparo_fixo: true,
          q: true,
          localPreparo: { select: { name_local_culture: true } },
          Safra: { select: { safraName: true } },
          status: true,
        };
      }
      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.local_preparo) {
        parameters.local_preparo = Number(options.local_preparo);
      }

      if (options.cod_quadra) {
        parameters.cod_quadra = options.cod_quadra;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.quadraRepository.findAll(
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
      handleError('Quadra Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Quadra erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.quadraRepository.findOne(id);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Quadra Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Quadra erro');
    }
  }

  async create(data: any) {
    try {
      const response = await this.quadraRepository.create(data);
      return { status: 200, message: 'Genealogia cadastrada', response };
    } catch (error: any) {
      handleError('Quadra Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Quadra erro');
    }
  }

  async update(data: any) {
    try {
      const quadra = await this.quadraRepository.findOne(data.id);

      if (!quadra) return { status: 400, message: 'Genótipo não encontrado' };

      await this.quadraRepository.update(quadra.id, data);

      return { status: 200, message: 'Genótipo atualizado' };
    } catch (error: any) {
      handleError('Quadra Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Quadra erro');
    }
  }
}
