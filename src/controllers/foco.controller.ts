import handleError from 'src/shared/utils/handleError';
import {
  number, object, SchemaOf, string,
} from 'yup';
import { FocoRepository } from '../repository/foco.repository';

interface LoteDTO {
  id: number;
  name: string;
  created_by: number;
  status: number;
  id_culture?: number;
}

type UpdateLoteDTO = Omit<LoteDTO, 'created_by'>;
export class FocoController {
  public readonly required = 'Campo obrigatório';

  focoRepository = new FocoRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        parameters.name = JSON.parse(`{ "contains": "${options.filterSearch}" }`);
      }

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          name: true,
          group: true,
          status: true,
        };
      }

      if (options.name) {
        parameters.name = options.name;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const response: object | any = await this.focoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((item: any) => {
        item.group.map((group: any) => {
          if (group.id_safra === Number(options.id_safra)) {
            item.group = (group.group.toString()).length > 1 ? group.group : `0${group.group.toString()}`;
          }
        });
      });

      if (!response || response.total <= 0) {
        return { status: 404, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Foco Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll foco erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) return { status: 400, response: [], message: { message: 'Id não informado' } };

      const response = await this.focoRepository.findOne(id);

      if (response) {
        return { status: 200, response, message: { message: 'Foco encontrado' } };
      }
      return { status: 404, response: [], message: { message: 'Foco não existe' } };
    } catch (error: any) {
      handleError('Foco Controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne foco erro');
    }
  }

  async create(data: any) {
    try {
      const focoAlreadyExists = await this.focoRepository.findByName({ name: data.name, id_culture: data.id_culture });

      if (focoAlreadyExists) return { status: 409, message: 'Foco já existente' };

      const response = await this.focoRepository.create(data);
      if (response) {
        return { status: 200, response, message: { message: 'Foco criado' } };
      }
      return { status: 400, response: [], message: { message: 'Foco não foi criado' } };
    } catch (error: any) {
      handleError('Foco Controller', 'Create', error.message);
      throw new Error('[Controller] - Create foco erro');
    }
  }

  async update(data: UpdateLoteDTO) {
    try {
      const focoExist: any = await this.focoRepository.findOne(data.id);
      if (!focoExist) return { status: 404, message: 'Foco não encontrado' };

      const focoAlreadyExists = await this.focoRepository.findByName({ name: data.name, id_culture: data.id_culture });
      if (focoAlreadyExists) return { status: 409, message: 'Foco já existente' };

      const response = await this.focoRepository.update(data.id, data);
      if (response) {
        return { status: 200, response, message: { message: 'Foco atualizado' } };
      }
      return { status: 400, response: [], message: { message: 'Foco não foi atualizada' } };
    } catch (error: any) {
      handleError('Foco Controller', 'Update', error.message);
      throw new Error('[Controller] - Update foco erro');
    }
  }
}
