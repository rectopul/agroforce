import { number, object, SchemaOf, string, date } from 'yup';
import { SafraRepository } from '../repository/safra.repository';

interface Safra {
  id: number;
  id_culture: number;
  safraName: string;
  year: number;
  plantingStartTime?: string;
  plantingEndTime?: string;
  main_safra?: number;
  status: number;
  created_by: number;
};

type CreateSafra = Omit<Safra, 'id' | 'main_safra'>;
type UpdateSafra = Omit<Safra, 'id_culture' | 'created_by' | 'main_safra'>;
export class SafraController {
  public readonly required = 'Campo obrigatório';

  safraRepository = new SafraRepository();

  async getAllSafra(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (typeof (options.status) === 'string') {
          options.filterStatus = parseInt(options.filterStatus);
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        } else {
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        }
      }

      if (options.filterSafra) {
        options.filterSafra = '{"contains":"' + options.filterSafra + '"}';
        parameters.safraName = JSON.parse(options.filterSafra);
      }

      if (options.filterYear) {
        parameters.year = Number(options.filterYear);
      }

      // if (options.filterStartDate) {
      //   options.filterStartDate = `{"lte": "${options.filterStartDate}"}`
      //   parameters.plantingStartTime = JSON.parse(options.filterStartDate)
      // }

      // if (options.filterEndDate) {
      //   options.filterSafra = `{"gte": "${options.filterEndDate}"}`
      //   parameters.plantingEndTime = JSON.parse(options.filterSafra)
      // }

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = Object.assign({}, select);
      } else {
        select = {
          id: true,
          safraName: true,
          year: true,
          plantingStartTime: true,
          plantingEndTime: true,
          main_safra: false,
          status: true
        };
      }

      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
      }

      if (options.safraName) {
        parameters.safraName = options.safraName
      }

      if (options.year) {
        parameters.year = options.year;
      }

      if (options.plantingStartTime) {
        parameters.plantingStartTime = options.plantingStartTime;
      }

      if (options.plantingEndTime) {
        parameters.plantingEndTime = options.plantingEndTime;
      }

      if (options.main_safra) {
        parameters.main_safra = options.main_safra;
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

      const response: object | any = await this.safraRepository.findAll(parameters, select, take, skip, orderBy);

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 }

      } else {
        return { status: 200, response, total: response.total }
      }
    } catch (err) {
      return { status: 200, response: [], total: 0 }
    }
  }

  async getOneSafra(id: number) {
    try {
      if (!id) throw new Error("ID inválido");

      const response = await this.safraRepository.findOne(id);

      if (!response) throw new Error("Dados inválidos");

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Safra não encontrada' };
    }
  }

  async postSafra(data: CreateSafra) {
    try {
      const schema: SchemaOf<CreateSafra> = object({
        id_culture: number().integer().required(this.required),
        safraName: string().required(this.required),
        year: number().integer().required(this.required),
        plantingStartTime: string().optional(),
        plantingEndTime: string().optional(),
        status: number().integer().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: "Dados inválidos" };
      const safraAlreadyExists = await this.safraRepository.findBySafraName({ safraName: data.safraName, id_culture: data.id_culture });
      if (safraAlreadyExists) return { status: 400, message: "Safra já cadastrada" };

      await this.safraRepository.create(data);

      return { status: 201, message: "Safra cadastrada" }
    } catch (err) {
      console.log(err)
      return { status: 404, message: "Erro ao cadastrar safra" }
    }
  }

  async updateSafra(data: UpdateSafra) {
    try {
      const schema: SchemaOf<UpdateSafra> = object({
        id: number().integer().required(this.required),
        safraName: string().required(this.required),
        year: number().required(this.required),
        plantingStartTime: string().optional(),
        plantingEndTime: string().optional(),
        status: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: "Dados inválidos" };

      const safra: any = await this.safraRepository.findOne(data.id);

      if (!safra) return { status: 400, message: 'Safra não existente' };

      const safraAlreadyExists = await this.safraRepository.findBySafraName(data);

      if (safraAlreadyExists && safraAlreadyExists.id !== safra.id) {
        return { status: 400, message: 'Safra já cadastrada.' };
      }

      safra.safraName = data.safraName;
      safra.year = data.year;
      safra.plantingStartTime = data.plantingStartTime;
      safra.plantingEndTime = data.plantingEndTime;
      safra.status = data.status;

      await this.safraRepository.update(safra.id, safra);

      return { status: 200, message: "Item atualizado" }
    } catch (err) {
      return { status: 404, message: "Erro ao atualizar safra" }
    }
  }
}
