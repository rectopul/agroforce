import { NpeRepository } from '../repository/npe.repository';
import { GrupoController } from '../controllers/grupo.controller';
import { prisma } from '../pages/api/db/db';

export class NpeController {
  Repository = new NpeRepository();
  groupoController = new GrupoController();

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

      if (options.filterLocal) {
        options.filterLocal = `{ "name_local_culture": { "contains": "${options.filterLocal}" } }`
        parameters.local = JSON.parse(options.filterLocal);
      }

      if (options.filterSafra) {
        options.filterSafra = `{ "safraName": { "contains": "${options.filterSafra}" } }`
        parameters.safra = JSON.parse(options.filterSafra);
      }

      if (options.filterFoco) {
        options.filterFoco = `{ "name": { "contains": "${options.filterFoco}" } }`
        parameters.foco = JSON.parse(options.filterFoco);
      }

      if (options.filterEnsaio) {
        options.filterEnsaio = `{ "name": { "contains": "${options.filterEnsaio}" } }`
        parameters.type_assay = JSON.parse(options.filterEnsaio);
      }

      if (options.filterTecnologia) {
        options.filterTecnologia = `{ "name": {"contains": "${options.filterTecnologia}" } }`
        parameters.tecnologia = JSON.parse(options.filterTecnologia);
      }

      if (options.filterEpoca) {
        options.filterEpoca = `{ "contains": "${options.filterEpoca}" }`
        parameters.epoca = JSON.parse(options.filterEpoca);
      }

      if (options.filterNPE) {
        parameters.npei = parseInt(options.filterNPE);
      }

      if (options.id_safra && options.id_safra > 0) {
        parameters.id_safra = parseInt(options.id_safra);
      }

      if (options.id_foco && options.id_foco > 0) {
        parameters.id_foco = parseInt(options.id_foco);
      }

      if (options.id_type_assay && options.id_type_assay > 0) {
        parameters.id_type_assay = parseInt(options.id_type_assay);
      }

      if (options.id_ogm && options.id_ogm > 0) {
        parameters.id_ogm = parseInt(options.id_ogm);
      }

      if (options.epoca && options.epoca > 0) {
        parameters.epoca = String(options.epoca);
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

      if (options.paramSelect) {
        let objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] === 'ensaio') {
            select['type_assay'] = true;
          } else {
            select[objSelect[item]] = true;
          }
        });
        select = Object.assign({}, select);
      } else {
        select = { id: true, local: { select: { name_local_culture: true } }, safra: { select: { safraName: true } }, foco: { select: { name: true } }, epoca: true, tecnologia: { select: { name: true } }, type_assay: { select: { name: true } }, npei: true, npef: true, status: true };
      }

      let response = await this.Repository.findAll(parameters, select, take, skip, orderBy);

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0, message: 'nenhum resultado encontrado' }
      } else {
        return { status: 200, response, total: response.total }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOne(id: string) {
    let newID = parseInt(id);
    try {
      if (id && id !== '{id}') {
        let response = await this.Repository.findOne(newID);
        if (!response) {
          return { status: 400, response: [], message: 'local não existe' };
        } else {
          return { status: 200, response: response };
        }
      } else {
        return { status: 405, response: [], message: 'id não informado' };
      }
    } catch (err) {

    }
  }

  async validateNpeiDBA(data: any) {
    try {
      if (data.safra) {
        let group: any = await this.groupoController.listAll({ id_safra: data.safra, id_foco: data.foco });
        if (group.total > 0) {
          let safra: any = await prisma.$queryRaw`SELECT npei
                                                  FROM npe n
                                                  WHERE n.id_safra = ${data.safra}
                                                  AND n.group = ${group.response[0].grupo}
                                                  AND n.npei = ${data.npei}
                                                  ORDER BY npei DESC 
                                                  LIMIT 1`;
          if ((safra[0])) {
            return `<span>A ${data.Column}º coluna da ${data.Line}º linha está incorreta, NPEI ja cadastrado dentro do grupo ${group.response[0].grupo}</span><br>`;
          }
        } else {
          return `<span>A ${data.Column}º coluna da ${data.Line}º linha está incorreta, todos os focos precisam ter grupos cadastrados nessa safra</span><br>`;
        }
      }
      return "";
    } catch (err) {
      console.log(err);
    }
  }

  async post(data: object | any) {
    try {
      if (data !== null && data !== undefined) {
        let response = await this.Repository.create(data);
        if (response) {
          return { status: 200, message: "itens inseridos" }
        } else {
          return { status: 400, message: "erro" }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  async update(data: any) {
    const parameters: object | any = {};

    try {
      if (typeof (data.status) === 'string') {
        parameters.status = parseInt(data.status);
      } else {
        parameters.status = data.status;
      }

      if (data.name) parameters.name = data.name;
      if (data.status) parameters.status = data.status;
      if (data !== null && data !== undefined) {
        let response = await this.Repository.update(data.id, parameters);
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
