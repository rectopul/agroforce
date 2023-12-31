import createXls from 'src/helpers/api/xlsx-global-download';
import handleError from '../shared/utils/handleError';
import { FocoRepository } from '../repository/foco.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';
import { ReporteController } from './reportes/reporte.controller';

export class FocoController {
  public readonly required = 'Campo obrigatório';

  focoRepository = new FocoRepository();

  reporteController = new ReporteController();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    const equalsOrContains = options.importValidate ? 'equals' : 'contains';
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'ENSAIO-FOCO');
        return { status: 200, response: sheet };
      }
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        parameters.name = JSON.parse(`{ "${equalsOrContains}": "${options.filterSearch}" }`);
      }

      if (options.notId) {
        parameters.id = JSON.parse(`{"not": ${Number(options.notId)} }`);
      }

      if (options.id_culture) {
        parameters.id_culture = Number(options.id_culture);
      }

      if (options.filterGroupFrom || options.filterGroupTo) {
        if (options.filterGroupFrom && options.filterGroupTo) {
          parameters.group = JSON.parse(` { "some" : {"group": {"gte": ${Number(options.filterGroupFrom)}, "lte": ${Number(options.filterGroupTo)} } , "id_safra": ${Number(options.id_safra)}} }`);
        } else if (options.filterGroupFrom) {
          parameters.group = JSON.parse(`{ "some" : {"group": {"gte": ${Number(options.filterGroupFrom)} } , "id_safra": ${Number(options.id_safra)}} }`);
        } else if (options.filterGroupTo) {
          parameters.group = JSON.parse(` { "some" : {"group": {"lte": ${Number(options.filterGroupTo)} } , "id_safra": ${Number(options.id_safra)}} }`);
        }
      }

      const select = {
        id: true,
        id_culture: true,
        culture: true,
        name: true,
        group: true,
        status: true,
      };

      if (options.name) {
        parameters.name = options.name;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy && options.orderBy != 'group.group') {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      } else {
        orderBy = '{ "name": "desc"}';
      }

      const response: object | any = await this.focoRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (response.total > 0) {
        response?.map((item: any) => {
          item.group?.map((group: any) => {
            if (group.id_safra === Number(options.id_safra)) {
              if (group.group.toString().length === 1) {
                group.group = `0${group.group.toString()}`;
                item.group = group;
              } else {
                item.group = group;
              }
            }
          });
        });
      }

      if (options.orderBy == 'group.group' && options.typeOrder == 'desc') {
        response.sort((a: any, b: any) => b.group.group - a.group.group);
      } else if (options.orderBy == 'group.group' && options.typeOrder == 'asc') {
        response.sort((a: any, b: any) => a.group.group - b.group.group);
      }

      if (!response || response.total <= 0) {
        return { status: 404, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Foco Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll foco erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) return { status: 400, response: [], message: { message: 'Id não informado' } };

      const response = await this.focoRepository.findOne(id);

      if (response) {
        return { status: 200, response, message: { message: 'Foco encontrado' } };
      }
      return { status: 404, response: [], message: { message: 'Foco não existe' } };
    } catch (error: any) {
      handleError('Foco Controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne foco erro');
    }
  }

  async create(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
      const focoAlreadyExists = await this.focoRepository.findByName(
        { name: data.name, id_culture: data.id_culture },
      );

      if (focoAlreadyExists) return { status: 409, message: 'Foco já existe, favor checar registros inativos.' };

      const response = await this.focoRepository.create(data);
      await this.reporteController.create({
        userId: data.created_by, module: 'FOCO', operation: 'CRIAÇÃO', oldValue: data.name, ip: String(ip),
      });

      if (response) {
        return { status: 200, response, message: { message: 'Foco criado' } };
      }
      return { status: 400, response: [], message: { message: 'Foco não foi criado' } };
    } catch (error: any) {
      handleError('Foco Controller', 'Create', error.message);
      throw new Error('[Controller] - Create foco erro');
    }
  }

  async update(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      if (data.status || data.status == 0) {
        const foco = await this.focoRepository.update(data.id, data);
        if (!foco) return { status: 400, message: 'Foco não encontrado' };
        if (data.status === 1) {
          await this.reporteController.create({
            userId: data.created_by, module: 'FOCO', operation: 'ATIVAÇÃO', oldValue: foco.name, ip: String(ip),
          });
        }
        if (data.status === 0) {
          await this.reporteController.create({
            userId: data.created_by, module: 'FOCO', operation: 'INATIVAÇÃO', oldValue: foco.name, ip: String(ip),
          });
        }

        return { status: 200, message: 'Foco atualizada' };
      }
      if (data.id_culture && data.name) {
        const { response: validate }: any = await this.getAll({
          id_culture: data.id_culture,
          filterSearch: data.name,
          notId: data.id,
          importValidate: true,
        });

        if (validate.length > 0) return { status: 404, message: 'Foco já existe, favor checar registros inativos.' };
      }
      // const focoAlreadyExists = await this.focoRepository.findByName(
      //   { name: data.name, id_culture: data.id_culture, status: 1 },
      // );
      // if (focoAlreadyExists) return { status: 409, message: 'Foco já existe, favor checar registros inativos.' };

      await this.reporteController.create({
        userId: data.created_by, module: 'FOCO', operation: 'EDIÇÃO', oldValue: data.name, ip: String(ip),
      });
      const response = await this.focoRepository.update(data.id, data);
      if (response) {
        return { status: 200, response, message: { message: 'Foco atualizado' } };
      }
      return { status: 400, response: [], message: { message: 'Foco não foi atualizada' } };
    } catch (error: any) {
      handleError('Foco Controller', 'Update', error.message);
      throw new Error('[Controller] - Update foco erro');
    }
  }
}
