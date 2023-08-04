/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import { ExperimentGenotipeRepository } from 'src/repository/experiment-genotipe.repository';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { IReturnObject } from '../interfaces/shared/Import.interface';
import handleError, { SemaforoError } from '../shared/utils/handleError';
import { ExperimentGroupController } from './experiment-group/experiment-group.controller';
import { ExperimentController } from './experiment/experiment.controller';
import { ReporteController } from './reportes/reporte.controller';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';
import { prisma } from '../pages/api/db/db';
import { NpeController } from './npe/npe.controller';
import { SemaforoController } from "./semaforo.controller";

import { PrismaClientManager } from "../shared/prisma/prismaClientManager";
import { TransactionScope } from "../shared/prisma/transactionScope";
import { PrismaTransactionScope } from "../shared/prisma/prismaTransactionScope";

interface ICreateParams {
  experiment_genotipo: any[];
  gt: any[];
  experimentObj: any[];
  npeToUpdate: any[];
  userId: number;
  sessao: string;
}


export class ExperimentGenotipeController {
  private ExperimentGenotipeRepository = new ExperimentGenotipeRepository();

  private experimentController = new ExperimentController();

  private experimentGroupController = new ExperimentGroupController();

  private reporteController = new ReporteController();

  private semaforoController = new SemaforoController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    const equalsOrContains = options.importValidate ? 'equals' : 'contains';
    parameters.AND = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await this.createXls(options);
        return { status: 200, response: sheet };
      }

      if (options.filterGroupIds) {
        
        // `{ "safra": {"safraName": {"contains": "${options.safraName}" } } }`,
        
        let groupIdsArray = [];
        if(typeof options.filterGroupIds === 'string') {
          groupIdsArray = options.filterGroupIds.split(',');
        } 
        else if(typeof options.filterGroupIds === 'object') {
          groupIdsArray = options.filterGroupIds;
        }
        
        const idList = groupIdsArray;
        if (idList?.length > 1) {
          parameters.experiment = {
            is : {
              experimentGroupId: {
                in: idList
              }
            }
          };
          //parameters.idExperiment.in = idList;
        } else {
          parameters.idExperiment = Number(idList);
        }
      }
      
      if (options.filterFoco) {
        parameters.foco = JSON.parse(
          `{ "name": { "${equalsOrContains}": "${options.filterFoco}" } }`,
        );
      }

      if (options.filterTypeAssay) {
        parameters.type_assay = JSON.parse(
          `{ "name": { "${equalsOrContains}": "${options.filterTypeAssay}" } }`,
        );
      }

      if (options.filterGroup) {
        parameters.group = JSON.parse(
          `{ "group": { "${equalsOrContains}": "${options.filterGroup}" } }`,
        );
      }

      // if (options.filterGli) {
      //   parameters.assayList = JSON.parse(
      //     `{ "name": { "${equalsOrContains}": "${options.filterGli}" } }`,
      //   );
      // }

      if (options.status) {
        parameters.status = options.status;
      }

      if (options.filterNameTec) {
        parameters.tecnologia = JSON.parse(
          `{ "name": { "${equalsOrContains}": "${options.filterNameTec}" } }`,
        );
      }

      if (options.filterStatusT) {
        parameters.status_t = JSON.parse(
          `{ "${equalsOrContains}": "${options.filterStatusT}" } `,
        );
      }

      if (options.filterCodTec) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": { "cod_tec": { "${equalsOrContains}": "${options.filterCodTec}" } } }`));
      }

      if (options.filterTechnology) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": {"name": { "${equalsOrContains}": "${options.filterTechnology}" } } }`));
      }

      if (options.filterExperimentName) {
        parameters.AND.push(
          JSON.parse(
            `{ "experiment": {"experimentName": {"${equalsOrContains}": "${options.filterExperimentName}" } } }`,
          ),
        );
      }

      if (options.filterPlacingPlace) {
        parameters.AND.push(JSON.parse(`{ "experiment": { "local": {"name_local_culture": {"${equalsOrContains}": "${options.filterPlacingPlace}" } } } }`));
      }

      if (options.filterGli) {
        parameters.AND.push(JSON.parse(`{ "experiment": { "assay_list": {"gli": {"${equalsOrContains}": "${options.filterGli}" } } } }`));
      }

      if (options.filterStatus) {
        parameters.OR = [];

        const statusParams = options.filterStatus.split(',');
        statusParams.forEach((_: any, index: number) => {
          parameters.OR.push(
            JSON.parse(
              `{"status": {"${equalsOrContains}": "${statusParams[index]}" } }`,
            ),
          );
        });
      }

      if (options.ensaio) {
        parameters.AND.push(
          JSON.parse(
            `{ "type_assay": {"name": {"${equalsOrContains}": "${options.ensaio}" } } }`,
          ),
        );
      }

      if (options.filterLocal) {
        parameters.AND.push(JSON.parse(
          `{ "experiment": { "local": { "name_local_culture": { "${equalsOrContains}": "${options.filterLocal}" } } } }`,
        ));
      }

      if (options.filterDelineamento) {
        parameters.AND.push(JSON.parse(
          `{ "experiment": { "delineamento": { "name": { "${equalsOrContains}": "${options.filterDelineamento}" } } } }`,
        ));
      }

      if (options.filterGenotypeName) {
        parameters.genotipo = JSON.parse(
          `{ "name_genotipo": { "${equalsOrContains}": "${options.filterGenotypeName}" } }`,
        );
      }

      if (options.filterNcaFrom || options.filterNcaTo) {
        if (options.filterNcaFrom.toUpperCase() === 'VAZIO' || options.filterNcaTo.toUpperCase() === 'VAZIO') {
          parameters.nca = null;
        } else if (options.filterNcaFrom && options.filterNcaTo) {
          parameters.nca = JSON.parse(
            `{"gte": "${Number(options.filterNcaFrom)}", "lte": "${Number(
              options.filterNcaTo,
            )}" }`,
          );
        } else if (options.filterNcaFrom) {
          parameters.nca = JSON.parse(
            `{"gte": "${Number(options.filterNcaFrom)}" }`,
          );
        } else if (options.filterNcaTo) {
          parameters.nca = JSON.parse(
            `{"lte": "${Number(options.filterNcaTo)}" }`,
          );
        }
      }

      if (options.filterRepetitionFrom || options.filterRepetitionTo) {
        if (options.filterRepetitionFrom && options.filterRepetitionTo) {
          parameters.rep = JSON.parse(
            `{"gte": ${Number(options.filterRepetitionFrom)}, "lte": ${Number(
              options.filterRepetitionTo,
            )} }`,
          );
        } else if (options.filterRepetitionFrom) {
          parameters.rep = JSON.parse(
            `{"gte": ${Number(options.filterRepetitionFrom)} }`,
          );
        } else if (options.filterRepetitionTo) {
          parameters.rep = JSON.parse(
            `{"lte": ${Number(options.filterRepetitionTo)} }`,
          );
        }
      }

      if (options.filterNpeFrom || options.filterNpeTo) {
        if (options.filterNpeFrom && options.filterNpeTo) {
          parameters.npe = JSON.parse(
            `{"gte": ${Number(options.filterNpeFrom)}, "lte": ${Number(
              options.filterNpeTo,
            )} }`,
          );
        } else if (options.filterNpeFrom) {
          parameters.npe = JSON.parse(
            `{"gte": ${Number(options.filterNpeFrom)} }`,
          );
        } else if (options.filterNpeTo) {
          parameters.npe = JSON.parse(
            `{"lte": ${Number(options.filterNpeTo)} }`,
          );
        }
      }

      if (options.filterNtFrom || options.filterNtTo) {
        if (options.filterNtFrom && options.filterNtTo) {
          parameters.nt = JSON.parse(`{"gte": ${Number(options.filterNtFrom)}, "lte": ${Number(options.filterNtTo)} }`);
        } else if (options.filterNtFrom) {
          parameters.nt = JSON.parse(`{"gte": ${Number(options.filterNtFrom)} }`);
        } else if (options.filterNtTo) {
          parameters.nt = JSON.parse(`{"lte": ${Number(options.filterNtTo)} }`);
        }
      }

      if (options.filterRepFrom || options.filterRepTo) {
        if (options.filterRepFrom && options.filterRepTo) {
          parameters.rep = JSON.parse(`{"gte": ${Number(options.filterRepFrom)}, "lte": ${Number(options.filterRepTo)} }`);
        } else if (options.filterRepFrom) {
          parameters.rep = JSON.parse(`{"gte": ${Number(options.filterRepFrom)} }`);
        } else if (options.filterRepTo) {
          parameters.rep = JSON.parse(`{"lte": ${Number(options.filterRepTo)} }`);
        }
      }

      if (options.filterNpeFrom || options.filterNpeTo) {
        if (options.filterNpeFrom && options.filterNpeTo) {
          parameters.npe = JSON.parse(`{"gte": ${Number(options.filterNpeFrom)}, "lte": ${Number(options.filterNpeTo)} }`);
        } else if (options.filterNpeFrom) {
          parameters.npe = JSON.parse(`{"gte": ${Number(options.filterNpeFrom)} }`);
        } else if (options.filterNpeTo) {
          parameters.npe = JSON.parse(`{"lte": ${Number(options.filterNpeTo)} }`);
        }
      }

      // if (options.filterGrpFrom || options.filterGrpTo) {
      //   if (options.filterGrpFrom && options.filterGrpTo) {
      //     parameters.groupId = JSON.parse(`{"gte": ${Number(options.filterGrpFrom)}, "lte": ${Number(options.filterGrpTo)} }`);
      //   } else if (options.filterGrpFrom) {
      //     parameters.groupId = JSON.parse(`{"gte": ${Number(options.filterGrpFrom)} }`);
      //   } else if (options.filterGrpTo) {
      //     parameters.groupId = JSON.parse(`{"lte": ${Number(options.filterGrpTo)} }`);
      //   }
      // }

      if (options.filterGrpFrom || options.filterGrpTo) {
        if (options.filterGrpFrom && options.filterGrpTo) {
          parameters.group = JSON.parse(` {"group": {"gte": ${Number(options.filterGrpFrom)}, "lte": ${Number(options.filterGrpTo)} } }`);
        } else if (options.filterGrpFrom) {
          parameters.group = JSON.parse(`{"group": {"gte": ${Number(options.filterGrpFrom)} } }`);
        } else if (options.filterGrpTo) {
          parameters.group = JSON.parse(` {"group": {"lte": ${Number(options.filterGrpTo)} } }`);
        }
      }

      const select = {
        id: true,
        safra: { select: { safraName: true, culture: true } },
        foco: { select: { name: true } },
        type_assay: { select: { name: true, envelope: true } },
        tecnologia: { select: { name: true, cod_tec: true } },
        gli: true,
        status: true,
        counter: true,
        experiment: {
          select: {
            experimentName: true,
            status: true,
            delineamento: true,
            local: {
              select: { name_local_culture: true },
            },
            clp: true,
            nlp: true,
            comments: true,
            density: true,
            orderDraw: true,
            assay_list: {
              select: {
                gli: true,
                bgm: true,
                status: true,
                treatmentsNumber: true,
                tecnologia: {
                  select: {
                    name: true,
                    id: true,
                    cod_tec: true,
                  },
                },
                foco: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
                type_assay: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
                safra: {
                  select: {
                    safraName: true,
                    culture: true,
                  },
                },
              },
            },
          },
        },
        idGenotipo: true,
        rep: true,
        nt: true,
        npe: true,
        genotipo: {
          select: {
            name_genotipo: true,
            gmr: true,
            bgm: true,
            lote: {
              select: {
                fase: true,
              },
            },
          },
        },
        nca: true,
        lote: true,
        group: true,
        status_t: true,
        sequencia_delineamento: true,
      };

      if (options.experimentGroupId) {
        const idList = await this.generateIdList(
          Number(options.experimentGroupId),
        );
        if (idList?.length > 1) {
          parameters.idExperiment = {};
          parameters.idExperiment.in = idList;
        } else {
          parameters.idExperiment = Number(idList);
        }
      }

      if (options.idExperiment) {
        parameters.idExperiment = Number(options.idExperiment);
      }

      if (options.safraName) {
        parameters.AND.push(
          JSON.parse(
            `{ "safra": {"safraName": {"contains": "${options.safraName}" } } }`,
          ),
        );
      }

      if (options.id_safra) {
        parameters.idSafra = Number(options.id_safra);
      }

      if (options.idFoco) {
        parameters.idFoco = Number(options.idFoco);
      }

      if (options.idTypeAssay) {
        parameters.idTypeAssay = Number(options.idTypeAssay);
      }

      if (options.idTecnologia) {
        parameters.idTecnologia = Number(options.idTecnologia);
      }

      if (options.groupId) {
        parameters.groupId = Number(options.groupId);
      }

      if (options.nt) {
        if (typeof options.nt === 'number') {
          parameters.nt = Number(options.nt);
        }
      }

      if (options.rep) {
        if (typeof options.rep === 'number') {
          parameters.rep = Number(options.rep);
        }
      }

      if (options.nca) {
        parameters.nca = options.nca;
      }

      if (options.gli) {
        parameters.gli = options.gli;
      }

      if (options.npe) {
        // if (typeof options.npe === 'number') {
        parameters.npe = Number(options.npe);
        // }
      }

      if (options.idExperiment) {
        parameters.idExperiment = Number(options.idExperiment);
      }

      if (options.idGenotipo) {
        parameters.idGenotipo = Number(options.idGenotipo);
      }

      if (options.idLote) {
        parameters.idLote = Number(options.idLote);
      }

      const take = options.take ? Number(options.take) : undefined;

      const skip = options.skip ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      if (parameters.AND.length === 0) {
        delete parameters.AND;
      }

      const response: object | any = await this.ExperimentGenotipeRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (options.count) {
        const {
          tagsToPrint,
          tagsPrinted,
        } = await this.ExperimentGenotipeRepository.countTags(parameters);

        response.tagsToPrint = tagsToPrint;
        response.tagsPrinted = tagsPrinted;
      }

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return {
        status: 200,
        response,
        total: response.total,
        tagsToPrint: response.tagsToPrint,
        tagsPrinted: response.tagsPrinted,
      };
    } catch (error: any) {
      handleError('Parcelas controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Parcelas erro');
    }
  }

  setSemaforoController(semaforoController: SemaforoController) {
    this.semaforoController = semaforoController;
  }

  setTransactionController(clientManager: PrismaClientManager, transactionScope: PrismaTransactionScope) {
    this.ExperimentGenotipeRepository.setTransaction(clientManager, transactionScope);
  }

  async getLastNpeDisponible(options: {
    safraId: number;
    groupId: number;
    npefSearch: number;
  }) {
    const { safraId } = options;
    const { groupId } = options;
    const { npefSearch } = options;

    try {
      const response: {
        count_npe_exists: number | null,
        max_NPE_1: number | null,
        maxnpe: number | null,
      } = await prisma.$queryRaw`SELECT (EXISTS (SELECT npe
                                                 FROM experiment_genotipe
                                                 WHERE 1 = 1
                                                   AND npe = ${npefSearch}
                                                   AND groupId = ${groupId}
                                                   AND ('' = ${safraId} OR gn.idSafra = ${safraId}))) as count_npe_exists,
                                        (MAX(gn.npe) + 1)                                             as max_NPE_1,
                                        IF((EXISTS (SELECT npe
                                                    FROM experiment_genotipe
                                                    WHERE 1 = 1
                                                      AND npe = ${npefSearch}
                                                      AND groupId = ${groupId}
                                                      AND ('' = ${safraId} OR gn.idSafra = ${safraId}))) > 0,
                                           (MAX(gn.npe) + 1), ${npefSearch})                          as maxnpe
                                 FROM experiment_genotipe gn
                                 WHERE 1 = 1
                                   AND gn.groupId = ${groupId}
                                   AND ('' = ${safraId} OR gn.idSafra = ${safraId})
                                 ORDER BY npe DESC`;

      if (!response) throw new Error('Grupo não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Parcelas controller', 'getLastNpeDisponible', error.message);
      throw new Error('[Controller] - getLastNpeDisponible Parcelas erro');
    }
  }

  async create({ experiment_genotipo, gt, experimentObj, npeToUpdate, userId, sessao }: ICreateParams) {

    const npeController = new NpeController();
    const acao = SemaforoController.PROCESS_SORTEIO;
    const created_by = userId;

    console.log('experiment_genotipo', experiment_genotipo);
    console.log('gt', gt);
    console.log('experimentObj', experimentObj);
    console.log('npeToUpdate', npeToUpdate);

    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json')
        .then((results) => results.json())
        .catch(() => '0.0.0.0');

      let maxWait = 60000; // 60000 milisegundos = 60 segundos
      let timeout = 120000; // 120000 milisegundos = 120 segundos
      timeout = 600000; // 600000 milisegundos = 600 segundos = 10 minutos (capacidade 100 mil linhas) no createMany de experiment_genotipe

      let limitQuantity = 100000; // 100000 linhas

      // formatar o numero limitQuantity para 100.000
      let limitQuantityStr = limitQuantity.toLocaleString('pt-BR');

      let messageLimitExceeded = `A quantidade de NPE's a gerar no sorteio foi de xxxxxx, o limite máximo é de ${limitQuantityStr} NPE's. Favor procurar o administrador.`;

      if (experiment_genotipo.length > limitQuantity) {

        messageLimitExceeded = messageLimitExceeded.replace('xxxxxx', experiment_genotipo.length.toLocaleString());

        return { status: 400, message: messageLimitExceeded };

      }

      const response = await prisma?.$transaction(async (tx) => {

          //await Promise.all(experimentObj.map(async (exp: any) => {
          // BEGIN PROMISE ALL AND MAP
          // [...conteudo...]
          // END PROMISE ALL AND MAP
          //}));

          /**
           * Validação do semáforo
           */
          for (const exp of experimentObj) {

            console.log('exp', exp);

            const resSemaforo = await this.semaforoController.validaSemaforoItem(
              sessao, acao, 'experiment', exp.id, created_by);

            if (resSemaforo.status !== 200) {
              throw new SemaforoError(resSemaforo.message, resSemaforo.response, resSemaforo.status, resSemaforo);
            }

            await tx.experiment.update({
              where: {
                id: exp.id,
              },
              data: {
                status: exp.status,
              },
            });

          }


          for (const gen_treatment of gt) {
            const resSemaforo = await this.semaforoController.validaSemaforoItem(
              sessao, acao, 'genotype_treatment', gen_treatment.id, created_by);

            if (resSemaforo.status !== 200) {
              throw new SemaforoError(resSemaforo.message, resSemaforo.response, resSemaforo.status, resSemaforo);
            }

            await tx.genotype_treatment.update({
              where: {
                id: gen_treatment.id,
              },
              data: {
                status_experiment: gen_treatment.status_experiment,
              },
            });
          }

          for (const npe of npeToUpdate) {

            const { response: newNpe }: IReturnObject = await npeController.getOne(Number(npe.id));

            const concat = `${newNpe.local.name_local_culture}_${newNpe.safra.safraName}_${newNpe.foco.name}_${newNpe.group.group}_${newNpe.type_assay.name}_${newNpe.tecnologia.cod_tec} ${newNpe.tecnologia.name}_${newNpe.epoca}_${newNpe.npei}_${newNpe.prox_npe}`;

            const resSemaforo = await this.semaforoController.validaSemaforoItem(
              sessao, acao, 'npe', npe.id, created_by);

            if (resSemaforo.status !== 200) {
              throw new SemaforoError(resSemaforo.message, resSemaforo.response, resSemaforo.status, resSemaforo);
            }

            await this.reporteController.create({
              userId, module: 'AMBIENTE', operation: 'SORTEIO', oldValue: concat, ip: String(ip),
            });

            await tx.npe.update({
              where: {
                id: npe.id,
              },
              data: {
                npef: npe.npef,
                prox_npe: npe.prox_npe,
                status: npe.status,
              },
            });
          }

          console.log('pre.createMany:experiment_genotipo', experiment_genotipo);

          const exp_gen = await tx.experiment_genotipe.createMany({ data: experiment_genotipo });

          return exp_gen;
        },
        {
          maxWait: maxWait, // 60000 milisegundos = 60 segundos
          timeout: timeout, // 120000 milisegundos = 120 segundos
        });

      if (response) {

        await this.semaforoController.finalizaRest(sessao, acao);

        return { status: 200, message: 'Tratamento experimental registrado' };
      }
      return { status: 400, message: 'Parcelas não registrado' };
    } catch (error: any) {
      // catch final
      handleError('Parcelas do controlador', 'Create', error.message);
      throw new Error(`[Controller] - Erro ao criar esboço de Parcelas: ${error.message}`);
    }
  }

  async findByExperimentId(experimentId: number) {
    try {
      const response = await this.ExperimentGenotipeRepository.findByExperimentId(experimentId);

      if (!response) throw new Error('Parcelas não encontradas');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Parcela controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Parcela erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.ExperimentGenotipeRepository.findById(id);

      if (!response) throw new Error('Parcela não encontrada');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Parcela controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Parcela erro');
    }
  }

  async update({
                 idList, npe, status, userId = 0, count,
               }: any) {
    try {
      let operation;
      let counter = 1;
      if (count === 'print') {
        operation = 'IMPRESSO';
        counter = 1;
        // idList é um array de ids de parcelas

        // await idList.map(async (id: any) => {
        for (const id of idList) {
          const { response }: any = await this.getOne(Number(id));
          const newCount = response.counter + 1;
          operation = 'IMPRESSO';

          await this.ExperimentGenotipeRepository.printed(Number(id), status, newCount);

          const { idExperiment } = response;

          const { response: resExp }: any = await this.experimentController.getOne(idExperiment);
          // await this.experimentGroupController.countEtiqueta(
          //   resExp.experimentGroupId,
          //   idExperiment,
          // );

          await this.reporteController.create({
            userId, operation, module: 'ETIQUETAGEM', oldValue: response.nca,
          });
        }
        // });

        // const { response: resExp }: any = await this.experimentController.getOne(idExperiment);
        // await this.experimentGroupController.countEtiqueta(
        //   resExp.experimentGroupId,
        //   idExperiment,
        // );
      } else if (count === 'reprint') {
        await idList.map(async (id: any) => {
          const { response }: any = await this.getOne(id);
          const newCount = response.counter + 1;
          operation = 'REIMPRESSO';

          await this.ExperimentGenotipeRepository.printed(id, status, newCount);

          const { idExperiment } = response;

          const { response: resExp }: any = await this.experimentController.getOne(idExperiment);
          await this.experimentGroupController.countEtiqueta(
            resExp.experimentGroupId,
            idExperiment,
          );

          await this.reporteController.create({
            userId, operation, module: 'ETIQUETAGEM', oldValue: response.nca,
          });
        });
      } else if (count === 'writeOff') {
        for (const id of idList) {
          counter = 0;
          operation = 'EM ETIQUETAGEM';

          await this.ExperimentGenotipeRepository.writeOff(id, npe, status, counter);

          const { response }: any = await this.getOne(id);

          const { idExperiment } = response;

          const { response: resExp }: any = await this.experimentController.getOne(idExperiment);
          await this.experimentGroupController.countEtiqueta(
            resExp.experimentGroupId,
            idExperiment,
          );

          operation = 'BAIXA';
          await this.reporteController.create({
            userId, operation, module: 'ETIQUETAGEM', oldValue: npe,
          });
        }

        // return { status: 200 };
      }

      return { status: 200 };
    } catch (error: any) {
      handleError('Parcelas controller', 'Update', error.message);
      throw new Error('[Controller] - Update Parcelas erro');
    }
  }

  async deleteAllTransaction(idExperiment: number) {
    try {
      return this.ExperimentGenotipeRepository.deleteAllTransaction(Number(idExperiment))
        .then((responseTransaction) => {
          console.log('responseTransaction', responseTransaction);
          if (responseTransaction !== undefined) {
            return { status: 200, message: 'Parcelas excluídos' };
          } else {
            return { status: 400, message: 'Erro ao excluir parcelas' };
          }
        })
        .catch((error: any) => {
          handleError('Parcelas controller', 'DeleteAllTransaction', error.message);
          throw new Error('[Controller] - DeleteAllTransaction Parcelas erro: ' + error.message);
        });
    } catch (error: any) {
      handleError('Parcelas controller', 'DeleteAllTransaction', error.message);
      throw new Error('[Controller] - DeleteAllTransaction Parcelas erro: ' + error.message);
    }
  }

  async deleteAllTransactionOld(idExperiment: number) {
    try {

      const responseTransaction = await this.ExperimentGenotipeRepository.deleteAllTransaction(Number(idExperiment));
      console.log('responseTransaction', responseTransaction);
      if (responseTransaction !== undefined) {
        return { status: 200, message: 'Parcelas excluídos' };
      } else {
        return { status: 400, message: 'Erro ao excluir parcelas' };
      }

    } catch (error: any) {
      handleError('Parcelas controller', 'DeleteAllTransaction', error.message);
      throw new Error('[Controller] - DeleteAllTransaction Parcelas erro: ' + error.message);
    }
  }

  async deleteAll(data: any) {
    try {
      console.log('data', data);
      const response = await this.ExperimentGenotipeRepository.deleteAll(data);
      if (response) {
        return { status: 200, message: 'Parcelas excluídos' };
      }

      return { status: 400, message: 'Erro ao excluir parcelas' };

    } catch (error: any) {
      handleError('Parcelas controller', 'DeleteAll', error.message);
      throw new Error('[Controller] - DeleteAll Parcelas erro');
    }
  }

  async relateLayout({ id, blockLayoutId, status }: any) {
    try {
      const parcela: any = await this.getOne(Number(id));

      if (!parcela) return { status: 400, message: 'parcela não existente' };

      const response: any = await this.ExperimentGenotipeRepository.update(
        id,
        {
          blockLayoutId,
          status,
        },
      );
      if (response) {
        return { status: 200, response, message: 'parcela atualizada' };
      }
      return { status: 400, response, message: 'parcela não atualizada' };
    } catch (error: any) {
      handleError('Parcelas controller', 'Relacionar layout', error.message);
      throw new Error('[Controller] - Relacionar layout Parcelas erro');
    }
  }

  async generateIdList(id: number): Promise<Array<number>> {
    try {
      const experimentGroupController = new ExperimentGroupController();
      const { response }: any = await experimentGroupController.getOne(id);
      const idList = response.experiment?.map((item: any) => Number(item.id));
      return idList;
    } catch (error: any) {
      handleError('Parcelas controller', 'generateIdList', error.message);
      throw new Error('[Controller] - generateIdList Parcelas erro');
    }
  }

  async setStatus({ idList: idExperiment, status }: any) {
    try {
      const experimentsGroupIds: number[] = [];
      await this.ExperimentGenotipeRepository.updateStatus(idExperiment, status);
      for (const id of idExperiment) {
        const { response }: any = await this.experimentController.getOne(Number(id));
        // verifica se experimentGroupId já foi adicionado
        if (response?.experimentGroupId && !experimentsGroupIds.includes(response.experimentGroupId)) {
          experimentsGroupIds.push(response.experimentGroupId);
        }
        // await this.experimentGroupController.countEtiqueta(
        //   response.experimentGroupId,
        //   idExperiment,
        // );
      }

      for (const id of experimentsGroupIds) {
        await this.experimentGroupController.countEtiqueta(id, idExperiment, (status === 'EM ETIQUETAGEM'));
      }

      // idExperiment.map(async (id: number) => {
      //   const { response }: any = await this.experimentController.getOne(id);
      //   await this.experimentGroupController.countEtiqueta(
      //     response.experimentGroupId,
      //     idExperiment,
      //   );
      // });
    } catch (error: any) {
      handleError('Parcelas controller', 'setStatus', `${error.message} :: ${JSON.stringify(error)}`);
      throw new Error('[Controller] - setStatus Parcelas erro');
    }
  }

  async updateData(data: any) {
    try {
      const response: any = await this.ExperimentGenotipeRepository.findById(
        data.id,
      );

      if (!response) {
        return {
          status: 404,
          response,
          message: 'Tratamentos do genótipo não existente',
        };
      }

      const check = await this.ExperimentGenotipeRepository.update(
        data.id,
        data,
      );

      return { status: 200, message: 'experimento do genótipo atualizado' };
    } catch (error: any) {
      handleError(
        'Tratamento do experimento do controlador',
        'Create',
        error.message,
      );
      throw new Error(
        '[Controller] - Erro ao criar esboço de tratamento do experimento',
      );
    }
  }

  async createXls(options: any) {
    try {
      delete options.createFile;
      options.take = 1000;

      const { response, status } = await this.getAll(options);

      const newData = response.map((item: any) => {
        const newItem: any = {};
        newItem.CULTURA = item.safra.culture.name;
        newItem.SAFRA = item.safra.safraName;
        newItem.FOCO = item.foco.name;
        newItem.ENSAIO = item.type_assay.name;
        newItem.TECNOLOGIA = `${item.tecnologia.cod_tec} ${item.tecnologia.name}`;
        newItem.GLI = item.gli;
        newItem.EXPERIMENTO = item.experiment.experimentName;
        newItem.BGM_GEN = item.genotipo.bgm;
        newItem.BGM_ENS = item.experiment.assay_list.bgm;
        // newItem.STATUS_ENSAIO = item.experiment.assay_list.status;
        newItem.LUGAR_PLANTIO = item.experiment.local.name_local_culture;
        newItem.DELINEAMENTO = item.experiment.delineamento.name;
        newItem.REPETIÇÕES = item.rep;
        newItem.DENSIDADE = item.experiment.densidade ? String(item.experiment.densidade) : '';
        newItem.ORDEM_SORTEIO = item.experiment.orderDraw ? String(item.experiment.orderDraw) : '';
        newItem.STATUS_EXP = item.experiment.status;
        newItem.NLP = item.experiment.nlp ? String(item.experiment.nlp) : '';
        newItem.CLP = item.experiment.clp ? String(item.experiment.clp) : '';
        newItem.OBSERVAÇÕES = item.experiment.comments ? String(item.experiment.comments) : '';
        newItem.STATUS_T = item.status_t;
        newItem.NT = item.nt;
        newItem.NPE = item.npe;
        newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
        newItem.NCA = item.nca;
        newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

        delete newItem.id;
        return newItem;
      });

      let workSheet: any = XLSX.utils.json_to_sheet(newData);

      let res = response;

      options.skip = 1000;
      while (res.length > 0) {
        await this.getAll(options).then(({ status, response }) => {
          // logic
          const newData = response.map((item: any) => {
            const newItem: any = {};
            newItem.CULTURA = item.safra.culture.name;
            newItem.SAFRA = item.safra.safraName;
            newItem.FOCO = item.foco.name;
            newItem.ENSAIO = item.type_assay.name;
            newItem.TECNOLOGIA = `${item.tecnologia.cod_tec} ${item.tecnologia.name}`;
            newItem.GLI = item.gli;
            newItem.EXPERIMENTO = item.experiment.experimentName;
            newItem.BGM_GEN = item.genotipo.bgm;
            newItem.BGM_ENS = item.experiment.assay_list.bgm;
            // newItem.STATUS_ENSAIO = item.experiment.assay_list.status;
            newItem.LUGAR_PLANTIO = item.experiment.local.name_local_culture;
            newItem.DELINEAMENTO = item.experiment.delineamento.name;
            newItem.REPETIÇÕES = item.rep;
            newItem.DENSIDADE = item.experiment.densidade ? String(item.experiment.densidade) : '';
            newItem.ORDEM_SORTEIO = item.experiment.orderDraw ? String(item.experiment.orderDraw) : '';
            newItem.STATUS_EXP = item.experiment.status;
            newItem.NLP = item.experiment.nlp ? String(item.experiment.nlp) : '';
            newItem.CLP = item.experiment.clp ? String(item.experiment.clp) : '';
            newItem.OBSERVAÇÕES = item.experiment.comments ? String(item.experiment.comments) : '';
            newItem.STATUS_T = item.status_t;
            newItem.NT = item.nt;
            newItem.NPE = item.npe;
            newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
            newItem.NCA = item.nca;
            newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

            delete newItem.id;
            return newItem;
          });

          workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
          // logic
          res = response;
          console.log("createXls registros incluidos na planilha:", options.skip);

          options.skip += 1000;
        });
      }

      return workSheet;
    } catch (error: any) {
      console.log(error);
      handleError('Parcelas controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Parcelas erro');
    }
  }
}
