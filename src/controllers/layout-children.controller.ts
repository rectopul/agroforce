import { LayoutChildrenRepository } from '../repository/layout-children.repository';
import { countBlock } from '../shared/utils/counts';
import handleError from '../shared/utils/handleError';

export class LayoutChildrenController {
  public readonly required = 'Campo obrigatório';

  disparoRepository = new LayoutChildrenRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    try {
      const select = {
        id: true,
        id_layout: true,
        sl: true,
        sc: true,
        s_aloc: true,
        tiro: true,
        disparo: true,
        dist: true,
        st: true,
        cj: true,
        spc: true,
        scolheita: true,
        tipo_parcela: true,
      };

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.id_layout) {
        parameters.id_layout = Number(options.id_layout);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

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
      handleError('Layout children controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Layout children erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.disparoRepository.findOne(id);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Layout children controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Layout children erro');
    }
  }

  async create(data: any) {
    try {
      await this.disparoRepository.create(data);
      const { response } = await this.getAll({ id_layout: data.id_layout });
      await countBlock(response);
      return { status: 200, message: 'Disparo cadastrado' };
    } catch (error: any) {
      handleError('Layout children controller', 'Create', error.message);
      throw new Error('[Controller] - Create Layout children erro');
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
      handleError('Layout children controller', 'Update', error.message);
      throw new Error('[Controller] - Update Layout children erro');
    }
  }
}
