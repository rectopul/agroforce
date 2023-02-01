import createXls from 'src/helpers/api/xlsx-global-download';
import { LayoutQuadraRepository } from '../../repository/layout-quadra.repository';
import { ReporteRepository } from '../../repository/reporte.repository';
import handleError from '../../shared/utils/handleError';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';
import { LayoutChildrenController } from '../layout-children.controller';
import { ReporteController } from '../reportes/reporte.controller';

export class LayoutQuadraController {
  layoutQuadraRepository = new LayoutQuadraRepository();

  layoutChildrenController = new LayoutChildrenController();

  reporteController = new ReporteController();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'QUADRAS-LAYOUT');
        return { status: 200, response: sheet };
      }
      if (options.filterShotsFrom || options.filterShotsTo) {
        if (options.filterShotsFrom && options.filterShotsTo) {
          parameters.disparos = JSON.parse(`{"gte": ${Number(options.filterShotsFrom)}, "lte": ${Number(options.filterShotsTo)} }`);
        } else if (options.filterShotsFrom) {
          parameters.disparos = JSON.parse(`{"gte": ${Number(options.filterShotsFrom)} }`);
        } else if (options.filterShotsTo) {
          parameters.disparos = JSON.parse(`{"lte": ${Number(options.filterShotsTo)} }`);
        }
      }

      if (options.filterPopFrom || options.filterPopTo) {
        if (options.filterPopFrom && options.filterPopTo) {
          parameters.tiros = JSON.parse(`{"gte": ${Number(options.filterPopFrom)}, "lte": ${Number(options.filterPopTo)} }`);
        } else if (options.filterPopFrom) {
          parameters.tiros = JSON.parse(`{"gte": ${Number(options.filterPopFrom)} }`);
        } else if (options.filterPopTo) {
          parameters.tiros = JSON.parse(`{"lte": ${Number(options.filterPopTo)} }`);
        }
      }

      if (options.filterParcelFrom || options.filterParcelTo) {
        if (options.filterParcelFrom && options.filterParcelTo) {
          parameters.parcelas = JSON.parse(`{"gte": ${Number(options.filterParcelFrom)}, "lte": ${Number(options.filterParcelTo)} }`);
        } else if (options.filterParcelFrom) {
          parameters.parcelas = JSON.parse(`{"gte": ${Number(options.filterParcelFrom)} }`);
        } else if (options.filterParcelTo) {
          parameters.parcelas = JSON.parse(`{"lte": ${Number(options.filterParcelTo)} }`);
        }
      }

      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterCodigo) {
        parameters.id = Number(options.filterCodigo);
      }

      if (options.filterEsquema) {
        parameters.esquema = JSON.parse(`{"contains":"${options.filterEsquema}"}`);
      }

      if (options.filterDisparos) {
        parameters.disparos = Number(options.filterDisparos);
      }

      if (options.filterTiros) {
        parameters.tiros = Number(options.filterTiros);
      }

      if (options.filterPlantadeira) {
        parameters.plantadeira = JSON.parse(`{"contains":"${options.filterPlantadeira}"}`);
      }

      if (options.filterParcelas) {
        parameters.parcelas = Number(options.filterParcelas);
      }

      if (options.esquema) {
        parameters.esquema = options.esquema;
      }

      if (options.status) {
        parameters.status = Number(options.status);
      }

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const select = {
        id: true,
        esquema: true,
        plantadeira: true,
        tiros: true,
        disparos: true,
        parcelas: true,
        status: true,
        id_culture: true,
      };

      const response = await this.layoutQuadraRepository.findAll(
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
      handleError('Layout Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Layout erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.layoutQuadraRepository.findOne(id);
      if (!response) {
        return { status: 400, response: [], message: 'Layout não encontrado' };
      }
      return { status: 200, response };
    } catch (error: any) {
      handleError('Layout Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Layout erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.layoutQuadraRepository.create(data);
      if (response) {
        return { status: 200, message: 'Layout criado', response };
      }
      return { status: 400, message: 'Falha ao criar layout' };
    } catch (error: any) {
      handleError('Layout Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Layout erro');
    }
  }

  async update(data: any) {
    try {
      if (data) {
        const operation = data.status === 1 ? 'ATIVAÇÃO' : 'INATIVAÇÃO';
        const layout = await this.layoutQuadraRepository.update(data.id, data);
        if (data.status === 1 || data.status === 0) {
          const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
          await this.reporteController.create({
            userId: data.created_by, module: 'LAYOUT DE QUADRA', operation, oldValue: layout.esquema, ip: String(ip),
          });
        }
        if (!layout) return { status: 400, message: 'Layout de quadra não encontrado' };
        return { status: 200, message: 'Layout de quadra atualizada' };
      }

      const response = await this.layoutQuadraRepository.update(data.id, data);
      if (response) {
        return { status: 200, message: { message: 'Layout atualizado com sucesso' } };
      }
      return { status: 400, message: { message: 'erro ao tentar fazer o update' } };
    } catch (error: any) {
      handleError('Layout Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Layout erro');
    }
  }
}
