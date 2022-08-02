import { SafraRepository } from '../repository/safra.repository';
import handleError from '../shared/utils/handleError';

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

  async getAll(options: any) {
    const parameters: object | any = {};
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== 2) parameters.status = Number(options.filterStatus);
      }

      if (options.filterSafra) {
        parameters.safraName = JSON.parse(`{"contains":"${options.filterSafra}"}`);
      }

      if (options.filterYear) {
        parameters.year = Number(options.filterYear);
      }

      const select = {
        id: true,
        safraName: true,
        year: true,
        plantingStartTime: true,
        plantingEndTime: true,
        main_safra: false,
        status: true,
      };

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

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const response: any = await this.safraRepository.findAll(
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
      handleError('Safra controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Safra erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) return { status: 409, response: [], message: 'ID invalido' };

      const response = await this.safraRepository.findOne(Number(id));

      if (!response) return { status: 400, response };

      return { status: 200, response };
    } catch (error: any) {
      handleError('Safra controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Safra erro');
    }
  }

  async create(data: CreateSafra) {
    try {
      const safraAlreadyExists = await this.safraRepository.findBySafraName(
        { safraName: data.safraName, id_culture: data.id_culture },
      );
      if (safraAlreadyExists) return { status: 400, message: 'Safra já cadastrada' };

      await this.safraRepository.create(data);

      return { status: 200, message: 'Safra cadastrada' };
    } catch (error: any) {
      handleError('Safra controller', 'Create', error.message);
      throw new Error('[Controller] - Create Safra erro');
    }
  }

  async update(data: UpdateSafra) {
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
    } catch (error: any) {
      handleError('Safra controller', 'Update', error.message);
      throw new Error('[Controller] - Update Safra erro');
    }
  }
}
