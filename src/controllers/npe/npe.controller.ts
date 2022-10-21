import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { NpeRepository } from '../../repository/npe.repository';
import { ReporteRepository } from '../../repository/reporte.repository';
import { GroupController } from '../group.controller';
import { prisma } from '../../pages/api/db/db';
import { ExperimentController } from '../experiment/experiment.controller';

export class NpeController {
  npeRepository = new NpeRepository();

  groupController = new GroupController();

  experimentController = new ExperimentController();

  reporteRepository = new ReporteRepository();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== '2') {
          if (options.filterStatus == '1') {
            parameters.status = JSON.parse('{ "in" : [1, 3]}');
          } else if (options.filterStatus == '4') {
            parameters.status = 1;
          } else {
            parameters.status = Number(options.filterStatus);
          }
        }
      }

      if (options.filterLocal) {
        parameters.local = JSON.parse(`{ "name_local_culture": { "contains": "${options.filterLocal}" } }`);
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

      if (options.filterCodTecnologia) {
        parameters.tecnologia = JSON.parse(`{ "cod_tec": {"contains": "${options.filterCodTecnologia}" } }`);
      }

      if (options.filterEpoca) {
        parameters.epoca = JSON.parse(`{ "contains": "${options.filterEpoca}" }`);
      }

      if (options.filterNPE) {
        parameters.npei = Number(options.filterNPE);
      }

      if (options.id_safra) {
        parameters.safraId = Number(options.id_safra);
      }

      if (options.safraId) {
        parameters.safraId = Number(options.safraId);
      }

      if (options.filterSafra) {
        parameters.safra = JSON.parse(`{ "safraName": { "contains": "${options.filterSafra}" } }`);
      }

      if (options.focoId) {
        parameters.focoId = Number(options.focoId);
      }

      if (options.typeAssayId) {
        parameters.typeAssayId = Number(options.typeAssayId);
      }

      if (options.tecnologiaId) {
        parameters.tecnologiaId = Number(options.tecnologiaId);
      }

      if (options.epoca) {
        parameters.epoca = String(options.epoca);
      }

      if (options.localId) {
        parameters.localId = Number(options.localId);
      }

      if (options.npei) {
        parameters.npei = Number(options.npei);
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

      if (options.filterNpeFinalFrom || options.filterNpeFinalTo) {
        if (options.filterNpeFinalFrom && options.filterNpeFinalTo) {
          parameters.npef = JSON.parse(`{"gte": ${Number(options.filterNpeFinalFrom)}, "lte": ${Number(options.filterNpeFinalTo)} }`);
        } else if (options.filterNpeFinalFrom) {
          parameters.npef = JSON.parse(`{"gte": ${Number(options.filterNpeFinalFrom)} }`);
        } else if (options.filterNpeFinalTo) {
          parameters.npef = JSON.parse(`{"lte": ${Number(options.filterNpeFinalTo)} }`);
        }
      }

      if (options.filterGrpFrom || options.filterGrpTo) {
        if (options.filterGrpFrom && options.filterGrpTo) {
          parameters.group = JSON.parse(` { "some" : {"group": {"gte": ${Number(options.filterGrpFrom)}, "lte": ${Number(options.filterGrpTo)} } , "id_safra": ${Number(options.id_safra)}} }`);
        } else if (options.filterGrpFrom) {
          parameters.group = JSON.parse(`{ "some" : {"group": {"gte": ${Number(options.filterGrpFrom)} } , "id_safra": ${Number(options.id_safra)}} }`);
        } else if (options.filterGrpTo) {
          parameters.group = JSON.parse(` { "some" : {"group": {"lte": ${Number(options.filterGrpTo)} } , "id_safra": ${Number(options.id_safra)}} }`);
        }
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      } else {
        orderBy = '{"prox_npe":"asc"}';
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
          safraId: true,
          localId: true,
          prox_npe: true,
          local: { select: { name_local_culture: true } },
          safra: { select: { safraName: true } },
          foco: { select: { name: true, id: true } },
          epoca: true,
          tecnologia: { select: { name: true, id: true, cod_tec: true } },
          type_assay: { select: { name: true, id: true } },
          group: true,
          npei: true,
          npei_i: true,
          npef: true,
          status: true,
          edited: true,
          npeQT: true,
        };
      }
      const response = await this.npeRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (response.length > 0) {
        const next_available_npe = response[response.length - 1].prox_npe;
        response.map(async (value: any, index: any, elements: any) => {
          const newItem = value;
          const next = elements[index + 1];

          if (next) {
            if (!newItem.npeQT) {
              newItem.npeQT = next.npei_i - newItem.npef;
            }
            newItem.nextNPE = next;
          } else {
            newItem.npeQT = 'N/A';
            newItem.nextNPE = 0;
          }
          newItem.nextAvailableNPE = next_available_npe;
          return newItem;
        });
      }

      if (!response || response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'Nenhuma NPE cadastrada',
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
                                                  WHERE n.safraId = ${data.safra}
                                                  AND n.groupId = ${group.response[0]?.id}
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
      console.log('data');
      console.log(data);
      const response = await this.npeRepository.create(data);

      console.log('response');
      console.log(response);
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
      if (data) {
        const operation = data.status === 1 ? 'Ativação' : 'Inativação';
        const npe = await this.npeRepository.update(data.id, data);
        if (!npe) return { status: 400, message: 'Npe não encontrado' };
        if (data.status === 0 || data.status === 1) {
          const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
          await this.reporteRepository.create({
            madeBy: npe.created_by, module: 'Npe', operation, name: JSON.stringify(npe.safraId), ip: JSON.stringify(ip), idOperation: npe.id,
          });
        }
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

  async delete(data: any) {
    try {
      const { status: statusAssay, response }: any = await this.getOne(Number(data.id));
      if (statusAssay !== 200) return { status: 400, message: 'NPE não encontrada' };
      if (response?.status === 3) return { status: 400, message: 'NPE já sorteada' };

      if (statusAssay === 200) {
        const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
        await this.reporteRepository.create({
          madeBy: data.userId, module: 'NPE', operation: 'Exclusão', name: response.npe, ip: JSON.stringify(ip), idOperation: response.id,
        });
        await this.npeRepository.delete(Number(data.id));
        return { status: 200, message: 'NPE excluída' };
      }
      return { status: 400, message: 'NPE não excluída' };
    } catch (error: any) {
      handleError('NPE controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete NPE erro');
    }
  }
}
