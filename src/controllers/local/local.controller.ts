import createXls from 'src/helpers/api/xlsx-global-download';
import handleError from '../../shared/utils/handleError';
import { LocalRepository } from '../../repository/local.repository';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';

export class LocalController {
  localRepository = new LocalRepository();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    let select: any = [];
    const equalsOrContains = options.importValidate ? 'equals' : 'contains';
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'LOCAL-LUGAR_CULTURA');
        return { status: 200, response: sheet };
      }

      if (options.filterNameLocalCulture) {
        parameters.name_local_culture = JSON.parse(`{ "${equalsOrContains}":"${options.filterNameLocalCulture}" }`);
      }

      if (options.filterLabel) {
        parameters.label = JSON.parse(`{ "${equalsOrContains}":"${options.filterLabel}" }`);
      }

      if (options.filterMloc) {
        parameters.mloc = JSON.parse(`{ "${equalsOrContains}":"${options.filterMloc}" }`);
      }

      if (options.filterAdress) {
        parameters.adress = JSON.parse(`{ "${equalsOrContains}":"${options.filterAdress}" }`);
      }

      if (options.filterLabelCountry) {
        parameters.label_country = JSON.parse(`{ "${equalsOrContains}":"${options.filterLabelCountry}" }`);
      }

      if (options.filterLabelRegion) {
        parameters.label_region = JSON.parse(`{ "${equalsOrContains}":"${options.filterLabelRegion}" }`);
      }

      if (options.filterNameLocality) {
        parameters.name_locality = JSON.parse(`{ "${equalsOrContains}":"${options.filterNameLocality}" }`);
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
        Object.keys(objSelect).forEach((item: any) => {
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
          cultureUnity: true,
        };
      }

      const response = await this.localRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((local: any) => {
        const dts = local.cultureUnity.map((unity: any) => unity.dt_export);
        const maxDt = Math.max(...dts);
        local.dt_export = (maxDt) ? new Date(maxDt): '';

        const dts_rde = local.cultureUnity.map((unity: any) => Number(unity.dt_rde));
        const maxDtRde = Math.max(...dts_rde);
        local.dt_rde = (maxDtRde) ? maxDtRde: '';
        
      });

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
      const localCultura: any = await this.localRepository.findOne(data.id);

      if (!localCultura) return { status: 404, message: 'Local de cultura não existente' };

      const response = await this.localRepository.update(data.id, data);
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
