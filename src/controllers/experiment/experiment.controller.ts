import { TransactionConfig } from 'src/shared/prisma/transactionConfig';
import createXls from 'src/helpers/api/xlsx-global-download';
import handleError from '../../shared/utils/handleError';
import { ExperimentRepository } from '../../repository/experiment.repository';
import { ReporteRepository } from '../../repository/reporte.repository';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { AssayListController } from '../assay-list/assay-list.controller';
import { functionsUtils } from '../../shared/utils/functionsUtils';
import { IReturnObject } from '../../interfaces/shared/Import.interface';
import { ExperimentGroupController } from '../experiment-group/experiment-group.controller';
import { ExperimentGenotipeController } from '../experiment-genotipe.controller';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';
import { NpeController } from '../npe/npe.controller';
import { GenotypeTreatmentController } from '../genotype-treatment/genotype-treatment.controller';
import { ReporteController } from '../reportes/reporte.controller';

export class ExperimentController {
  experimentRepository = new ExperimentRepository();

  assayListController = new AssayListController();

  reporteController = new ReporteController();

  async getAll(options: any) {
    const parameters: object | any = {};
    const equalsOrContains = options.importValidate ? 'equals' : 'contains';
    let orderBy: object | any;
    parameters.AND = [];

    // console.log('experimentos', 'options', options);
    
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        try{
          const sheet = await createXls(options, 'EXPERIMENTOS-EXPERIMENTO');
          return { status: 200, response: sheet };
        } catch (error) {
          handleError('experiment.controller.ts', 'getAll', error);
          return { status: 500, response: error };
        }
      }

