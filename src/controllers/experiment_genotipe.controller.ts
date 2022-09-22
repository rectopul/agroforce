import { ExperimentGenotipeRepository } from 'src/repository/experiment_genotipe.repository';
import { IReturnObject } from '../interfaces/shared/Import.interface';
import handleError from '../shared/utils/handleError';
import { ExperimentGroupController } from './experiment-group/experiment-group.controller';
import { ExperimentController } from './experiment/experiment.controller';
import { PrintHistoryController } from './print-history/print-history.controller';

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
      if (options.filterFoco) {
        parameters.foco = JSON.parse(`{ "name": { "contains": "${options.filterFoco}" } }`);
      }

      if (options.filterTypeAssay) {
        parameters.type_assay = JSON.parse(`{ "name": { "contains": "${options.filterTypeAssay}" } }`);
      }

      if (options.filterNameTec) {
        parameters.tecnologia = JSON.parse(`{ "name": { "contains": "${options.filterNameTec}" } }`);
      }

      if (options.filterCodTec) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": {"cod_tec": {"contains": "${options.filterCodTec}" } } }`));
      }

      if (options.filterTechnology) {
        parameters.AND.push(JSON.parse(`{ "tecnologia": {"name": "${options.filterTechnology}" } }`));
      }

      if (options.filterExperimentName) {
        parameters.AND.push(JSON.parse(`{ "experiment": {"experimentName": {"contains": "${options.filterExperimentName}" } } }`));
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
        parameters.OR.push(JSON.parse(`{ "experiment": {"status": "${statusParams[0]}" } } `));
        parameters.OR.push(JSON.parse(`{ "experiment": {"status": "${statusParams[1]}" } } `));
      }
      console.log(parameters);
      console.log(options);
      if (options.ensaio) {
        parameters.AND.push(JSON.parse(`{ "type_assay": {"name": {"contains": "${options.ensaio}" } } }`));
      }

      if (options.filterLocal) {
        parameters.experiment = JSON.parse(`{ "local": { "name_local_culture": { "contains": "${options.filterLocal}" } } }`);
      }

      if (options.filterGenotypeName) {
        parameters.name_genotipo = JSON.parse(`{ "contains": "${options.filterGenotypeName}" }`);
      }

      if (options.filterNca) {
        parameters.nca = JSON.parse(`{ "contains": "${options.filterNca}" }`);
      }

      if (options.filterRepetitionFrom || options.filterRepetitionTo) {
        if (options.filterRepetitionFrom && options.filterRepetitionTo) {
          parameters.rep = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)}, "lte": ${Number(options.filterRepetitionTo)} }`);
        } else if (options.filterRepetitionFrom) {
          parameters.rep = JSON.parse(`{"gte": ${Number(options.filterRepetitionFrom)} }`);
        } else if (options.filterRepetitionTo) {
          parameters.rep = JSON.parse(`{"lte": ${Number(options.filterRepetitionTo)} }`);
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

      // if (options.npe) {
      //   parameters.npe = Number(options.npe);
      // }

      const select = {
        id: true,
        safra: { select: { safraName: true } },
        foco: { select: { name: true } },
        type_assay: { select: { name: true } },
        tecnologia: { select: { name: true, cod_tec: true } },
        gli: true,
        status: true,
        experiment: {
          select: {
            experimentName: true,
            status: true,
            delineamento: true,
            local: {
              select:
                { name_local_culture: true },
            },
          },
        },
        idGenotipo: true,
        rep: true,
        nt: true,
        npe: true,
        genotipo: true,
        nca: true,
        idLote: true,
        status_t: true,
      };

      if (options.experimentGroupId) {
        const idList = await this.generateIdList(Number(options.experimentGroupId));
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
        parameters.AND.push(JSON.parse(`{ "safra": {"safraName": {"contains": "${options.safraName}" } } }`));
      }

      if (options.idSafra) {
        parameters.idSafra = Number(options.idSafra);
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
        parameters.nt = Number(options.nt);
      }

      if (options.gli) {
        parameters.gli = options.gli;
      }

      if (options.npe) {
        parameters.npe = Number(options.npe);
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

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

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

  async create(data: object | any) {
    try {
      const response = await this.ExperimentGenotipeRepository.createMany(data);
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
      throw new Error('[Controller] - getOne Grupo de experimento erro');
    }
  }

  async update({ idList, status, userId }: any) {
    try {
      await this.ExperimentGenotipeRepository.printed(idList, status);
      const { response: parcelas } = await this.getOne(idList[0]);
      const { response }: any = await this.experimentController.getOne(parcelas?.idExperiment);
      await this.experimentGroupController.countEtiqueta(
        response.experimentGroupId,
        parcelas?.idExperiment,
      );
      await this.printedHistoryController.create({ idList, userId });
    } catch (error: any) {
      handleError('Parcelas controller', 'Update', error.message);
      throw new Error('[Controller] - Update Parcelas erro');
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
      await this.ExperimentGenotipeRepository.updateStatus(idExperiment, status);
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
      const response: any = await this.ExperimentGenotipeRepository.findById(data.id);

      if (!response) return { status: 404, response, message: 'Tratamentos do genótipo não existente' };

      const check = await this.ExperimentGenotipeRepository.update(data.id, data);

      return { status: 200, message: 'experimento do genótipo atualizado' };
    } catch (error: any) {
      handleError('Tratamento do experimento do controlador', 'Create', error.message);
      throw new Error('[Controller] - Erro ao criar esboço de tratamento do experimento');
    }
  }
}
