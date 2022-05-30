import { number, object, SchemaOf, string } from 'yup';
import { CulturaRepository } from '../repository/culture.repository';

interface CultureDTO {
  id: number;
  name: string;
  created_by: number;
  status: number;
}

type CreateCultureDTO = Omit<CultureDTO, 'id' | 'status'>;
type UpdateCultureDTO = Omit<CultureDTO, 'created_by'>;
type FindOne = Omit<CultureDTO, 'name' | 'created_by' | 'status'>;

export class CulturaController {
  public readonly required = 'Campo obrigatório';

  culturaRepository = new CulturaRepository();

  async getAllCulture(options: any) {
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
      } else {
        parameters.status = 1;
      }

      if (options.filterSearch) {
        options.filterSearch = '{"contains":"' + options.filterSearch + '"}';
        parameters.name = JSON.parse(options.filterSearch);
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

      let response: object | any = await this.culturaRepository.findAll(
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

  async getOneFoco(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.culturaRepository.findOne(id);

      if (!response) throw new Error("Dados inválidos");

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Item não encontrado' };
    }
  }

  async getOneCulture(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.culturaRepository.findOne(id);

      if (!response) throw new Error("Item não encontrado");

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Item não encontrada' };
    }
  }

  async postCulture(data: CreateCultureDTO) {
    try {
      const schema: SchemaOf<CreateCultureDTO> = object({
        name: string().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: "Dados inválidos" };

      const loteAlreadyExists = await this.culturaRepository.findByName(data.name);

      if (loteAlreadyExists) {
        return { status: 400, message: "Esse item já está cadastro. favor consultar os inativos" };
      }

      await this.culturaRepository.create(data);

      return { status: 201, message: "Cultura cadastrada" }
    } catch (err) {
      return { status: 404, message: "Cultura não cadastrada" }
    }
  }

  async updateCulture(data: UpdateCultureDTO) {
    try {
      const schema: SchemaOf<UpdateCultureDTO> = object({
        id: number().integer().required(this.required),
        name: string().required(this.required),
        status: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: "Dados inválidos" };

      const culture = await this.culturaRepository.findOne(data.id);

      if (!culture) return { status: 400, message: "Cultura não existente" };

      const cultureAlreadyExists = await this.culturaRepository.findByName(data.name);

      if (cultureAlreadyExists && cultureAlreadyExists.id !== culture.id) {
        return { status: 400, message: "Nome da cultura já existente. favor consultar os inativos" };
      }

      culture.name = data.name;
      culture.status = data.status;

      await this.culturaRepository.update(data.id, culture);

      return { status: 200, message: "Cultura atualizada" }
    } catch (err) {
      return { status: 404, message: "Erro ao atualizar" }
    }
  }
}
