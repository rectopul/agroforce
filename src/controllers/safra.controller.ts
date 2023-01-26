import createXls from 'src/helpers/api/xlsx-global-download';
import { SafraRepository } from '../repository/safra.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import handleError from '../shared/utils/handleError';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';

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

  reporteRepository = new ReporteRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'TMG-SAFRA');
        return { status: 200, response: sheet };
      }

      if (options.filterStatus) {
        if (options.filterStatus != '2') {
          parameters.status = Number(options.filterStatus);
        }
      }

      if (options.filterSafra) {
        parameters.safraName = JSON.parse(
          `{"contains":"${options.filterSafra}"}`,
        );
      }

      if (options.filterYearFrom || options.filterYearTo) {
        if (options.filterYearFrom && options.filterYearTo) {
          parameters.year = JSON.parse(`{"gte": ${Number(options.filterYearFrom)}, "lte": ${Number(options.filterYearTo)} }`);
        } else if (options.filterYearFrom) {
          parameters.year = JSON.parse(`{"gte": ${Number(options.filterYearFrom)} }`);
        } else if (options.filterYearTo) {
          parameters.year = JSON.parse(`{"lte": ${Number(options.filterYearTo)} }`);
        }
      }
      const select = {
        id: true,
        culture: true,
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

      const take = options.take ? Number(options.take) : undefined;

      const skip = options.skip ? Number(options.skip) : undefined;

      const orderBy = options.orderBy
        ? `{"${options.orderBy}":"${options.typeOrder}"}`
        : undefined;

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
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      const safraAlreadyExists = await this.safraRepository.findBySafraName({
        safraName: data.safraName,
        id_culture: data.id_culture,
      });
      if (safraAlreadyExists) {
        return { status: 400, message: 'Safra já cadastrada, favor checar registros inativos.' };
      }

      const safra = await this.safraRepository.create(data);

      await this.reporteRepository.create({
        madeBy: data.created_by, module: 'Safra', operation: 'Cadastro', name: data.safraName, ip: JSON.stringify(ip), idOperation: safra.id,
      });

      return { status: 200, message: 'Safra cadastrada' };
    } catch (error: any) {
      handleError('Safra controller', 'Create', error.message);
      throw new Error('[Controller] - Create Safra erro');
    }
  }

  async update(data: UpdateSafra) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      if (data.status === 0 || data.status === 1) {
        const safraAlreadyExists = await this.getOne(data.id);
        if (safraAlreadyExists.status !== 200) {
          return { status: 400, message: 'Safra não encontrado' };
        }
        const response = await this.safraRepository.update(data.id, data);
        if (response.status === 0) {
          await this.reporteRepository.create({
            madeBy: response.created_by, module: 'Safra', operation: 'Inativação', name: response.safraName, ip: JSON.stringify(ip), idOperation: response.id,
          });
        }
        if (response.status === 1) {
          await this.reporteRepository.create({
            madeBy: response.created_by, module: 'Safra', operation: 'Edição', name: response.safraName, ip: JSON.stringify(ip), idOperation: response.id,
          });
        }
        if (!response) {
          return { status: 400, response: [], message: 'Safra não atualizado' };
        }

        return { status: 200, response };
      }
      const safraAlreadyExists = await this.safraRepository.findBySafraName(
        data,
      );
      if (safraAlreadyExists) {
        return { status: 400, message: 'Safra já registrado' };
      }
      const response = await this.safraRepository.update(data.id, data);
      if (!response) {
        return { status: 400, response: [], message: 'Safra não atualizado' };
      }

      return { status: 200, response };
    } catch (error: any) {
      handleError('Safra controller', 'Update', error.message);
      throw new Error('[Controller] - Update Safra erro');
    }
  }
}
