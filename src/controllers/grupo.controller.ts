import { number, object, SchemaOf, string } from 'yup';
import { GrupoRepository } from '../repository/grupo.repository';


export class GrupoController {
  public readonly required = 'Campo obrigatório';

  grupoRepository = new GrupoRepository();


  async getOne({ id }: any) {
    try {
      const response = await this.grupoRepository.findById(id);

      if (!response) throw new Error('grupo não encontrado');

      return { status: 200, response };
    } catch (e) {
      return { status: 400, message: 'grupo não encontrado' };
    }
  }

  async create(data: any) {
    try {
      const schema: SchemaOf<any> = object({
        id_foco: number().required(this.required),
        id_safra: number().required(this.required),
        grupo: number().required(this.required),
        created_by: number().integer().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: 'Dados inválidos' };

      const grupoAlreadyExists = await this.grupoRepository.findByData(data);

      if (grupoAlreadyExists) return { status: 400, message: 'Dados já cadastrados' };

      await this.grupoRepository.create(data);

      return { status: 201, message: 'grupo cadastrado' };
    } catch (err) {
      return { status: 404, message: 'Erro de cadastro' };
    }
  }

  async update(data: any) {
    try {
      const schema: SchemaOf<any> = object({
        id: number().required(this.required),
        id_safra: number().required(this.required),
        id_foco: number().required(this.required),
        grupo: number().required(this.required),
        created_by: number().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: 'Dados inválidos' };

      const grupo: any = await this.grupoRepository.findById(data.id);

      if (!grupo) return { status: 400, message: 'grupo não existente' };

      await this.grupoRepository.update(data.id, data);

      return { status: 200, message: 'grupo atualizado' };
    } catch (err) {
      console.log(err)
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
          if (objSelect[item] !== 'acao') {
            select[objSelect[item]] = true;
          }
        });
        select = Object.assign({}, select);
      } else {
        select = { id: true, id_safra: true, id_foco: true, foco: { select: { name: true } }, safra: { select: { safraName: true } }, grupo: true, status: true };
      }

      if (options.id_safra) {
        parameters.id_safra = options.id_safra;
      }

      if (options.id_foco) {
        parameters.id_foco = Number(options.id_foco);
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

      const response: object | any = await this.grupoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );


      response.map((item: any) => {
        item.grupo = (item.grupo.toString()).length > 1 ? item.grupo : '0' + item.grupo.toString()
      })



      console.log('response')
      console.log(response)

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
