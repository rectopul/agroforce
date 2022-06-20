import { TypeAssayRepository } from '../repository/tipo-ensaio.repository';

export class TypeAssayController {
  typeAssayRepository = new TypeAssayRepository();

  async getAll(options: object | any) {
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

      if (options.filterSearch) {
        options.filterSearch = '{"contains":"' + options.filterSearch + '"}';
        parameters.name = JSON.parse(options.filterSearch);
      }

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] === "seeds") {
            select["type_assay_children"] = true
          } else {
            select[objSelect[item]] = true;
          }
        });
        select = Object.assign({}, select);
      } else {
        select = { id: true, name: true, status: true, type_assay_children: true };
      }

      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
      }

      if (options.name) {
        parameters.name = options.name;
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
        orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
      }



      const response = await this.typeAssayRepository.findAll(parameters, select, take, skip, orderBy);

      response.map((item: any) => {
        item.type_assay_children.map((seed: any) => {
          //console.log(seeds.id_safra === Number(options.id_safra))          
          //item.foco_children = (seeds.id_safra === Number(options.id_safra)) ? seeds.grupo
          if (seed.id_safra === Number(options.id_safra)) {
            item.seeds = seed.seeds
          }
        })
      })

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0, message: 'nenhum resultado encontrado' }
      } else {
        return { status: 200, response, total: response.total }
      }
    } catch (err) {
      console.log(err)
      return { status: 400, response: [], total: 0, message: 'nenhum resultado encontrado' }
    }
  }

  async getOne(id: string) {
    const newID = parseInt(id);
    try {
      if (id && id !== '{id}') {
        const response = await this.typeAssayRepository.findOne(newID);
        if (!response) {
          return { status: 400, response: [], message: 'local não existe' };
        } else {
          return { status: 200, response: response };
        }
      } else {
        return { status: 405, response: [], message: 'id não informado' };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getAssayTypeByName(name: any) {
    try {
      const response = await this.typeAssayRepository.findOneByName(name)
      return response
    } catch (err) {
      console.log(err);
    }
  }

  async post(data: object | any) {
    try {
      const assayTypeAlreadyExist = await this.getAll({ name: data.name, id_culture: data.id_culture })
      if (assayTypeAlreadyExist.response?.length > 0) return { status: 400, message: "Tipo de ensaio já existe" }
      if (data !== null && data !== undefined) {
        const response = await this.typeAssayRepository.create(data);
        if (response) {
          return { status: 200 }
        } else {
          return { status: 400, message: "Erro ao cadastrar tipo de ensaio" }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async update(data: any) {
    const parameters: object | any = {};
    try {
      if (data.name) {
        const assayTypeAlreadyExist = await this.getAssayTypeByName(data.name)
        if (assayTypeAlreadyExist) return { status: 400, message: "Tipo de ensaio já existe" }
        const response = await this.typeAssayRepository.update(data.id, data);
        if (response) {
          return { status: 200, message: { message: "Tipo de ensaio atualizado" } }
        } else {
          return { status: 400, message: { message: "erro ao tentar fazer o update" } }
        }
      } else {
        this.setStatus(data.id, data.status)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async setStatus(id: number, status: number) {
    try {
      const response = await this.typeAssayRepository.updateStatus(id, status)
      if (response) {
        return { status: 200, response: response, message: "Status Atualizado" }
      } else {
        return { status: 400, response: response, message: "Erro ao atualizar o status" }
      }
    } catch (err) {
      console.log(err)
    }
  }
}
