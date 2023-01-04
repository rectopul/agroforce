import { SequenciaDelineamentoRepository } from '../repository/sequencia-delineamento.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import { countDelimitation } from '../shared/utils/counts';
import handleError from '../shared/utils/handleError';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';

export class SequenciaDelineamentoController {
  private SequenciaDelineamentoRepository = new SequenciaDelineamentoRepository();

  reporteRepository = new ReporteRepository();

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
      const operation = data.status === 1 ? 'Ativação' : 'Inativação';
      if (!sequenciaDelineamento) return { status: 400, message: 'Sequência de delineamento não encontrado!' };
      if (data.status === 0 || data.status === 1) {
        const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
        await this.reporteRepository.create({
          madeBy: data.created_by, module: 'Seq. Delineamento', operation, name: data.name, ip: JSON.stringify(ip), idOperation: data.id,
        });
      }
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
    parameters.AND = [];
    let orderBy: object | any;
    try {
      options = await removeEspecialAndSpace(options);
      if (options.filterRepetitionFrom || options.filterRepetitionTo) {
        if (options.filterRepetitionFrom && options.filterRepetitionTo) {
          parameters.repeticao = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)}, "lte": ${Number(options.filterRepetitionTo)} }`);
        } else if (options.filterRepetitionFrom) {
          parameters.repeticao = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)} }`);
        } else if (options.filterRepetitionTo) {
          parameters.repeticao = JSON.parse(`{"lte": ${Number(options.filterRepetitionTo)} }`);
        }
      }

      if (options.filterOrderFrom || options.filterOrderTo) {
        if (options.filterOrderFrom && options.filterOrderTo) {
          parameters.sorteio = JSON.parse(`{"gte": ${Number(options.filterOrderFrom)}, "lte": ${Number(options.filterOrderTo)} }`);
        } else if (options.filterOrderFrom) {
          parameters.sorteio = JSON.parse(`{"gte": ${Number(options.filterOrderFrom)} }`);
        } else if (options.filterOrderTo) {
          parameters.sorteio = JSON.parse(`{"lte": ${Number(options.filterOrderTo)} }`);
        }
      }

      if (options.filterNtFrom || options.filterNtTo) {
        if (options.filterNtFrom && options.filterNtTo) {
          parameters.nt = JSON.parse(`{"gte": ${Number(options.filterNtFrom)}, "lte": ${Number(options.filterNtTo)} }`);
        } else if (options.filterNtFrom) {
          parameters.nt = JSON.parse(`{"gte": ${Number(options.filterNtFrom)} }`);
        } else if (options.filterNtTo) {
          parameters.nt = JSON.parse(`{"lte": ${Number(options.filterNtTo)} }`);
        }
      }

      if (options.filterBlockFrom || options.filterBlockTo) {
        if (options.filterBlockFrom && options.filterBlockTo) {
          parameters.bloco = JSON.parse(`{"gte": ${Number(options.filterBlockFrom)}, "lte": ${Number(options.filterBlockTo)} }`);
        } else if (options.filterBlockFrom) {
          parameters.bloco = JSON.parse(`{"gte": ${Number(options.filterBlockFrom)} }`);
        } else if (options.filterBlockTo) {
          parameters.bloco = JSON.parse(`{"lte": ${Number(options.filterBlockTo)} }`);
        }
      }

      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      // Ta com erro de push aqui

      if (options.filterSearch) {
        parameters.AND.push(JSON.parse(`{ "delineamento": {"name": "${options.filterSearch}" } }`));
      }

      const select = {
        id: true,
        id_delineamento: true,
        delineamento: { select: { name: true, culture: true } },
        repeticao: true,
        sorteio: true,
        nt: true,
        bloco: true,
        status: true,
      };

      if (options.repeticao) {
        parameters.repeticao = Number(options.repeticao);
      }
      if (options.id_delineamento) {
        parameters.id_delineamento = Number(options.id_delineamento);
      }
      if (options.sorteio) {
        parameters.sorteio = options.sorteio;
      }

      if (options.nt) {
        parameters.nt = Number(options.nt);
      }

      if (options.ntCount) {
        parameters.nt = JSON.parse(`{"lte" : ${Number(options.ntCount)}}`);
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
