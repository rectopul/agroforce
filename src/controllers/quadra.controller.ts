import { GenotipoRepository } from "src/repository/genotipo.repository";
import { number, object, SchemaOf, string } from 'yup';

interface Genotipo {
  id: number;
  id_culture: number;
  id_tecnologia: number;
  genotipo: string;
  genealogy?: string;
  cruza: string;
  status: number;
  created_by: number;
};

interface UpdateGenotipoLote {
  id: number;
  id_tecnologia: number;
  id_culture: number;
  genotipo: string;
  genealogy?: string;
  cruza: string;
  status: number;
}

type Creategenotipo = Omit<Genotipo, 'id'>;
// type Updategenotipo = Omit<genotipo, 'created_by'>;
export class GenotipoController {
  public readonly required = 'Campo obrigatório';

  genotipoRepository = new GenotipoRepository();

  async listAllGenotipos(options: any) {
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
      } else {
        parameters.status = 1;
      }

      if (options.filterSearch) {
        options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';
        parameters.genotipo  = JSON.parse(options.filterSearch);
        // parameters.cruza = JSON.parse(options.filterSearch);
      }

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] == 'tecnologia') {
            select[objSelect[item]] = true;
          } else { 
            select[objSelect[item]] = true;
          }
        });
        select = Object.assign({}, select);
      } else {
        select = {id: true, genotipo: true, genealogy:true, cruza: true, tecnologia:{select:{name:true}}, status: true};
      }
      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
      }

      if (options.genotipo) {
        parameters.genotipo = options.genotipo;
      }

      if (options.cruza) {
        parameters.cruza = options.cruza;
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
      
      let response: object | any = await this.genotipoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );

      if (!response && response.total <= 0) { 
        return {status: 400, response:[], total: 0, message: 'nenhum resultado encontrado'};
      } else {
        return {status: 200, response, total: response.total}
      }    
    } catch(err) { 
      console.log(err)
      return { status: 400, response: [], total: 0 }
    }   
  }

  async list(id_culture: number) {
    try {
      const data = await this.genotipoRepository.list(id_culture);
      const count = data.length;

      return { status: 200, response: data, total: count };
    } catch {
      return { status: 400, response: [], total: 0 };
    }
  }

  async getOneGenotipo(id: number) {
    try {
      if (!id) throw new Error("Dados inválidos");

      const response = await this.genotipoRepository.findOne(id);

      if (!response) throw new Error("Item não encontrado");

      return {status: 200 , response};
    } catch (err) {
      return {status: 400, message: err}
    }
  }

  async createGenotipo(data: Creategenotipo) {
    try {
      const schema: SchemaOf<Creategenotipo> = object({
        id_culture: number().integer().required(this.required),
        id_tecnologia: number().integer().required(this.required),
        genotipo: string().required(this.required),
        genealogy: string().optional(),
        cruza: string().required(this.required),
        status: number().integer().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      let response = await this.genotipoRepository.create(data);
      return {status: 201, message: "Genealogia cadastrada"}
    } catch(err) {
      console.log(err);
      return {status: 400, message: "Erro no cadastrado"}
    }
  }

  async updategenotipo(data: UpdateGenotipoLote) {
    try {
      // console.log(data);
      const schema: SchemaOf<UpdateGenotipoLote> = object({
        id: number().integer().required(this.required),
        id_tecnologia: number().integer().required(this.required),
        id_culture: number().integer().required(this.required),
        genotipo: string().required(this.required),
        genealogy: string().optional(),
        cruza: string().required(this.required),
        status: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);

      if (!valid) return {status: 400, message: "Dados inválidos"};

      const genotipo: any = await this.genotipoRepository.findOne(data.id);
      
      if (!genotipo) return { status: 400, message: 'Genótipo não encontrado' };

      const loteAlreadyExists = await this.genotipoRepository.findByGenotipo(data.genotipo);

      if (loteAlreadyExists && loteAlreadyExists.id !== genotipo.id) {
        return { status: 400, message: 'Genealogia já cadastra. favor consultar os inativos' }
      }

      genotipo.id_culture = data.id_culture;
      genotipo.id_tecnologia = data.id_tecnologia;
      genotipo.genotipo = data.genotipo;
      genotipo.cruza = data.cruza;
      genotipo.status = data.status;

      await this.genotipoRepository.update(genotipo.id, genotipo);

      return {status: 200, message: "Genótipo atualizado"}
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Erro ao atualizar' }
    }
  }
}
