import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { NpeRepository } from '../../repository/npe.repository';
import { GroupController } from '../group.controller';
import { prisma } from '../../pages/api/db/db';

export class NpeController {
  npeRepository = new NpeRepository();

  groupController = new GroupController();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterLocal) {
        parameters.local = JSON.parse(`{ "name_local_culture": { "contains": "${options.filterLocal}" } }`);
      }

      if (options.filterSafra) {
        parameters.safra = JSON.parse(`{ "safraName": { "contains": "${options.filterSafra}" } }`);
      }

      if (options.filterFoco) {
        parameters.foco = JSON.parse(`{ "name": { "contains": "${options.filterFoco}" } }`);
      }

      if (options.filterEnsaio) {
        parameters.type_assay = JSON.parse(`{ "name": { "contains": "${options.filterEnsaio}" } }`);
      }

      if (options.filterTecnologia) {
        parameters.tecnologia = JSON.parse(`{ "name": {"contains": "${options.filterTecnologia}" } }`);
      }

      if (options.filterEpoca) {
        parameters.epoca = JSON.parse(`{ "contains": "${options.filterEpoca}" }`);
      }

      if (options.filterNPE) {
        parameters.npei = Number(options.filterNPE);
      }

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.id_foco) {
        parameters.id_foco = Number(options.id_foco);
      }

      if (options.id_type_assay) {
        parameters.id_type_assay = Number(options.id_type_assay);
      }

      if (options.id_ogm) {
        parameters.id_ogm = Number(options.id_ogm);
      }

      if (options.epoca) {
        parameters.epoca = String(options.epoca);
      }

      if (options.id_local) {
        parameters.id_local = Number(options.id_local);
      }

      if (options.filterNpeFrom || options.filterNpeTo) {
        if (options.filterNpeFrom && options.filterNpeTo) {
          parameters.npei = JSON.parse(`{"gte": ${Number(options.filterNpeFrom)}, "lte": ${Number(options.filterNpeTo)} }`);
        } else if (options.filterNpeFrom) {
          parameters.npei = JSON.parse(`{"gte": ${Number(options.filterNpeFrom)} }`);
        } else if (options.filterNpeTo) {
          parameters.npei = JSON.parse(`{"lte": ${Number(options.filterNpeTo)} }`);
        }
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      } else {
        orderBy = '{"npei":"asc"}';
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] === 'ensaio') {
            select.type_assay = true;
          } else {
            select[objSelect[item]] = true;
          }
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          id_safra: true,
          id_local: true,
          local: { select: { name_local_culture: true } },
          safra: { select: { safraName: true } },
          foco: { select: { name: true } },
          type_assay: { select: { name: true } },
          tecnologia: { select: { name: true } },
          group: { select: { group: true } },
          npei: true,
          npef: true,
          epoca: true,
          status: true,
        };
      }

      const response = await this.npeRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((value: any, index: any, elements: any) => {
        const newItem = value;
        const next = elements[index + 1];
        if (next) {
          newItem.consumedQT = next.npei - newItem.npei;
          newItem.nextNPE = next.npei;
        } else {
          newItem.consumedQT = 0;
          newItem.nextNPE = 0;
        }
        return newItem;
      });

      if (!response || response.total <= 0) {
        return {
          status: 404, response: [], total: 0, message: 'Nenhuma NPE cadastrada',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('NPE Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll NPE erro');
    }
  }

  async getOne(id: number) {
    try {
      if (id) {
        const response = await this.npeRepository.findOne(id);
        if (response) {
          return { status: 200, response };
        }
        return { status: 404, response: [], message: 'Npe não existe' };
      }
      return { status: 405, response: [], message: 'Id da Npe não informado' };
    } catch (error: any) {
      handleError('NPE Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne NPE erro');
    }
  }

  async validateNpeiDBA(data: any) {
    try {
      if (data.safra) {
        const group: any = await this.groupController.getAll(
          { id_safra: data.safra, id_foco: data.foco },
        );
        if (group.response.length > 0) {
          const safra: any = await prisma.$queryRaw`SELECT npei
                                                  FROM npe n
                                                  WHERE n.id_safra = ${data.safra}
                                                  AND n.id_group = ${group.response[0]?.id}
                                                  AND n.npei = ${data.npei}
                                                  AND n.status = ${1}
                                                  ORDER BY npei DESC 
                                                  LIMIT 1`;
          if ((safra[0])) {
            return { message: `<li style="text-align:left">A ${data.Column}º coluna da ${data.Line}º linha está incorreta, NPEI ja cadastrado dentro do grupo ${group.response[0]?.group}</li><br>`, erro: 1 };
          }
        } else {
          return { message: `<li style="text-align:left">A ${data.Column}º coluna da ${data.Line}º linha está incorreta, todos os focos precisam ter grupos cadastrados nessa safra</li><br>`, erro: 1 };
        }
      }
      return { erro: 0 };
    } catch (error: any) {
      handleError('NPE Controller', 'Validate', error.message);
      throw new Error('[Controller] - Validate NPE erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.npeRepository.create(data);
      if (response) {
        return { status: 200, response, message: 'NPE criada' };
      }
      return { status: 400, response: [], message: 'NPE não criada' };
    } catch (error: any) {
      handleError('NPE Controller', 'Create', error.message);
      throw new Error('[Controller] - Create NPE erro');
    }
  }

  async update(data: any) {
    try {
      if (data.status === 0 || data.status === 1) {
        const npe = await this.npeRepository.update(data.id, data);
        if (!npe) return { status: 400, message: 'Npe não encontrado' };
        return { status: 200, message: 'Npe atualizada' };
      }
      const npeExist = await this.getOne(data.id);
      if (!npeExist) return npeExist;
      const response = await this.npeRepository.update(data.id, data);
      if (response) {
        return { status: 200, response, message: { message: 'NPE atualizado' } };
      }
      return { status: 400, response: [], message: { message: 'NPE não foi atualizada' } };
    } catch (error: any) {
      handleError('NPE Controller', 'Update', error.message);
      throw new Error('[Controller] - Update NPE erro');
    }
  }
}
