import { number, object, SchemaOf, string } from 'yup';
import { LoteRepository } from '../repository/lote.repository';
interface LoteDTO {
  id: number;
  id_genotipo: number;
  name: string;
  volume: number;
  created_by: number;
  status: number;
}

type CreateLoteDTO = Omit<LoteDTO, 'id' | 'status'>;
type UpdateLoteDTO = Omit<LoteDTO, 'created_by' | 'id_genotipo'>;
type FindOne = Omit<LoteDTO, 'name' | 'id_genotipo' | 'volume' | 'created_by' | 'status'>;

export class LoteController {
  public readonly required = 'Campo obrigatório';

  loteRepository = new LoteRepository();


  async getOne({ id }: FindOne) {
    try {
      const schema: SchemaOf<FindOne> = object({
        id: number().integer().required(this.required)
      });

      if (!schema) throw new Error('Dados inválidos');

      const response = await this.loteRepository.findById(id);

      if (!response) throw new Error('Lote não encontrado');

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'Lote não encontrado' };
    }
  }

  async create(data: CreateLoteDTO) {
    try {
      const schema: SchemaOf<CreateLoteDTO> = object({
        id_genotipo: number().required(this.required),
        name: string().required(this.required),
        volume: number().required(this.required),
        created_by: number().integer().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: 'Dados inválidos' };

      const loteAlreadyExists = await this.loteRepository.findByName(data.name);

      if (loteAlreadyExists) {
        return { status: 400, message: 'Nome do lote já cadastro. favor consultar os inativos' };
      }

      await this.loteRepository.create(data);

      return { status: 201, message: 'Lote cadastrado' };
    } catch (err) {
      return { status: 404, message: 'Erro de cadastro' };
    }
  }

  async update(data: UpdateLoteDTO) {
    try {
      const schema: SchemaOf<UpdateLoteDTO> = object({
        id: number().integer().required(this.required),
        name: string().required(this.required),
        volume: number().required(this.required),
        status: number().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: 'Dados inválidos' };

      const lote = await this.loteRepository.findById(data.id);

      if (!lote) return { status: 400, message: 'Lote não existente' };

      const loteAlreadyExists = await this.loteRepository.findByName(data.name);

      if (loteAlreadyExists && loteAlreadyExists.id !== lote.id) {
        return { status: 400, message: 'Esse item já está cadastro. favor consultar os inativos' };
      }

      lote.name = data.name;
      lote.volume = data.volume;
      lote.status = data.status;

      await this.loteRepository.update(data.id, lote);

      return { status: 200, message: 'Lote atualizado' };
    } catch (err) {
      return { status: 404, message: 'Erro ao atualizar' };
    }
  }

  async listAll(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any = '';
    let select: any = [];
    let include: any;

    try {
      if (options.filterStatus) {
        if (typeof (options.status) === 'string') {
          options.filterStatus = parseInt(options.filterStatus);
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        } else {
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        }
      }

      if (options.filterGenotipo) {
        options.filterGenotipo = `{ "genotipo": { "contains":"${options.filterGenotipo}" } }`;
        parameters.genotipo = JSON.parse(options.filterGenotipo);
      }

      if (options.filterName) {
        options.filterName = `{ "contains":"${options.filterName}" }`;
        parameters.name = JSON.parse(options.filterName);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = Object.assign({}, select);
      } else {
        select = { id: true, genotipo: { select: { genotipo: true } }, volume: true, name: true, status: true };
      }

      if (options.genotipo) {
        parameters.genotipo = options.genotipo;
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.id_genotipo) {
        parameters.id_genotipo = Number(options.id_genotipo);
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
        orderBy = `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.loteRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      } else {
        return { status: 200, response, total: response.total };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, response: [], total: 0 };
    }
  }
}
