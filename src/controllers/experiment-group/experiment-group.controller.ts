/* eslint-disable no-restricted-syntax */
import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { ExperimentGroupRepository } from '../../repository/experiment-group.repository';
import { IExperiments } from '../../interfaces/listas/experimento/experimento.interface';
import { ExperimentController } from '../experiment/experiment.controller';
import { ExperimentGenotipeController } from '../experiment-genotipe.controller';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';
import { ReporteController } from '../reportes/reporte.controller';

export class ExperimentGroupController {
  experimentGroupRepository = new ExperimentGroupRepository();

  experimentController = new ExperimentController();

  reporteController = new ReporteController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    try {
      options = await removeEspecialAndSpace(options);
      if (options.filterExperimentGroup) {
        parameters.name = JSON.parse(`{"contains":"${options.filterExperimentGroup}"}`);
      }

      if (options.filterQtdExpTo || options.filterQtdExpFrom) {
        if (options.filterQtdExpTo && options.filterQtdExpFrom) {
          parameters.experimentAmount = JSON.parse(`{"gte": ${Number(options.filterQtdExpTo)}, "lte": ${Number(options.filterQtdExpFrom)} }`);
        } else if (options.filterQtdExpTo) {
          parameters.experimentAmount = JSON.parse(`{"gte": ${Number(options.filterQtdExpTo)} }`);
        } else if (options.filterQtdExpFrom) {
          parameters.experimentAmount = JSON.parse(`{"lte": ${Number(options.filterQtdExpFrom)} }`);
        }
      }

      if (options.filterTotalEtiqImprimirTo || options.filterTotalEtiqImprimirFrom) {
        if (options.filterTotalEtiqImprimirTo && options.filterTotalEtiqImprimirFrom) {
          parameters.tagsToPrint = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImprimirTo)}, "lte": ${Number(options.filterTotalEtiqImprimirFrom)} }`);
        } else if (options.filterTotalEtiqImprimirTo) {
          parameters.tagsToPrint = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImprimirTo)} }`);
        } else if (options.filterTotalEtiqImprimirFrom) {
          parameters.tagsToPrint = JSON.parse(`{"lte": ${Number(options.filterTotalEtiqImprimirFrom)} }`);
        }
      }

      if (options.filterTotalEtiqImpressasTo || options.filterTotalEtiqImpressasFrom) {
        if (options.filterTotalEtiqImpressasTo && options.filterTotalEtiqImpressasFrom) {
          parameters.tagsPrinted = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImpressasTo)}, "lte": ${Number(options.filterTotalEtiqImpressasFrom)} }`);
        } else if (options.filterTotalEtiqImpressasTo) {
          parameters.tagsPrinted = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImpressasTo)} }`);
        } else if (options.filterTotalEtiqImpressasFrom) {
          parameters.tagsPrinted = JSON.parse(`{"lte": ${Number(options.filterTotalEtiqImpressasFrom)} }`);
        }
      }

      if (options.filterTotalEtiqTo || options.filterTotalEtiqFrom) {
        if (options.filterTotalEtiqTo && options.filterTotalEtiqFrom) {
          parameters.totalTags = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqTo)}, "lte": ${Number(options.filterTotalEtiqFrom)} }`);
        } else if (options.filterTotalEtiqTo) {
          parameters.totalTags = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqTo)} }`);
        } else if (options.filterTotalEtiqFrom) {
          parameters.totalTags = JSON.parse(`{"lte": ${Number(options.filterTotalEtiqFrom)} }`);
        }
      }

      if (options.safraId) {
        parameters.safraId = Number(options.safraId);
      }

      if (options.id_safra) {
        parameters.safraId = Number(options.id_safra);
      }

      if (options.id) {
        parameters.id = Number(options.id);
      }

      if (options.notId) {
        parameters.id = JSON.parse(`{"not": ${Number(options.notId)} }`);
      }

      if (options.filterQtdExpFrom || options.filterQtdExpTo) {
        if (options.filterQtdExpFrom && options.filterQtdExpTo) {
          parameters.experimentAmount = JSON.parse(`{"gte": ${Number(options.filterQtdExpFrom)}, "lte": ${Number(options.filterQtdExpTo)} }`);
        } else if (options.filterQtdExpFrom) {
          parameters.experimentAmount = JSON.parse(`{"gte": ${Number(options.filterQtdExpFrom)} }`);
        } else if (options.filterQtdExpTo) {
          parameters.experimentAmount = JSON.parse(`{"lte": ${Number(options.filterQtdExpTo)} }`);
        }
      }

      if (options.filterTotalEtiqImprimirFrom || options.filterTotalEtiqImprimirTo) {
        if (options.filterTotalEtiqImprimirFrom && options.filterTotalEtiqImprimirTo) {
          parameters.tagsToPrint = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImprimirFrom)}, "lte": ${Number(options.filterTotalEtiqImprimirTo)} }`);
        } else if (options.filterTotalEtiqImprimirFrom) {
          parameters.tagsToPrint = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImprimirFrom)} }`);
        } else if (options.filterTotalEtiqImprimirTo) {
          parameters.tagsToPrint = JSON.parse(`{"lte": ${Number(options.filterTotalEtiqImprimirTo)} }`);
        }
      }

      if (options.filterTotalEtiqImpressasFrom || options.filterTotalEtiqImpressasTo) {
        if (options.filterTotalEtiqImpressasFrom && options.filterTotalEtiqImpressasTo) {
          parameters.tagsPrinted = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImpressasFrom)}, "lte": ${Number(options.filterTotalEtiqImpressasTo)} }`);
        } else if (options.filterTotalEtiqImpressasFrom) {
          parameters.tagsPrinted = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqImpressasFrom)} }`);
        } else if (options.filterTotalEtiqImpressasTo) {
          parameters.tagsPrinted = JSON.parse(`{"lte": ${Number(options.filterTotalEtiqImpressasTo)} }`);
        }
      }

      if (options.filterTotalEtiqFrom || options.filterTotalEtiqTo) {
        if (options.filterTotalEtiqFrom && options.filterTotalEtiqTo) {
          parameters.totalTags = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqFrom)}, "lte": ${Number(options.filterTotalEtiqTo)} }`);
        } else if (options.filterTotalEtiqFrom) {
          parameters.totalTags = JSON.parse(`{"gte": ${Number(options.filterTotalEtiqFrom)} }`);
        } else if (options.filterTotalEtiqTo) {
          parameters.totalTags = JSON.parse(`{"lte": ${Number(options.filterTotalEtiqTo)} }`);
        }
      }

      if (options.filterStatus) {
        parameters.OR = [];
        const statusParams = options.filterStatus[0].split(',');
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[0]}" } }`));
        parameters.OR.push(JSON.parse(`{"status": {"equals": "${statusParams[1]}" } }`));
      }

      const select = {
        id: true,
        name: true,
        safra: {
          select: {
            safraName: true,
            culture: true,
          },
        },
        experimentAmount: true,
        tagsToPrint: true,
        tagsPrinted: true,
        totalTags: true,
        status: true,
        experiment: true,
      };

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.experimentGroupRepository.findAll(
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
      handleError('Grupo de experimento controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Grupo de experimento erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.experimentGroupRepository.findById(id);

      if (!response) throw new Error('Grupo de experimento não encontrada');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Grupo de experimento erro');
    }
  }

  async create(data: any) {
    try {
      const assayListAlreadyExist = await this.experimentGroupRepository.findByName(
        { name: data.name, safraId: data.safraId },
      );

      if (assayListAlreadyExist) return { status: 400, message: 'Grupo de experimento já cadastrados' };

      const { ip } = await fetch('https://api.ipify.org/?format=json')
        .then((results) => results.json())
        .catch(() => '0.0.0.0');
      await this.reporteController.create({
        userId: data.createdBy, module: 'GRUPO DE ETIQUETAGEM', operation: 'CRIAÇÃO', oldValue: data.name, ip: String(ip),
      });

      const response = await this.experimentGroupRepository.create(data);

      return { status: 200, response, message: 'Grupo de experimento cadastrada' };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'Create', error.message);
      throw new Error('[Controller] - Create Grupo de experimento erro');
    }
  }

  async update(data: any) {
    try {
      const experimentGroup: any = await this.experimentGroupRepository.findById(data.id);

      // if origin data from edit experimentGroup [operacao/etiquetagem/atualizar?id=]
      if (data.safraId && data.name) {
        const { response: validate }: any = await this.getAll({
          safraId: data.safraId,
          filterExperimentGroup: data.name,
          notId: data.id,
        });

        if (validate.length > 0) return { status: 404, message: 'Nome do grupo já existe na safra' };
      }

      if (!experimentGroup) return { status: 404, message: 'Grupo de experimento não existente' };

      const response = await this.experimentGroupRepository.update(Number(data.id), data);

      return { status: 200, response, message: 'Grupo de experimento atualizado' };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'Update', error.message);
      throw new Error('[Controller] - Update Grupo de experimento erro');
    }
  }

  async delete(data: any) {
    try {
      const { status, response }: any = await this.getOne(Number(data.id));
      response.experiment.forEach(async (item: any) => {
        await this.experimentController.update({ id: item.id, experimentGroupId: null, status: 'SORTEADO' });
      });

      if (status !== 200) return { status: 400, message: 'Grupo de experimento não encontrada' };

      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
      await this.reporteController.create({
        userId: data.userId, module: 'GRUPO DE ETIQUETAGEM', operation: 'EXCLUSÃO', oldValue: response.name, ip: String(ip),
      });

      await this.experimentGroupRepository.delete(Number(data.id));
      return { status: 200, message: 'Grupo de experimento excluída' };
    } catch (error: any) {
      handleError('Grupo de experimento controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete Grupo de experimento erro');
    }
  }

  async countEtiqueta(id: number, idExperiment: any, createGroup?: boolean) {
    const { response }: any = await this.getOne(id);
    let totalTags = 0;
    let tagsToPrint = 0;
    let tagsPrinted = 0;
    /*
    response.experiment.map((item: any) => {
      item.experiment_genotipe.map((parcelas: any) => {
        totalTags += 1;
        if (parcelas.status === 'EM ETIQUETAGEM') {
          tagsToPrint += 1;
        } else if (parcelas.status === 'IMPRESSO') {
          tagsPrinted += 1;
        }
      });
    });/**/

    for (const experiment of response.experiment) {
      for (const parcelas of experiment.experiment_genotipe) {
        totalTags += 1;
        if (parcelas.status === 'EM ETIQUETAGEM') {
          tagsToPrint += 1;
        } else if (parcelas.status === 'IMPRESSO') {
          tagsPrinted += 1;
        }
      }
    }
    console.log('experiment-group.controller.ts', 'countEtiqueta', 'totalTags', totalTags, 'tagsToPrint', tagsToPrint, 'tagsPrinted', tagsPrinted);
    const { status: statusUpdate, response: responseUpdate } = await this.update({
      id,
      totalTags,
      tagsToPrint,
      tagsPrinted,
    });

    if(createGroup !== true) {
      if (typeof idExperiment === 'number') {
        await this.experimentController.handleExperimentStatus(idExperiment);
      } else {
        for (const experimentId of Object.values(idExperiment)) {
          await this.experimentController.handleExperimentStatus(<number>experimentId);
        }
      }
      
    }

    await this.handleGroupStatus(id);
    
  }

  async handleGroupStatus(id: number) {
    const { response } : any = await this.getOne(id);
    const allExperiments = response?.experiment?.length;
    let toPrint = 0;
    let printed = 0;
    let initial = 0;
    let status = '';
    await response?.experiment?.map((experiment: any) => {
      if (experiment.status === 'ETIQ. FINALIZADA') {
        printed += 1;
      } else if (experiment.status === 'ETIQ. EM ANDAMENTO') {
        toPrint += 1;
      } else if (experiment.status === 'ETIQ. NÃO INICIADA' || experiment.status === 'SORTEADO') {
        initial += 1;
      }
    });

    if (toPrint >= 1) {
      status = 'ETIQ. EM ANDAMENTO';
    } else if (printed === allExperiments) {
      status = 'ETIQ. FINALIZADA';
    } else if (initial === allExperiments) {
      status = 'ETIQ. NÃO INICIADA';
    } else {
      status = 'ETIQ. EM ANDAMENTO';
    }
    
    await this.update({ id, status });
  }
}
