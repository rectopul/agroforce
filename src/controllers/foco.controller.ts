import { number, object, SchemaOf, string } from 'yup';
import { FocoRepository } from '../repository/foco.repository';

interface LoteDTO {
  id: number;
  name: string;
  created_by: number;
  status: number;
}

type UpdateLoteDTO = Omit<LoteDTO, 'created_by'>;
export class FocoController {
  public readonly required = 'Campo obrigatório';

  focoRepository = new FocoRepository();

  async listAllFocos(options: any) {
    const parameters: object | any = new Object();
    let take; 
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      if (options.filterStatus) {
        if (typeof(options.status) === 'string') {
          options.filterStatus = parseInt(options.filterStatus);
          if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
        } else {
          if (options.filterStatus != 2) parameters.status =parseInt(options.filterStatus);
        }
      }

      if (options.filterSearch) {
        options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';
        parameters.name  = JSON.parse(options.filterSearch);
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
          name:true,
          status: true
        };
      }

      if (options.name) {
        parameters.name = options.name;
      }

      if (options.take) {
        if (typeof(options.take) === 'string') {
          take = parseInt(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof(options.skip) === 'string') {
          skip = parseInt(options.skip);
        } else {
          skip = options.skip;
        }
      }

      if (options.orderBy) {
        orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
      }
      
      let response: object | any = await this.focoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );
      if (!response || response.total <= 0) { 
        return {status: 400, response: [], total: 0}

      } else {
        return {status: 200, response, total: response.total}
      }    
    } catch (err) {
      return {status: 400, message: err}
    }
  };

  async getOneFoco(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.focoRepository.findOne(id);

      if (!response) throw new Error("Item não encontrado");

      return {status: 200 , response};
    } catch (e) {
      return {status: 400, message: 'Item não encontrado'};
    }
  };

  async createFoco(data: any) {
    try {
      const schema: SchemaOf<any> = object({
        name: string().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      const focoAlreadyExists = await this.focoRepository.findByName(data.name);

      if (focoAlreadyExists) return {status: 400, message: "Foco já existente"};

      await this.focoRepository.create(data);

      return {status: 201, message: "Foco cadastrado"}
    } catch(err) {
      return { status: 404, message: "Erro no cadastrado"}
    }
  };

  async updateFoco(data: UpdateLoteDTO) {
    try {
      const schema: SchemaOf<UpdateLoteDTO> = object({
        id: number().integer().required(this.required),
        name: string().required(this.required),
        status: number().integer().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      const foco = await this.focoRepository.findOne(data.id);

      if (!foco) return {status: 400, message: "Foco não encontrado"};

      const focoAlreadyExists = await this.focoRepository.findByName(data.name);

      if (focoAlreadyExists && focoAlreadyExists.id !== foco.id) {
        return {status: 400, message: "Foco já existente"};
      }

      foco.name = data.name;
      foco.status = data.status;

      await this.focoRepository.update(data.id, foco);

      return {status: 200, message: "Foco atualizado"}
    } catch (err) {
      return { status: 404, message: "Erro ao atualizar" }
    }
  };
};
