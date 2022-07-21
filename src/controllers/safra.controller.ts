import {
  number, object, SchemaOf, string, date,
} from 'yup';
import { SafraRepository } from '../repository/safra.repository';

interface Safra {
  id: number;
  id_culture: number;
  safraName: string;
  year: number;
  plantingStartTime?: string | null;
  plantingEndTime?: string | null;
  main_safra?: number;
  status: number;
  created_by: number;
}

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
          options.filterStatus = Number(options.filterStatus);
          if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
        } else if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
      }

      if (options.filterSafra) {
        options.filterSafra = `{"contains":"${options.filterSafra}"}`;
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
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          safraName: true,
          year: true,
          plantingStartTime: true,
          plantingEndTime: true,
          main_safra: false,
          status: true,
        };
      }

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.id_safra) {
        parameters.id = Number(options.id_safra);
      }

      if (options.safraName) {
        parameters.safraName = options.safraName;
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
        orderBy = `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.safraRepository.findAll(parameters, select, take, skip, orderBy);

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (err) {
      return { status: 200, response: [], total: 0 };
    }
  }

  async getOneSafra(id: number) {
    try {
      if (!id) return { status: 409, response: [], message: 'ID invalido' };

      const response = await this.safraRepository.findOne(Number(id));

      if (!response) throw new Error('Dados inválidos');

      return { status: 200, response };
    } catch (e) {
      console.log(e);
      return { status: 400, message: 'Safra não encontrada' };
    }
  }

  async postSafra(data: CreateSafra) {
    try {
      const safraAlreadyExists = await this.safraRepository.findBySafraName({ safraName: data.safraName, id_culture: data.id_culture });
      if (safraAlreadyExists) return { status: 400, message: 'Safra já cadastrada' };

      await this.safraRepository.create(data);

      return { status: 201, message: 'Safra cadastrada' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Erro ao cadastrar safra' };
    }
  }

  async updateSafra(data: UpdateSafra) {
    try {
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

      return { status: 200, message: 'Item atualizado' };
    } catch (err) {
      return { status: 404, message: 'Erro ao atualizar safra' };
    }
  }
}
