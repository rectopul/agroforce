import handleError from '../shared/utils/handleError';
import { FocoRepository } from '../repository/foco.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import handleOrderForeign from '../shared/utils/handleOrderForeign';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';

export class FocoController {
  public readonly required = 'Campo obrigatório';

  focoRepository = new FocoRepository();

  reporteRepository = new ReporteRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    try {
      options = await removeEspecialAndSpace(options);
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        parameters.name = JSON.parse(`{ "contains": "${options.filterSearch}" }`);
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
        name: true,
        group: true,
        status: true,
      };

      if (options.name) {
        parameters.name = options.name;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
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
      await this.reporteRepository.create({
        madeBy: response.created_by, module: 'Foco', operation: 'Cadastro', name: response.name, ip: JSON.stringify(ip), idOperation: response.id,
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

      if (data) {
        const foco = await this.focoRepository.update(data.id, data);
        if (!foco) return { status: 400, message: 'Foco não encontrado' };
        if (foco.status === 1) {
          await this.reporteRepository.create({
            madeBy: foco.created_by, module: 'Foco', operation: 'Edição', name: foco.name, ip: JSON.stringify(ip), idOperation: foco.id,
          });
        }
        if (foco.status === 0) {
          await this.reporteRepository.create({
            madeBy: foco.created_by, module: 'Foco', operation: 'Inativação', name: foco.name, ip: JSON.stringify(ip), idOperation: foco.id,
          });
        }

        return { status: 200, message: 'Foco atualizada' };
      }
      const focoAlreadyExists = await this.focoRepository.findByName(
        { name: data.name, id_culture: data.id_culture, status: 1 },
      );
      if (focoAlreadyExists) return { status: 409, message: 'Foco já existe, favor checar registros inativos.' };

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
