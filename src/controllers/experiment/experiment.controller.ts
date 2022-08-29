import handleError from '../../shared/utils/handleError';
import { ExperimentRepository } from '../../repository/experiment.repository';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { AssayListController } from '../assay-list/assay-list.controller';
import { functionsUtils } from '../../shared/utils/functionsUtils';

export class ExperimentController {
  experimentRepository = new ExperimentRepository();

  assayListController = new AssayListController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    parameters.AND = [];
    try {
      if (options.filterExperimentName) {
        parameters.experimentName = JSON.parse(`{ "contains":"${options.filterExperimentName}" }`);
      }
      if (options.filterPeriod) {
        parameters.period = Number(options.filterPeriod);
      }
      if (options.filterRepetition) {
        parameters.repetitionsNumber = Number(options.filterRepetition);
      }
      if (options.filterFoco) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"foco": {"name": {"contains": "${options.filterFoco}" } } } }`));
      }
      if (options.filterTypeAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"type_assay": {"name": {"contains": "${options.filterTypeAssay}" } } } }`));
      }
      if (options.filterGli) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"gli": {"contains": "${options.filterTypeAssay}" } } }`));
      }
      if (options.filterTecnologia) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": { "name":  {"contains": "${options.filterTecnologia}" } } } }`));
      }
      if (options.filterDelineamento) {
        parameters.delineamento = JSON.parse(`{ "name": {"contains": "${options.filterDelineamento}" } }`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        select.assay_list = {};
        select.assay_list.select = {};
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] === 'protocolName') {
            select.assay_list.select.protocol_name = true;
          } else if (objSelect[item] === 'type_assay') {
            select.assay_list.select.type_assay = true;
          } else if (objSelect[item] === 'gli') {
            select.assay_list.select.gli = true;
          } else if (objSelect[item] === 'tecnologia') {
            select.assay_list.select.tecnologia = true;
          } else if (objSelect[item] === 'foco') {
            select.assay_list.select.foco = true;
          } else if (objSelect[item] !== 'action') {
            select[objSelect[item]] = true;
          }
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          idSafra: true,
          density: true,
          repetitionsNumber: true,
          period: true,
          nlp: true,
          clp: true,
          eel: true,
          experimentName: true,
          comments: true,
          orderDraw: true,
          status: true,
          assay_list: {
            select: {
              gli: true,
              bgm: true,
              protocol_name: true,
              status: true,
              genotype_treatment: true,
              tecnologia: {
                select: {
                  name: true,
                  cod_tec: true,
                },
              },
              foco: {
                select: {
                  name: true,
                },
              },
              type_assay: {
                select: {
                  name: true,
                },
              },
              safra: {
                select: {
                  safraName: true,
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
              trat_repeticao: true,
            },
          },
        };
      }

      if (options.idSafra) {
        parameters.idSafra = Number(options.idSafra);
      }

      if (options.id_assay_list) {
        parameters.idAssayList = Number(options.id_assay_list);
      }

      if (options.experimentName) {
        parameters.experimentName = options.idSafra;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.experimentRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((item: any) => {
        const newItem = item;
        newItem.countNT = functionsUtils
          .countChildrenForSafra(item.assay_list.genotype_treatment, Number(options.idSafra));
        newItem.npeQT = item.countNT * item.repetitionsNumber;
        return newItem;
      });

      if (!response && response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'Nenhum experimento encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Experimento controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Experimento erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.experimentRepository.findOne(id);

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
      const experimento: any = await this.experimentRepository.findOne(data.id);

      if (!experimento) return { status: 404, message: 'Experimento não encontrado' };

      const response = await this.experimentRepository.update(experimento.id, data);
      if (response) {
        return { status: 200, message: 'Experimento atualizado' };
      }
      return { status: 400, message: 'Experimento não atualizado' };
    } catch (error: any) {
      handleError('Experimento controller', 'Update', error.message);
      throw new Error('[Controller] - Update Experimento erro');
    }
  }

  async delete(id: number) {
    try {
      const { response: experimentExist } = await this.getOne(Number(id));

      if (!experimentExist) return { status: 404, message: 'Experimento não encontrado' };

      const response = await this.experimentRepository.delete(Number(id));
      const {
        response: assayList,
      } = await this.assayListController.getOne(Number(experimentExist?.idAssayList));
      if (!assayList?.experiment.length) {
        await this.assayListController.update({
          id: experimentExist?.idAssayList,
          status: 'IMPORTADO',
        });
      }

      if (response) {
        return { status: 200, message: 'Experimento excluído' };
      }
      return { status: 404, message: 'Experimento não excluído' };
    } catch (error: any) {
      handleError('Experimento controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete Experimento erro');
    }
  }
}
