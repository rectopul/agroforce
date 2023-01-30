import {
  number, object, SchemaOf, string,
} from 'yup';
import { DepartamentRepository } from '../repository/departament.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import handleError from '../shared/utils/handleError';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';
import createXls from 'src/helpers/api/xlsx-global-download';

interface DepartmentDTO {
  id: number;
  name: string;
  status: number;
  created_by: number;
}

type CreateDepartmentDTO = Omit<DepartmentDTO, 'id' | 'status'>;
type UpdateDepartmentDTO = Omit<DepartmentDTO, 'created_by'>;
type FindOne = Omit<DepartmentDTO, 'name' | 'created_by' | 'status'>;

export class DepartamentController {
  public readonly required = 'Campo obrigatório';

  departamentRepository = new DepartamentRepository();

  reporteRepository = new ReporteRepository();

  async getAllDepartaments() {
    try {
      const response = await this.departamentRepository.findAll();
      return response;
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async listAllDepartments(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'TMG-SETOR');
        return { status: 200, response: sheet };
      }

      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        options.filterSearch = `{"contains":"${options.filterSearch}"}`;
        parameters.name = JSON.parse(options.filterSearch);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item: any) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          name: true,
          status: true,
        };
      }

      if (options.name) {
        parameters.name = options.name;
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

      const response: object | any = await this.departamentRepository.listAll(
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
      handleError('Setor Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Setor erro');
    }
  }

  async getOneDepartament({ id }: FindOne) {
    try {
      const response = await this.departamentRepository.findOne(id);

      if (!response) throw new Error('Setor não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Setor Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Setor erro');
    }
  }

  async postDepartament(data: CreateDepartmentDTO) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      const departmentAlreadyExists = await this.departamentRepository.findByName(data.name);

      if (departmentAlreadyExists) {
        return { status: 400, message: 'Esse setor já está cadastro, favor checar registros inativos.' };
      }

      const setor = await this.departamentRepository.create(data);

      // await this.reporteRepository.create({
      //   madeBy: data.created_by, module: 'Setor', operation: 'Cadastro', name: data.name, ip: JSON.stringify(ip), idOperation: setor.id,
      // });
      return { status: 200, message: 'Setor cadastrado' };
    } catch (error: any) {
      handleError('Setor Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Setor erro');
    }
  }

  async updateDepartament(data: UpdateDepartmentDTO) {
    try {
      const departament = await this.departamentRepository.findOne(data.id);

      if (!departament) return { status: 400, message: 'Setor não existente' };

      const departamentAlreadyExists = await this.departamentRepository.findByName(data.name);

      if (departamentAlreadyExists && departamentAlreadyExists.id !== departament.id) {
        return { status: 400, message: 'Esse item já está cadastro. favor consultar os inativos' };
      }

      await this.departamentRepository.update(data.id, data);
      // if (departament.status === 1) {
      //   await this.reporteRepository.create({
      //     madeBy: departament.created_by, module: 'Setor', operation: 'Edição', name: data.name, ip: JSON.stringify(ip), idOperation: departament.id,
      //   });
      // }
      // if (departament.status === 0) {
      //   await this.reporteRepository.create({
      //     madeBy: departament.created_by, module: 'Setor', operation: 'Inativação', name: data.name, ip: JSON.stringify(ip), idOperation: departament.id,
      //   });
      // }
      return { status: 200, message: 'Setor atualizado' };
    } catch (error: any) {
      handleError('Setor Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Setor erro');
    }
  }
}
