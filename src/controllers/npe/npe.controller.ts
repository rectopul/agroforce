import { TransactionConfig } from 'src/shared/prisma/transactionConfig';
import createXls from 'src/helpers/api/xlsx-global-download';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { NpeRepository } from '../../repository/npe.repository';
import { ReporteRepository } from '../../repository/reporte.repository';
import { GroupController } from '../group.controller';
import { prisma } from '../../pages/api/db/db';
import { ExperimentController } from '../experiment/experiment.controller';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';
import { ExperimentGenotipeController } from '../experiment-genotipe.controller';
import { ReporteController } from '../reportes/reporte.controller';
// import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';

export class NpeController {
  npeRepository = new NpeRepository();

  groupController = new GroupController();

  experimentController = new ExperimentController();

  experimentGenotipe = new ExperimentGenotipeController();

  reporteController = new ReporteController();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    parameters.AND = [];
    let orderBy: object | any;
    let select: any = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'AMBIENTE-AMBIENTE');
        return { status: 200, response: sheet };
      }

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
        parameters.AND.push(JSON.parse(`{ "tecnologia": { "name": {"contains": "${options.filterTecnologia}" } } }`));
      }

      if (options.filterCodTecnologia) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": { "cod_tec": {"contains": "${options.filterCodTecnologia}" } } }`));
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
          parameters.prox_npe = JSON.parse(`{"gte": ${Number(options.filterNpeFinalFrom)}, "lte": ${Number(options.filterNpeFinalTo)} }`);
        } else if (options.filterNpeFinalFrom) {
          parameters.prox_npe = JSON.parse(`{"gte": ${Number(options.filterNpeFinalFrom)} }`);
        } else if (options.filterNpeFinalTo) {
          parameters.prox_npe = JSON.parse(`{"lte": ${Number(options.filterNpeFinalTo)} }`);
        }
      }

      if (options.filterGrpFrom || options.filterGrpTo) {
        if (options.filterGrpFrom && options.filterGrpTo) {
          parameters.group = JSON.parse(` {"group": {"gte": ${Number(options.filterGrpFrom)}, "lte": ${Number(options.filterGrpTo)} } }`);
        } else if (options.filterGrpFrom) {
          parameters.group = JSON.parse(`{"group": {"gte": ${Number(options.filterGrpFrom)} } }`);
        } else if (options.filterGrpTo) {
          parameters.group = JSON.parse(` {"group": {"lte": ${Number(options.filterGrpTo)} } }`);
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
        Object.keys(objSelect).forEach((item: any) => {
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
          safra: { select: { safraName: true, culture: true } },
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
        /**
         * ATENÇÃO CASO O USUÁRIO ORDENE OS AMBIENTES POR QUALQUER OUTRO CAMPO QUE NÃO SEJA O PROX_NPE
         * CARREGAR O NEXT_NPE DE CADA AMBIENTE SEPARADAMENTE
         */
        if(orderBy !== '{"prox_npe":"asc"}') {
          
          for(const npe of response) {
            
            if(typeof npe === 'object') {
              
              const orderByAux = '{"prox_npe":"asc"}';
              const parametersAux: object | any = {};
              parametersAux.AND = [];
              parametersAux.npei = JSON.parse(`{"gt": ${Number(npe.npei)} }`);
              parametersAux.group = { "group": { "equals": Number(npe.group?.id) } };
              
              const responseNextNPE = await this.npeRepository.findAll(
                parametersAux,
                select,
                1,
                0,
                orderByAux,
              );
              
              if(responseNextNPE.length > 0) {
                const next = responseNextNPE[0];
                if (!npe.npeQT) {
                  npe.npeQT = next.npei_i - npe.npef; // quantidade disponivel
                }
                npe.npeRequisitada = 0; // quantidade a ser consumida (contagem de experimentos)
                npe.nextNPE = next;
              } else {
                npe.npeQT = 'N/A';
                npe.nextNPE = 0;
                npe.npeRequisitada = 0;
              }
              
            }
            
          }
          
        } else {
          const next_available_npe = response[response.length - 1].prox_npe;// proximo npe disponivel
          response.map(async (value: any, index: any, elements: any) => {
            const newItem = value;
            const { id } = newItem;
            const groupId = newItem.group?.id;
            // const next = elements[index + 1]; // FIXED: desta forma você não consegue pegar o proximo elemento verificando se está no mesmo grupo;
            // find groupId next element in elements with same group.id
            const next = elements.find((item: any, idx:any) => item.group?.id === groupId && idx > index);

            if (next) {
              /**
               * SELECT @npei_search:= MIN(npe.npei) as next_npe
               * FROM npe
               * WHERE (npe.npei >= @npe)
               * AND NOT EXIST(SELECT n2.id FROM npe n2 WHERE n2.id = npe.id)
               * GROUP BY npe.safraId, npe.groupId
               * HAVING ((npe.safraId = @safra AND npe.groupId = @grupo));
               *
               */

              if (!newItem.npeQT) {
                newItem.npeQT = next.npei_i - newItem.npef; // quantidade disponivel
              }
              newItem.npeRequisitada = 0; // quantidade a ser consumida (contagem de experimentos)
              newItem.nextNPE = next;
              // newItem.npefView = newItem.npef;
            } else {
              newItem.npeQT = 'N/A';
              newItem.nextNPE = 0;
              newItem.npeRequisitada = 0;
              // newItem.npefView = newItem.npef;
            }
            newItem.nextAvailableNPE = next_available_npe;
            return newItem;
          });
        }
        
      }

      for (let i = 0; i < response.length; i++) {
        const item = response[i];

        const optionsNPE = {
          npe_id: item.id,
          safra: item.safraId,
          grupo: item.group.id,
          prox_npe: item.prox_npe,
        };

        const { stat, res, msg } = await this.getMinNPE(optionsNPE);

        if (stat == 200) {
          let minorNPE = null;
          for (let j = 0; j < res.length; j++) {
            const npe_x_exp = res[j];
            if (minorNPE == null) {
              minorNPE = npe_x_exp.prox_npe;
            } else if (npe_x_exp.prox_npe < minorNPE) {
              minorNPE = npe_x_exp.prox_npe;
            }
          }
          // 185 (minorNPE) - 179 (prox_npe) = 6
          // 201 (minorNPE) - 179 (prox_npe) = 22
          if ((typeof item.nextNPE === 'object' || item.nextNPE === null) && minorNPE !== null) {
            item.npeQT = minorNPE - item.prox_npe;
          } else {
            item.npeQT = 'N/A';
          }
        }
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

  async getMinNPE(options: any) {
    const { npe_id } = options;
    const { prox_npe } = options;
    const { safra } = options;
    const { grupo } = options;

    /**
     * @todo: carrega nas parcelas do exp. >= 179
     * MIN(npe)
     * WHERE npe >= 179
     * RESUlTADO: 185 das parcelas
     */

    /**
     * no cadastro de amb
     * MIN(prox_npe) where prox_npe >= 179 AND NOT EXISTS(SELECT n2.id FROM npe n2 WHERE n2.id = n.id)
     * RESULTADO: 279
     *
     * 185 - 179(prox_npe) = 6
     */

    try {
      const response: any = await prisma.$queryRaw`SELECT * FROM (
        (
        # consulta todas as parcelas onde pega o primeiro npe lançado acima do prox_npe do ambiente
        SELECT MIN(x1.npe) as prox_npe,
        'experiment_genotipe' as ref,
        'parcelas' as apelido
        FROM experiment_genotipe x1
        WHERE 1=1
        AND x1.npe >= ${prox_npe}
        GROUP BY x1.idSafra, x1.groupId
        HAVING ((x1.idSafra = ${safra} AND x1.groupId = ${grupo}))
        )
      
      UNION
      
        (
        # consulta que pega menor npe utilizado
        SELECT MIN(npe.prox_npe) as prox_npe,
            'npe' as referencia,
            'ambiente' as apelido
        FROM npe 
        WHERE 1=1
            AND (npe.prox_npe >= ${prox_npe}) 
            AND npe.id <> ${npe_id}
        GROUP BY npe.safraId, npe.groupId
        HAVING ((npe.safraId = ${safra} AND npe.groupId = ${grupo}))
        )
    ) as x
    ORDER BY x.prox_npe ASC`;

      if (response) {
        return { stat: 200, res: response, msg: 'NPE encontrada' };
      }

      return { stat: 405, res: [], msg: 'Id da Npe não informado' };
    } catch (error: any) {
      handleError('getMinNpe Controller', 'getMinNpe', error.message);
      throw new Error('[Controller] - getMinNpe NPE erro');
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
      if (data) {
        if (data.length === undefined) {
          const operation = data.status === 1 ? 'ATIVAÇÃO' : 'INATIVAÇÃO';
          const npe = await this.npeRepository.update(data.id, data);
          if (!npe) return { status: 400, message: 'Npe não encontrado' };
          if (data.status === 0 || data.status === 1) {
            const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
            // await this.reporteRepository.create({
            //   madeBy: npe.created_by, module: 'Npe', operation, name: JSON.stringify(npe.safraId), ip: JSON.stringify(ip), idOperation: npe.id,
            // });
          }
          return { status: 200, message: 'Npe atualizada' };
        }
        const transactionConfig = new TransactionConfig();
        const npeRepositoryTransaction = new NpeRepository();
        npeRepositoryTransaction.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
        try {
          await transactionConfig.transactionScope.run(async () => {
            for (const row in data) {
              await npeRepositoryTransaction.updateTransaction(data[row].id, data[row]);
            }
          });
          return { status: 200, message: 'Npe atualizada' };
        } catch (error: any) {
          handleError('NPE Controller', 'Update', error.message);
          throw new Error('[Controller] - Update NPE erro');
        }
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
        await this.reporteController.create({
          userId: data.userId, module: 'AMBIENTE', operation: 'EXCLUSÃO', oldValue: response.npei, ip: String(ip),
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
