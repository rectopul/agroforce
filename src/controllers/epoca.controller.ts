import { EpocaRepository } from 'src/repository/epoca.repository';
import { number, object, SchemaOf, string } from 'yup';

interface IEpoca {
  id: number;
  id_culture: number;
  name: string;
  status: number;
  created_by: number;
};

type ICreateEpoca = Omit<IEpoca, "id" | "status">;
type IUpdateEpoca = Omit<IEpoca, "id_culture" | "created_by">;

export class EpocaController {
  public readonly required = 'Campo obrigatório';

  epocaRepository = new EpocaRepository();

  async listAll(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      if (options.filterStatus) {
        if (typeof (options.status) === 'string') {
          options.filterStatus = parseInt(options.filterStatus);
          if (options.filterStatus !== 2) parameters.status = parseInt(options.filterStatus);
        } else {
          if (options.filterStatus !== 2) parameters.status = parseInt(options.filterStatus);
        }
      }

      if (options.filterSearch) {
        options.filterSearch = '{"contains":"' + String(options.filterSearch).trim() + '"}';
        parameters.name = JSON.parse(options.filterSearch);
      }

      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
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
          status: true
        };
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.take) {
        if (typeof (options.take) === 'string') {
          take = parseInt(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof (options.skip) === 'string') {
          skip = parseInt(options.skip);
        } else {
          skip = options.skip;
        }
      }

      if (options.orderBy) {
        orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
      }

      let response: object | any = await this.epocaRepository.findAll(
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
      return { status: 400, message: err }
    }
  };

  async getOne(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.epocaRepository.findOne(id);

      if (!response) throw new Error("Época não encontrada");

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Época não encontrada' };
    }
  };

  async create(data: ICreateEpoca) {
    try {
      const schema: SchemaOf<ICreateEpoca> = object({
        name: string().trim().required(this.required),
        id_culture: number().integer().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: "Dados inválidos" };

      const epocaAlreadyExists = await this.epocaRepository.findByName(data.name);

      if (epocaAlreadyExists) return { status: 400, message: "Época já existente" };

      await this.epocaRepository.create(data);

      return { status: 201, message: "Época cadastrada com sucesso!" }
    } catch (err) {
      return { status: 404, message: "Erro no cadastrado" }
    }
  };

  async update(data: IUpdateEpoca) {
    try {
      const schema: SchemaOf<IUpdateEpoca> = object({
        id: number().integer().required(this.required),
        name: string().trim().required(this.required),
        status: number().integer().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: "Dados inválidos" };

      const epoca = await this.epocaRepository.findOne(data.id);

      if (!epoca) return { status: 400, message: "Época não encontrada" };

      const epocaAlreadyExists = await this.epocaRepository.findByName(data.name);

      if (epocaAlreadyExists && epocaAlreadyExists.id !== epoca.id) {
        return { status: 400, message: "Época já existente" };
      }

      epoca.name = data.name;
      epoca.status = data.status;

      await this.epocaRepository.update(data.id, epoca);

      return { status: 200, message: "Época atualizada" }
    } catch (err) {
      return { status: 404, message: "Erro ao atualizar" }
    }
  };
};
