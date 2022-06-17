import { number, object, SchemaOf, string } from 'yup';
import { LocalRepository } from '../repository/local.repository';
export class LocalController {
  localRepository = new LocalRepository();
  public readonly required = 'Campo obrigatório';

  async getUFs() {
    try {
      const parameters: object | any = {};
      let take;
      let skip;
      let orderBy: object | any;
      let select: any = { nome: true, id: true, sigla: true };
      return this.localRepository.findUFs(parameters, select, take, skip, orderBy);
    } catch (e) {
      return { status: 400, message: "estado não encontrada" }
    }
  }


  async getOnUFs(id: Number | any) {
    try {
      const response = await this.localRepository.findOneUFs(id);
      if (response) {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw new Error('Não encontrado');
    }
  }


  async getCitys(ufId: number | any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = { nome: true, id: true, ufid: true };

    try {
      if (ufId) {
        parameters.ufid = parseInt(ufId);
      }
      return this.localRepository.findCitys(parameters, select, take, skip, orderBy);
    } catch (err) {
      throw new Error('Cidade não encontrada')
    }
  }


  async getAllLocal(options: object | any) {
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

      if (options.filterName_local_culture) {
        options.filterName_local_culture = `{ "contains":"${options.filterName_local_culture}" }`;
        parameters.name_local_culture = JSON.parse(options.filterName_local_culture);
      }

      if (options.filterLabel) {
        options.filterLabel = `{ "contains":"${options.filterLabel}" }`;
        parameters.label = JSON.parse(options.filterLabel);
      }

      if (options.filterAdress) {
        options.filterAdress = `{ "contains":"${options.filterAdress}" }`;
        parameters.adress = JSON.parse(options.filterAdress);
      }

      if (options.filterLabel_country) {
        options.filterLabel_country = `{ "contains":"${options.filterLabel_country}" }`;
        parameters.label_country = JSON.parse(options.filterLabel_country);
      }

      if (options.filterLabel_region) {
        options.filterLabel_region = `{ "contains":"${options.filterLabel_region}" }`;
        parameters.label_region = JSON.parse(options.filterLabel_region);
      }

      if (options.filterName_locality) {
        options.filterName_locality = `{ "contains":"${options.filterName_locality}" }`;
        parameters.name_locality = JSON.parse(options.filterName_locality);
      }


      if (options.id_local_culture) {
        parameters.id_local_culture = Number(options.id_local_culture);
      }

      if (options.name_local_culture) {
        parameters.name_local_culture = options.name_local_culture;
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

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = Object.assign({}, select);
      } else {
        select = { id: true, name_local_culture: true, label: true, mloc: true, label_country: true, label_region: true, name_locality: true, adress: true, status: true };
      }

      const response = await this.localRepository.findAll(parameters, select, take, skip, orderBy);
      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      } else {
        return { status: 200, response, total: response.total };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, message: err };
    }
  }


  async getOneLocal({ id }: any) {
    const newID = parseInt(id);
    try {
      if (id) {
        const response = await this.localRepository.findOne(newID);
        if (!response) {
          return { status: 400, response: [], message: 'local não existe' };
        } else {
          return { status: 200, response: response };
        }
      } else {
        return { status: 405, response: { error: 'id não informado' } };
      }
    } catch (err) {
      return { status: 400, message: err }
    }
  }

  async postLocal(data: object | any) {
    try {
      console.log("Create")
      console.log(data);
      if (data !== null && data !== undefined) {
        // if (data.uf) {
        //     let uf = await this.getOnUFs(parseInt(data.uf));
        //     data.uf = uf?.sigla;
        // }
        const response = await this.localRepository.create(data);
        if (response) {
          return { status: 200, response: response, message: "local inserido" }
        } else {
          return { status: 400, message: "erro" }

        }
      }
    } catch (err) {
      console.log(err)
      return { status: 400, message: "Erro no cadastro" }
    }
  }

  async updateLocal(data: any) {
    try {
      console.log("Update")
      console.log(data);
      const schema: SchemaOf<any> = object({
        id: number().required(this.required),
        id_local_culture: number().required(this.required),
        name_local_culture: string().required(this.required),
        label: string().required(this.required),
        mloc: string().required(this.required),
        adress: string().required(this.required),
        id_locality: number().required(this.required),
        name_locality: string().required(this.required),
        id_region: number().required(this.required),
        name_region: string().required(this.required),
        label_region: string().required(this.required),
        id_country: number().required(this.required),
        name_country: string().required(this.required),
        label_country: string().required(this.required),
        created_by: number().integer().required(this.required)
      });

      const valid = schema.isValidSync(data);

      if (!valid) return { status: 400, message: 'Dados inválidos' };

      const localCultura: any = await this.localRepository.findOne(data.id);

      if (!localCultura) return { status: 400, message: 'Local de cultura não existente' };

      await this.localRepository.update(data.id, data);

      return { status: 200, message: 'Local de cultura atualizado' };
    } catch (err) {
      console.log(err)
      return { status: 404, message: 'Erro ao atualizar' };
    }
  }
}
