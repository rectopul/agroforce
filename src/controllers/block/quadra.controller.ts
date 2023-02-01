import createXls from 'src/helpers/api/xlsx-global-download';
import handleError from '../../shared/utils/handleError';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { QuadraRepository } from '../../repository/quadra.repository';
import { ReporteRepository } from '../../repository/reporte.repository';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';
import { ReporteController } from '../reportes/reporte.controller';

export class QuadraController {
  quadraRepository = new QuadraRepository();

  reporteController = new ReporteController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const { status, sheet } = await createXls(options, options.fileNumber == 1 ? 'QUADRAS-EXCEL' : options.fileNumber == 2 ? 'QUADRAS-EXCEL_SINTETICO' : 'QUADRAS-EXCEL_ANALYTICS');
        return { status, response: sheet };
      }
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        parameters.cod_quadra = JSON.parse(`{"contains":"${options.filterSearch}"}`);
      }

      if (options.filterPreparation) {
        parameters.local = JSON.parse(`{ "name_local_culture": { "contains":"${options.filterPreparation}"} }`);
      }

      if (options.filterSchema) {
        parameters.esquema = JSON.parse(`{"contains":"${options.filterSchema}"}`);
      }

      if (options.allocation) {
        parameters.allocation = JSON.parse(`{"contains":"${options.allocation}"}`);
      }

      if (options.filterPFrom || options.filterPTo) {
        if (options.filterPFrom && options.filterPTo) {
          parameters.linha_p = JSON.parse(`{"gte": ${Number(options.filterPFrom)}, "lte": ${Number(options.filterPTo)} }`);
        } else if (options.filterPFrom) {
          parameters.linha_p = JSON.parse(`{"gte": ${Number(options.filterPFrom)} }`);
        } else if (options.filterPTo) {
          parameters.linha_p = JSON.parse(`{"lte": ${Number(options.filterPTo)} }`);
        }
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item: any) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          cod_quadra: true,
          local: {
            select: {
              name_local_culture: true,
              name_locality: true,
              quadra: true,
            },
          },
          esquema: true,
          larg_q: true,
          comp_p: true,
          linha_p: true,
          comp_c: true,
          tiro_fixo: true,
          disparo_fixo: true,
          local_plantio: true,
          q: true,
          safra: { select: { safraName: true } },
          allocation: true,
          status: true,
          AllocatedExperiment: true,
          experiment: {
            select: {
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
                  genotype_treatment: { include: { genotipo: true } },
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
              experiment_genotipe: true,
            },
          },
        };
      }

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.cod_quadra) {
        parameters.cod_quadra = options.cod_quadra;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.quadraRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );
      if (response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Quadra Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Quadra erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response: any = await this.quadraRepository.findOne(id);
      if (!response) throw new Error('Item não encontrado');
      response.tf = response.dividers[response.dividers.length - 1].t4_f;

      return { status: 200, response };
    } catch (error: any) {
      handleError('Quadra Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Quadra erro');
    }
  }

  async create(data: any) {
    try {
      const response = await this.quadraRepository.create(data);
      return { status: 200, message: 'Quadra cadastrada', response };
    } catch (error: any) {
      handleError('Quadra Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Quadra erro');
    }
  }

  async update(data: any) {
    try {
      if (data) {
        const quadra: any = await this.quadraRepository.update(data.id, data);
        const operation = data.status === 1 ? 'ATIVAÇÃO' : 'INATIVAÇÃO';
        if (!quadra) return { status: 400, message: 'Quadra não encontrado' };
        if (data.status === 1 || data.status === 0) {
          const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
          await this.reporteController.create({
            userId: data.created_by, module: 'QUADRA', operation, oldValue: quadra.cod_quadra, ip: String(ip),
          });
        }
        return { status: 200, message: 'Quadra atualizada' };
      }
      const quadra = await this.quadraRepository.findOne(data.id);

      if (!quadra) return { status: 400, message: 'Quadra não encontrado' };

      await this.quadraRepository.update(quadra.id, data);

      return { status: 200, message: 'Quadra atualizado' };
    } catch (error: any) {
      handleError('Quadra Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Quadra erro');
    }
  }
}
