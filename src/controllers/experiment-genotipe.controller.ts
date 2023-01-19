import { ExperimentGenotipeRepository } from 'src/repository/experiment-genotipe.repository';
import * as XLSX from 'xlsx';
import { IReturnObject } from '../interfaces/shared/Import.interface';
import handleError from '../shared/utils/handleError';
import { ExperimentGroupController } from './experiment-group/experiment-group.controller';
import { ExperimentController } from './experiment/experiment.controller';
import { PrintHistoryController } from './print-history/print-history.controller';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';

export class ExperimentGenotipeController {
  private ExperimentGenotipeRepository = new ExperimentGenotipeRepository();

  private experimentController = new ExperimentController();

  private experimentGroupController = new ExperimentGroupController();

  private printedHistoryController = new PrintHistoryController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    parameters.AND = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await this.createXls(options);
        return { status: 200, response: sheet };
      }
      if (options.filterFoco) {
        parameters.foco = JSON.parse(
          `{ "name": { "contains": "${options.filterFoco}" } }`,
        );
      }

      if (options.filterTypeAssay) {
        parameters.type_assay = JSON.parse(
          `{ "name": { "contains": "${options.filterTypeAssay}" } }`,
        );
      }

      // if (options.filterGli) {
      //   parameters.assayList = JSON.parse(
      //     `{ "name": { "contains": "${options.filterGli}" } }`,
      //   );
      // }

      if (options.filterNameTec) {
        parameters.tecnologia = JSON.parse(
          `{ "name": { "contains": "${options.filterNameTec}" } }`,
        );
      }

      if (options.filterStatusT) {
        parameters.status_t = JSON.parse(
          `{ "contains": "${options.filterStatusT}" } `,
        );
      }

      if (options.filterCodTec) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": { "cod_tec": { "contains": "${options.filterCodTec}" } } }`));
      }

      if (options.filterTechnology) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": {"name": { "contains": "${options.filterTechnology}" } } }`));
      }

      if (options.filterExperimentName) {
        parameters.AND.push(
          JSON.parse(
            `{ "experiment": {"experimentName": {"contains": "${options.filterExperimentName}" } } }`,
          ),
        );
      }

      if (options.filterPlacingPlace) {
        parameters.AND.push(JSON.parse(`{ "experiment": { "local": {"name_local_culture": {"contains": "${options.filterPlacingPlace}" } } } }`));
      }

      if (options.filterGli) {
        parameters.AND.push(JSON.parse(`{ "experiment": { "assay_list": {"gli": {"contains": "${options.filterGli}" } } } }`));
      }

      if (options.filterStatus) {
        parameters.OR = [];

        const statusParams = options.filterStatus.split(',');
        statusParams.forEach((_: any, index: number) => {
          parameters.OR.push(
            JSON.parse(
              `{ "experiment": {"status": {"contains": "${statusParams[index]}" } } }`,
            ),
          );
        });
      }
      if (options.ensaio) {
        parameters.AND.push(
          JSON.parse(
            `{ "type_assay": {"name": {"contains": "${options.ensaio}" } } }`,
          ),
        );
      }

      if (options.filterLocal) {
        parameters.AND.push(JSON.parse(
          `{ "experiment": { "local": { "name_local_culture": { "contains": "${options.filterLocal}" } } } }`,
        ));
      }

      if (options.filterDelineamento) {
        parameters.AND.push(JSON.parse(
          `{ "experiment": { "delineamento": { "name": { "contains": "${options.filterDelineamento}" } } } }`,
        ));
      }

      if (options.filterGenotypeName) {
        parameters.genotipo = JSON.parse(
          `{ "name_genotipo": { "contains": "${options.filterGenotypeName}" } }`,
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
            assay_list: {
              select: {
                gli: true,
                bgm: true,
                status: true,
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
      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Parcelas controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Parcelas erro');
    }
  }

  async create({ experiment_genotipo, gt, experimentObj, npeToUpdate }: object | any) {
    try {
      const response = await prisma?.$transaction(async (tx) => {

        await gt.map(async (gen_treatment: any) => {
          await tx.genotype_treatment.update({
            where: {
              id: gen_treatment.id,
            },
            data: {
              status_experiment: gen_treatment.status_experiment,
            }
          })
        })

        await experimentObj.map(async (exp: any) => {
          await tx.experiment.update({
            where: {
              id: exp.id,
            },
            data: {
              status: exp.status,
            }
          })
        })

        await npeToUpdate.map(async (npe: any) => {
          await tx.npe.update({
            where: {
              id: npe.id,
            },
            data: {
              npef: npe.npef,
              prox_npe: npe.prox_npe,
              status: npe.status,
            }
          })
        })

        const exp_gen = await tx.experiment_genotipe.createMany({ data: experiment_genotipo })

        return exp_gen
      }, {
        maxWait: 5000,
        timeout: 10000,
      })

      if (response) {
        return { status: 200, message: 'Tratamento experimental registrado' };
      }
      return { status: 400, message: 'Parcelas não registrado' };
    } catch (error: any) {
      handleError('Parcelas do controlador', 'Create', error.message);
      throw new Error('[Controller] - Erro ao criar esboço de Parcelas');
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
      let counter = 0;
      if (count === 'print') {
        status = 'IMPRESSO';
        counter = 1;
      } else if (count === 'reprint') {
        await idList.map(async (id: any) => {
          const { response }: any = await this.getOne(id);
          const newCount = response.counter + 1;
          const status = 'REIMPRESSO';
          await this.ExperimentGenotipeRepository.printed(id, status, newCount);
        });
      } else if (count === 'writeOff') {
        counter = 0;
        status = 'EM ETIQUETAGEM';
        await this.ExperimentGenotipeRepository.writeOff(npe, status, counter);
        status = 'BAIXA';
        await this.printedHistoryController.create({ idList, userId, status });
        return { status: 200 };
      }
      await this.ExperimentGenotipeRepository.printed(idList, status, counter);
      await this.printedHistoryController.create({ idList, userId, status });
      return { status: 200 };
    } catch (error: any) {
      handleError('Parcelas controller', 'Update', error.message);
      throw new Error('[Controller] - Update Parcelas erro');
    }
  }

  async deleteAll(idExperiment: number) {
    try {
      const parcelsToDelete: any = await this.getAll({ idExperiment });
      const idList = parcelsToDelete[0]?.map(async (parcela: any) => parcela.id);
      const { status } = await this.printedHistoryController.deleteAll(idList);
      if (status === 200) {
        const response = await this.ExperimentGenotipeRepository.deleteAll(Number(idExperiment));
        if (response) {
          return { status: 200, message: 'Parcelas excluídos' };
        }
        return { status: 400, message: 'Parcelas não excluídos' };
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
      await this.ExperimentGenotipeRepository.updateStatus(
        idExperiment,
        status,
      );
      idExperiment.map(async (id: number) => {
        const { response }: any = await this.experimentController.getOne(id);
        await this.experimentGroupController.countEtiqueta(
          response.experimentGroupId,
          idExperiment,
        );
      });
    } catch (error: any) {
      handleError('Parcelas controller', 'setStatus', error.message);
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
        newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
        newItem.DELINEAMENTO = item.experiment.delineamento.name;
        newItem.REP = item.rep;
        newItem.NT = item.nt;
        newItem.NPE = item.npe;
        newItem.STATUS_T = item.status_t;
        newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
        newItem.NCA = item.nca;
        newItem.STATUS_EXP = item.experiment.status;

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
            newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
            newItem.DELINEAMENTO = item.experiment.delineamento.name;
            newItem.REP = item.rep;
            newItem.NT = item.nt;
            newItem.NPE = item.npe;
            newItem.STATUS_T = item.status_t;
            newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
            newItem.NCA = item.nca;
            newItem.STATUS_EXP = item.experiment.status;

            delete newItem.id;
            return newItem;
          });

          workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
          // logic
          res = response;

          options.skip += 1000;
        });
      }

      return workSheet;
    } catch (error) {
      console.log(error);
    }
  }
}
