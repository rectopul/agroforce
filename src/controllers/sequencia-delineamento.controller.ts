import { SequenciaDelineamentoRepository } from '../repository/sequencia-delineamento.repository';
import { countDelimitation } from '../shared/utils/countDelimitation';
import handleError from '../shared/utils/handleError';
import handleOrderForeign from '../shared/utils/handleOrderForeign';

export class SequenciaDelineamentoController {
  private SequenciaDelineamentoRepository = new SequenciaDelineamentoRepository();

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.SequenciaDelineamentoRepository.findById(id);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Sequencia Delineamento controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Sequencia Delineamento erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.SequenciaDelineamentoRepository.create(data);
      const { response: Delimitation } = await this.getAll(
        { id_delineamento: data.id_delineamento },
      );
      await countDelimitation(Delimitation);
      if (response) {
        return { status: 200, message: 'Sequencia de delineamento cadastrada' };
      }
      return { status: 400, message: 'Sequencia de delineamento não cadastrada' };
    } catch (error: any) {
      handleError('Sequencia Delineamento controller', 'Create', error.message);
      throw new Error('[Controller] - Create Sequencia Delineamento erro');
    }
  }

  async update(data: any) {
    try {
      const sequenciaDelineamento = await this.getOne(data.id);

      if (!sequenciaDelineamento) return { status: 400, message: 'Sequência de delineamento não encontrado!' };

      await this.SequenciaDelineamentoRepository.update(
        data.id,
        data,
      );

      return { status: 200, message: 'Sequência de delineamento atualizada!' };
    } catch (error: any) {
      handleError('Sequencia Delineamento controller', 'Update', error.message);
      throw new Error('[Controller] - Update Sequencia Delineamento erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        parameters.volume = JSON.parse(`{"contains":"${options.filterSearch}"}`);
      }

      const select = {
        id: true,
        id_delineamento: true,
        delineamento: { select: { name: true } },
        repeticao: true,
        sorteio: true,
        nt: true,
        bloco: true,
        status: true,
      };

      if (options.repeticao) {
        parameters.repeticao = options.repeticao;
      }
      if (options.id_delineamento) {
        parameters.id_delineamento = Number(options.id_delineamento);
      }
      if (options.sorteio) {
        parameters.sorteio = options.sorteio;
      }

      if (options.nt) {
        parameters.nt = options.nt;
      }

      if (options.bloco) {
        parameters.bloco = options.bloco;
      }

      if (options.status) {
        parameters.status = options.status;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.SequenciaDelineamentoRepository.findAll(
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
      handleError('Sequencia Delineamento controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Sequencia Delineamento erro');
    }
  }
}
