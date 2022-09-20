import handleError from '../../shared/utils/handleError';
import { LocalRepository } from '../../repository/local.repository';
import { ReporteRepository } from '../../repository/reporte.repository';

export class LocalController {
  localRepository = new LocalRepository();

  reporteRepository = new ReporteRepository();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    let select: any = [];
    try {
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterNameLocalCulture) {
        parameters.name_local_culture = JSON.parse(`{ "contains":"${options.filterNameLocalCulture}" }`);
      }

      if (options.filterLabel) {
        parameters.label = JSON.parse(`{ "contains":"${options.filterLabel}" }`);
      }

      if (options.filterMloc) {
        parameters.mloc = JSON.parse(`{ "contains":"${options.filterMloc}" }`);
      }

      if (options.filterAdress) {
        parameters.adress = JSON.parse(`{ "contains":"${options.filterAdress}" }`);
      }

      if (options.filterLabelCountry) {
        parameters.label_country = JSON.parse(`{ "contains":"${options.filterLabelCountry}" }`);
      }

      if (options.filterLabelRegion) {
        parameters.label_region = JSON.parse(`{ "contains":"${options.filterLabelRegion}" }`);
      }

      if (options.filterNameLocality) {
        parameters.name_locality = JSON.parse(`{ "contains":"${options.filterNameLocality}" }`);
      }

      if (options.id_local_culture) {
        parameters.id_local_culture = Number(options.id_local_culture);
      }

      if (options.name_local_culture) {
        parameters.name_local_culture = options.name_local_culture;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          name_local_culture: true,
          label: true,
          mloc: true,
          adress: true,
          label_country: true,
          label_region: true,
          name_locality: true,
          status: true,
          cultureUnity: true,
          dt_import: true,
        };
      }

      const response = await this.localRepository.findAll(
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
      handleError('Local Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Local erro');
    }
  }

  async getOne(id: number) {
    try {
      if (id) {
        const response = await this.localRepository.findOne(id);
        if (response) {
          return { status: 200, response };
        }
        return { status: 404, response: [], message: 'Local não existe' };
      }
      return { status: 405, response: [], message: 'ID não recebido' };
    } catch (error: any) {
      handleError('Local Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Local erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.localRepository.create(data);
      if (response) {
        return { status: 200, response, message: 'Local criado' };
      }
      return { status: 400, message: 'Erro ao criar local' };
    } catch (error: any) {
      handleError('Local Controller', 'Create', error.message);
      throw new Error('[Controller] - Create Local erro');
    }
  }

  async update(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json());

      const localCultura: any = await this.localRepository.findOne(data.id);

      if (!localCultura) return { status: 404, message: 'Local de cultura não existente' };

      const response = await this.localRepository.update(data.id, data);
      if (response.status === 0) {
        await this.reporteRepository.create({
          madeBy: response.created_by, module: 'Lugar Cultura', operation: 'Inativação', name: response.label, ip: JSON.stringify(ip), idOperation: response.id,
        });
      }
      if (response) {
        return { status: 200, message: 'Local de cultura atualizado' };
      }
      return { status: 400, message: 'Não foi possível atualizar' };
    } catch (error: any) {
      handleError('Local Controller', 'Update', error.message);
      throw new Error('[Controller] - Update Local erro');
    }
  }
}
