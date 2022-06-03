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
          if (options.filterStatus !== 2) parameters.status = parseInt(options.filterStatus);
        } else {
          if (options.filterStatus !== 2) parameters.status = parseInt(options.filterStatus);
        }
      }

      if (options.filterSearch) {
        options.filterSearch = '{"contains":"' + options.filterSearch + '"}';
        parameters.name = JSON.parse(options.filterSearch);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = Object.assign({}, select);
      } else {
        select = { id: true, name: true, status: true };
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

      let response = await this.typeAssayRepository.findAll(parameters, select, take, skip, orderBy);

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0, message: 'nenhum resultado encontrado' }
      } else {
        return { status: 200, response, total: response.total }
      }
    } catch (err) {
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

  async getAssayTypeByName({ name }) {
    try {
      const response = await this.typeAssayRepository.findOneByName(name)
      return response
    } catch (err) {
      console.log(err);
    }
  }

  async post(data: object | any) {
    try {
      const assayTypeAlreadyExist = await this.getAssayTypeByName(data)
      if (assayTypeAlreadyExist) return { status: 400, message: "Tipo de ensaio já existe" }
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
      const assayTypeAlreadyExist = await this.getAssayTypeByName(data)
      if (assayTypeAlreadyExist) return { status: 400, message: "Tipo de ensaio já existe" }
      if (typeof (data.status) === 'string') {
        parameters.status = parseInt(data.status);
      } else {
        parameters.status = data.status;
      }

      if (data.name) parameters.name = data.name;
      if (data.status) parameters.status = data.status;
      if (data !== null && data !== undefined) {
        const response = await this.typeAssayRepository.update(data.id, parameters);
        if (response) {
          return { status: 200, message: { message: "layoult atualizado" } }
        } else {
          return { status: 400, message: { message: "erro ao tentar fazer o update" } }
        }
      }
    } catch (err) {

    }
  }
}
