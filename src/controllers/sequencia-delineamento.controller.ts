import { SequenciaDelineamentoRepository } from "src/repository/sequencia-delineamento.repository";
import { number, object, SchemaOf, string } from "yup";

interface ISequenciaDelineamento {
  id: number;
  id_delineamento: number;
  name: string;
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

      return {status: 200 , response};
    } catch (e) {
      return {status: 400, message: 'Item não encontrado'};
    }
  };

  async list(id_delineamento: number) {
    try {
      const data = await this.SequenciaDelineamentoRepository.listAll(id_delineamento);
      const count = data.length;

      return { status: 200, response: data, total: count };
    } catch {
      return { status: 400, response: [], total: 0 };
    }
  }

  async create(data: ICreateSequenciaDelineamento) {
    try {
      const schema: SchemaOf<ICreateSequenciaDelineamento> = object({
        id_delineamento: number().integer().required(this.required),
        name: string().required(this.required),
        repeticao: number().integer().required(this.required),
        sorteio: number().integer().required(this.required),
        nt: number().integer().required(this.required),
        bloco: number().integer().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      const itemAlreadyExists = await this.SequenciaDelineamentoRepository.findByName(data.name);

      if (itemAlreadyExists) {
        return { status: 400, message: "Item já cadastro. favor consultar os inativos" };
      }

      await this.SequenciaDelineamentoRepository.create(data);

      return {status: 201, message: "Item cadastrado com sucesso!"};
    } catch(err) {
      return {status: 400, message: "Erro no cadastrado"};
    }
  }

  async update(data: IUpdateSequenciaDelineamento) {
    try {
      const schema: SchemaOf<IUpdateSequenciaDelineamento> = object({
        id: number().integer().required(this.required),
        name: string().required(this.required),
        repeticao: number().integer().required(this.required),
        sorteio: number().integer().required(this.required),
        nt: number().integer().required(this.required),
        bloco: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      const sequenciaDelineamento = await this.SequenciaDelineamentoRepository.findById(data.id);
      
      if (!sequenciaDelineamento) return { status: 400, message: 'Sequência de delineamento não encontrado!' };

      const sequenciaDelineamentoAlreadyExists = await this.SequenciaDelineamentoRepository.findByName(data.name);

      if (sequenciaDelineamentoAlreadyExists && sequenciaDelineamentoAlreadyExists.id !== sequenciaDelineamento.id) {
        return { status: 400, message: 'Sequência de delineamento já cadastra. favor consultar os inativos' }
      }

      sequenciaDelineamento.name = data.name;
      sequenciaDelineamento.repeticao = data.repeticao;
      sequenciaDelineamento.sorteio = data.sorteio;
      sequenciaDelineamento.nt = data.nt;
      sequenciaDelineamento.bloco = data.bloco;

      await this.SequenciaDelineamentoRepository.update(sequenciaDelineamento.id, sequenciaDelineamento);

      return {status: 200, message: "Sequência de delineamento atualizada!"};
    } catch (err) {
      return { status: 404, message: 'Erro ao atualizar!' };
    }
  }

  async listAll(options: any) {
    const parameters: object | any = new Object();
    let take; 
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      if (options.filterStatus) {
        if (typeof(options.status) === 'string') {
          options.filterStatus = parseInt(options.filterStatus);
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        } else {
          if (options.filterStatus != 2) parameters.status =parseInt(options.filterStatus);
        }
      }

      if (options.filterSearch) {
        options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';
        parameters.name  = JSON.parse(options.filterSearch);
        parameters.volume  = JSON.parse(options.filterSearch);
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
          name: true,
          repeticao: true,
          sorteio: true,
          nt: true,
          bloco: true,
          status: true,
        }
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.repeticao) {
        parameters.repeticao = options.repeticao;
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
        if (typeof(options.take) === 'string') {
          take = parseInt(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof(options.skip) === 'string') {
          skip = parseInt(options.skip);
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
        return {status: 400, response: [], total: 0}

      } else {
        return {status: 200, response, total: response.total }
      }    
    } catch (err) {
      return {status: 400, response: [], total: 0}
    }
  };
}