      if (options.filterRepetitionFrom || options.filterRepetitionTo) {
        if (options.filterRepetitionFrom && options.filterRepetitionTo) {
          parameters.repetitionsNumber = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)}, "lte": ${Number(options.filterRepetitionTo)} }`);
        } else if (options.filterRepetitionFrom) {
          parameters.repetitionsNumber = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)} }`);
        } else if (options.filterRepetitionTo) {
          parameters.repetitionsNumber = JSON.parse(`{"lte": ${Number(options.filterRepetitionTo)} }`);
        }
      }

      if (options.filterExperimentStatus) {
        parameters.OR = [];
        const statusParams = options.filterExperimentStatus.split(',');
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[0]}" } }`));
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[1]}" } }`));
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[2]}" } }`));
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[3]}" } }`));
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[4]}" } }`));
      }

      if (options.filterExperimentName) {
        parameters.experimentName = JSON.parse(`{ "${equalsOrContains}":"${options.filterExperimentName}" }`);
      }
      if (options.filterCodTec) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": { "cod_tec":  {"${equalsOrContains}": "${options.filterCodTec}" } } } }`));
      }
      if (options.filterPeriod) {
        parameters.period = Number(options.filterPeriod);
      }
      if (options.filterFoco) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"foco": {"name": {"${equalsOrContains}": "${options.filterFoco}" } } } }`));
      }
      if (options.name_genotipo) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"name_genotipo": {"name": {"${equalsOrContains}": "${options.filterFoco}" } } } }`));
      }
      if (options.filterTypeAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"type_assay": {"name": {"${equalsOrContains}": "${options.filterTypeAssay}" } } } }`));
      }
      if (options.filterGli) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"gli": {"${equalsOrContains}": "${options.filterGli}" } } }`));
      }
      if (options.filterTecnologia) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": { "name":  {"${equalsOrContains}": "${options.filterTecnologia}" } } } }`));
      }
      if (options.filterDelineamento) {
        parameters.delineamento = JSON.parse(`{ "name": {"${equalsOrContains}": "${options.filterDelineamento}" } }`);
      }
      if (options.experimentGroupId) {
        parameters.experimentGroupId = Number(options.experimentGroupId);
      }

      let select = {};
      if (options.excel) {
        select = {
          id: true,
          idSafra: true,
          density: true,
          safra: true,
          repetitionsNumber: true,
          experimentGroupId: true,
          period: true,
          nlp: true,
          clp: true,
          experimentName: true,
          comments: true,
          orderDraw: true,
          status: true,
          assay_list: {
            select: {
              gli: true,
              bgm: true,
              status: true,
              genotype_treatment: { include: { genotipo: true, lote: true } },
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
          local: {
            select: {
              name_local_culture: true,
              cultureUnity: true,
            },
          },
          delineamento: {
            select: {
              name: true,
              repeticao: true,
              id: true,
              sequencia_delineamento: true,
            },
          },
          experiment_genotipe: true,
        };
      } else {
        select = {
          id: true,
          idSafra: true,
          density: true,
          safra: true,
          repetitionsNumber: true,
          experimentGroupId: true,
          period: true,
          nlp: true,
          clp: true,
          experimentName: true,
          comments: true,
          orderDraw: true,
          status: true,
          assay_list: {
            select: {
              gli: true,
              bgm: true,
              status: true,
              genotype_treatment: { include: { genotipo: true, lote: true } },
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
          local: {
            select: {
              name_local_culture: true,
              cultureUnity: true,
            },
          },
          delineamento: {
            select: {
              name: true,
              repeticao: true,
              id: true,
            },
          },
        };
      }

      if (options.idSafra) {
        parameters.idSafra = Number(options.idSafra);
      }

      if (options.id_safra) {
        parameters.idSafra = Number(options.id_safra);
      }

      if (options.idLocal) {
        parameters.idLocal = Number(options.idLocal);
      }

      if (options.id) {
        parameters.id = Number(options.id);
      }

      if (options.id_assay_list) {
        parameters.idAssayList = Number(options.id_assay_list);
      }

      if (options.experimentName) {
        parameters.experimentName = options.experimentName;
      }
      if (options.Foco) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"foco": {"id": ${Number(options.Foco)} } } }`));
      }
      if (options.TypeAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"type_assay": {"id": ${Number(options.TypeAssay)} } } }`));
      }
      if (options.Tecnologia) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": {"cod_tec": "${options.Tecnologia}" } } }`));
      }
      if (options.Epoca) {
        parameters.period = Number(options.Epoca);
      }
      if (options.Status) {
        parameters.status = JSON.parse(`{"equals": "${options.Status}" }`);
      }

      if (options.gli) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"gli": {"contains": "${options.gli}" } } }`));
      }

      // se options.take for array, pega o primeiro valor
      if (Array.isArray(options.take)) {
        options.take = options.take[0];
      }

      // se options.skip for array, pega o primeiro valor
      if (Array.isArray(options.skip)) {
        options.skip = options.skip[0];
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        // verifica se options.orderBy é objeto entra também
        if (!options.excel || (typeof options.orderBy === 'object')) {
          if (typeof options.orderBy !== 'string' || typeof options.typeOrder !== 'string') {
            if (options.orderBy[2] == '' || !options.orderBy[2]) {
              /**
               * @todo: Refatorar esse código para verificar se cada orderBy tem ponto se tiver é uma relação
               */
              const tempOrder = handleOrderForeign(options.orderBy[1], options.typeOrder[1]);

              orderBy = [`{"${options.orderBy[0]}":"${options.typeOrder[0]}"}`, `${tempOrder}`];
            } else {
              orderBy = handleOrderForeign(options.orderBy[2], options.typeOrder[2]);
              orderBy = orderBy || `{"${options.orderBy[2]}":"${options.typeOrder[2]}"}`;
            }
          } else {
            orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
            orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
          }
        }
      }

      const response: object | any = await this.experimentRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      /*
      TODO: Refatorar este código, pois esse if está inteferindo na tela de ambiente ao sortear os experimentos
       src/pages/operacao/ambiente/experimento/index.tsx
       src/pages/operacao/ambiente/experimento/index.tsx:711
       */
      if (options.excel) {
        response.map(async (item: any) => {
          const newItem = item;
          newItem.countNT = functionsUtils
            .countChildrenForSafra(item.assay_list.genotype_treatment, Number(options.idSafra));
          newItem.npeQT = item.experiment_genotipe.length;
          newItem.seq_delineamento = item.delineamento.sequencia_delineamento.filter(
            (x: any) => x.nt <= item.countNT && x.repeticao <= item.repetitionsNumber,
          );
          return newItem;
        });
      }

      if (response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'Nenhum experimento encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Experimento controller', 'GetAll', error.message + ' - ' + JSON.stringify(parameters));
      // throw new Error({name: 'teste', message: '[Controller] - GetAll Experimento erro: ', stack: error.message});
      throw new Error(`[Controller] - GetAll Experimento erro: \r\n${error.message}`);
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.experimentRepository.findOne(id);

      if (!response) return { status: 400, response };

      return { status: 200, response };
    } catch (error: any) {
      handleError('Experimento controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Experimento erro');
    }
  }

  async getFromExpName(name: any) {
    try {
      const response = await this.experimentRepository.findOneByName(name);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Experimento controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Experimento erro');
    }
  }

  async create(data: any) {
    try {
      const response = await this.experimentRepository.create(data);
      if (response) {
        return { status: 200, response, message: 'Experimento cadastrado' };
      }
      return { status: 400, message: 'Experimento não cadastrado' };
    } catch (error: any) {
      handleError('Experimento controller', 'Create', error.message);
      throw new Error('[Controller] - Create Experimento erro');
    }
  }

  async update(data: any) {
    try {
      const experimentGenotipeController = new ExperimentGenotipeController();
      const experimentGroupController = new ExperimentGroupController();
      if (data.idList) {

        /**
         * limpa os experimentos
         * caso seja exclusão de experimentos de um grupo, o método relationGroup irá limpar a coluna experimentGroupId de experiments
         * caso seja atualização de status fará o fluxo normal
         */
        await this.experimentRepository.relationGroup(data);

        if (data.experimentGroupId) {
          const {response: group} = await experimentGroupController.getOne(Number(data.experimentGroupId));

          const {ip} = await fetch('https://api.ipify.org/?format=json')
            .then((results) => results.json())
            .catch(() => '0.0.0.0');
          await this.reporteController.create({userId: data.userId, module: 'GRUPO DE ETIQUETAGEM', operation: 'EDIÇÃO', oldValue: group.name, ip: String(ip),});

          const idList = await this.countExperimentGroupChildren(data.experimentGroupId);
          await this.setParcelasStatus(idList);
          return {status: 200, message: 'Experimento atualizado'};
        }

        if (data.newGroupId) {
          const idList = await this.countExperimentGroupChildren(Number(data.newGroupId));
          await this.setParcelasStatus(idList);
          return {status: 200, message: 'Experimento atualizado'};
        }
        
      }
      if (data.id) {
        const experimento: any = await this.experimentRepository.findOne(data.id);
        if (!experimento) return { status: 404, message: 'Experimento não encontrado' };
        if (data.experimentGroupId === null) {
          if (!(data.nlp || data.clp || data.comments)) {
            const parcelasId: any = [];
            await experimento.experiment_genotipe.forEach(async (parcela: any) => {
              parcelasId.push(parcela.id);
            });
            await experimentGenotipeController.update({ idList: parcelasId, status: 'SORTEADO', userId: data.userId });
            delete data.userId;
          }
        }
        const response = await this.experimentRepository.update(experimento.id, data);
        if (experimento.experimentGroupId) {
          await this.countExperimentGroupChildren(experimento.experimentGroupId);
        }
        if (!response.experimentGroupId) {
          if (!(data.nlp || data.clp || data.comments)) {
            await this.experimentRepository.update(response.id, { status: 'SORTEADO' });
          }
        }
        if (response) {
          return { status: 200, message: 'Experimento atualizado' };
        }
      } else {
        const transactionConfig = new TransactionConfig();
        const experimentRepositoryTransaction = new ExperimentRepository();
        experimentRepositoryTransaction.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
        try {
          await transactionConfig.transactionScope.run(async () => {
            for (const row in data) {
              await experimentRepositoryTransaction.updateTransaction(data[row].id, data[row]);
            }
          });
          return { status: 200, message: 'Experimento atualizado' };
        } catch (error: any) {
          handleError('Experimento controller', 'Update', error.message);
          throw new Error('[Controller] - Update Experimento erro update many');
        }
      }
      return { status: 400, message: 'Experimento não atualizado' };
    } catch (error: any) {
      handleError('Experimento controller', 'Update', error.message);
      throw new Error('[Controller] - Update Experimento erro');
    }
  }

  async delete(data: any) {
    const npeController = new NpeController();
    const genotypeTreatment = new GenotypeTreatmentController();
    try {
      const experimentGenotipeController = new ExperimentGenotipeController();
      const { response: experimentExist }: any = await this.getOne(Number(data.id));
      if (!experimentExist) return { status: 404, message: 'Experimento não encontrado' };
      if (experimentExist?.status === 'PARCIALMENTE ALOCADO' || experimentExist?.status === 'TOTALMENTE  ALOCADO') return { status: 400, message: 'Não é possível deletar.' };
      const { status } = await experimentGenotipeController.deleteAll(data.id);

      if (status === 200) {
        const response = await this.experimentRepository.delete(Number(data.id));
        if (response) {
          const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
          await this.reporteController.create({
            userId: data.userId, module: 'EXPERIMENTO', operation: 'EXCLUSÃO', oldValue: response.experimentName, ip: String(ip),
          });
        }
        const { response: assayList } = await this.assayListController.getOne(Number(experimentExist?.idAssayList));

        // filter experiments with status 'IMPORTADO'
        const experiments_importeds = assayList?.experiment.filter((experiment: any) => experiment.status === 'IMPORTADO');

        // if there are only experiments in 'IMPORTED' status or have no experiments, change status assayList to 'IMPORTADO' AND change status genotype_treatment to 'IMPORTADO'
        if (experiments_importeds?.length === assayList?.experiment.length || !assayList?.experiment.length) {
          await this.assayListController.update({
            id: experimentExist?.idAssayList,
            status: 'IMPORTADO',
          });
          assayList?.genotype_treatment.map(async (treatment: any) => {
            await genotypeTreatment.update({
              id: treatment.id,
              status_experiment: 'IMPORTADO',
            });
          });
        }

        const { response: ambiente } = await npeController.getAll({
          safraId: experimentExist?.idSafra,
          localId: experimentExist?.idLocal,
          focoId: experimentExist?.assay_list?.foco?.id,
          epoca: experimentExist?.period,
          filterCodTecnologia: experimentExist?.assay_list?.tecnologia?.cod_tec,
          typeAssayId: experimentExist?.assay_list?.type_assay?.id,
        });

        const { response: experiment } = await this.getAll({
          idSafra: experimentExist?.idSafra,
          idLocal: experimentExist?.idLocal,
          Foco: experimentExist?.assay_list?.foco?.id,
          Epoca: experimentExist?.period,
          Tecnologia: experimentExist?.assay_list?.tecnologia?.cod_tec,
          TypeAssay: experimentExist?.assay_list?.type_assay?.id,
          importValidate: true,
        });

        if (ambiente.length > 0 && experiment.length === 0) {
          await npeController.update({
            id: ambiente[0]?.id,
            status: 1,
            edited: 0,
          });
        }

        if (response) {
          return { status: 200, message: 'Experimento excluído' };
        }
      }
      return { status: 404, message: 'Experimento não excluído' };
    } catch (error: any) {
      handleError('Experimento controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete Experimento erro');
    }
  }

  async countExperimentGroupChildren(id: number) {
    const experimentGroupController = new ExperimentGroupController();
    const { response }: IReturnObject = await experimentGroupController.getOne(id);
    if (!response) throw new Error('GRUPO DE EXPERIMENTO NÃO ENCONTRADO');
    const idList = response.experiment?.map((item: any) => item.id);
    const experimentAmount = response.experiment?.length;
    let { status } = response;
    if (!response.status) {
      status = experimentAmount === 0 ? null : 'ETIQ. NÃO INICIADA';
    }
    
    if(experimentAmount === 0){
      
      await experimentGroupController.update({
        id: response.id,
        experimentAmount:experimentAmount,
        status:status,
        tagsToPrint: 0,
        tagsPrinted: 0,
        totalTags: 0,
      });
      
    } else {
      
      await experimentGroupController.update({
        id: response.id,
        experimentAmount:experimentAmount,
        status:status
      });
    }
    
    return idList;
  }

  async setParcelasStatus(idList: Array<number>) {
    const experimentGenotipeController = new ExperimentGenotipeController();
    await experimentGenotipeController.setStatus({ idList, status: 'EM ETIQUETAGEM' });
  }

  async handleExperimentStatus(id: number) {
    const { response }: any = await this.getOne(id);
    const allParcelas = response?.experiment_genotipe?.length;
    let toPrint = 0;
    let printed = 0;
    let allocated = 0;
    let status = '';
    response.experiment_genotipe?.map((parcelas: any) => {
      if (parcelas.status === 'IMPRESSO') {
        printed += 1;
      } else if (parcelas.status === 'EM ETIQUETAGEM' || parcelas.status === 'SORTEADO') {
        toPrint += 1;
      } else if (parcelas.status === 'ALOCADO') {
        allocated += 1;
      }
    });

    if (toPrint >= 1) {
      status = 'ETIQ. EM ANDAMENTO';
    }
    if (printed === allParcelas) {
      status = 'ETIQ. FINALIZADA';
    }
    if (toPrint === allParcelas) {
      status = 'ETIQ. NÃO INICIADA';
    }
    if (allocated === allParcelas) {
      status = 'TOTALMENTE ALOCADO';
    }
    if (allocated > 1) {
      status = 'PARCIALMENTE ALOCADO';
    }

    await this.update({ id, status });
  }
}
