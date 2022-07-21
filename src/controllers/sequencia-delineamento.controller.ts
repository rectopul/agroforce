import { SequenciaDelineamentoRepository } from "src/repository/sequencia-delineamento.repository";
import { number, object, SchemaOf, string } from "yup";

interface ISequenciaDelineamento {
  id: number;
  id_delineamento: number;
  repeticao: number;
  sorteio: number;
  nt: number;
  bloco: number;
  status?: number;
  created_by: number;
}

type ICreateSequenciaDelineamento = Omit<
  ISequenciaDelineamento, "id" | "status"
>;

type IUpdateSequenciaDelineamento = Omit<
  ISequenciaDelineamento, "id_delineamento" | "status" | "created_by"
>;

export class SequenciaDelineamentoController {
  private required = "Required";
  private SequenciaDelineamentoRepository = new SequenciaDelineamentoRepository();

  async getOneFoco(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.SequenciaDelineamentoRepository.findById(id);

      if (!response) throw new Error("Item não encontrado");

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Item não encontrado' };
    }
  };

  async list(id_delineamento: number) {
    try {
      const result = await this.SequenciaDelineamentoRepository.list(id_delineamento);

      const data = result.map((item) => {
        return {
          id: item.id,
          id_delineamento: item.id_delineamento,
          delineamento: item.delineamento.name,
          repeticao: item.repeticao,
          sorteio: item.sorteio,
          nt: item.nt,
          bloco: item.bloco,
          status: item.status,
        }
      });

      const total = data.length;

      return { status: 200, response: data, total };
    } catch {
      return { status: 400, response: [], total: 0 };
    }
  }

  async create(data: object | any) {
    try {
      if (data !== null && data !== undefined) {
        let response = await this.SequenciaDelineamentoRepository.create(data)
        if (response) {
          return { status: 200, message: "itens inseridos" }
        } else {
          return { status: 400, message: "erro" }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  async update(data: IUpdateSequenciaDelineamento) {
    try {

      const sequenciaDelineamento = await this.SequenciaDelineamentoRepository.findById(data.id);

      if (!sequenciaDelineamento) return { status: 400, message: 'Sequência de delineamento não encontrado!' };

      sequenciaDelineamento.repeticao = data.repeticao;
      sequenciaDelineamento.sorteio = data.sorteio;
      sequenciaDelineamento.nt = data.nt;
      sequenciaDelineamento.bloco = data.bloco;

      await this.SequenciaDelineamentoRepository.update(sequenciaDelineamento.id, sequenciaDelineamento);

      return { status: 200, message: "Sequência de delineamento atualizada!" };
    } catch (err) {
      return { status: 404, message: 'Erro ao atualizar!' };
    }
  }

  async listAll(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      if (options.filterStatus) {
        if (typeof (options.status) === 'string') {
          options.filterStatus = Number(options.filterStatus);
          if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
        } else {
          if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
        }
      }

      if (options.filterSearch) {
        options.filterSearch = '{"contains":"' + options.filterSearch + '"}';
        parameters.volume = JSON.parse(options.filterSearch);
      }

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = Object.assign({}, select);
      } else {
        select = {
          id: true,
          repeticao: true,
          delineamento: { select: { name: true } },
          sorteio: true,
          nt: true,
          bloco: true,
          status: true,
        }
      }

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

      if (options.take) {
        if (typeof (options.take) === 'string') {
          take = Number(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof (options.skip) === 'string') {
          skip = Number(options.skip);
        } else {
          skip = options.skip;
        }
      }

      if (options.orderBy) {
        orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
      }

      let response: object | any = await this.SequenciaDelineamentoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 }

      } else {
        return { status: 200, response, total: response.total }
      }
    } catch (err) {
      console.log(err)
      return { status: 400, response: [], total: 0 }
    }
  };
}
