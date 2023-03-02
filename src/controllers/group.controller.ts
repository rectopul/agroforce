import { GroupRepository } from '../repository/group.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import handleError from '../shared/utils/handleError';
import { ReporteController } from './reportes/reporte.controller';

export class GroupController {
  public readonly required = 'Campo obrigatório';

  groupRepository = new GroupRepository();

  reporteController = new ReporteController();

  async getOne({ id }: any) {
    try {
      const response = await this.groupRepository.findById(id);

      if (!response) throw new Error('Grupo não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Grupo controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Grupo erro');
    }
  }

  async create(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      const groupAlreadyExists = await this.groupRepository.findByData(data);
      if (groupAlreadyExists) return { status: 400, message: 'Dados já cadastrados' };

      await this.reporteController.create({
        userId: data.created_by, module: 'GRUPO DE FOCO', operation: 'CRIAÇÃO', oldValue: data.group, ip: String(ip),
      });
      const grupo = await this.groupRepository.create(data);

      return { status: 200, message: 'grupo cadastrado' };
    } catch (error: any) {
      handleError('Grupo controller', 'Create', error.message);
      throw new Error('[Controller] - Create Grupo erro');
    }
  }

  async update(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      const group: any = await this.groupRepository.findById(data.id);

      if (!group) return { status: 400, message: 'grupo não existente' };
      await this.reporteController.create({
        userId: data.created_by, module: 'GRUPO DE FOCO', operation: 'EDIÇÃO', oldValue: data.group, ip: String(ip),
      });
      const grupo = await this.groupRepository.update(data.id, data);

      return { status: 200, message: 'grupo atualizado' };
    } catch (error: any) {
      handleError('Grupo controller', 'Update', error.message);
      throw new Error('[Controller] - Update Grupo erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    try {
      const select = {
        id: true,
        id_foco: true,
        foco: { select: { name: true, id: true } },
        safra: { select: { safraName: true } },
        npe: true,
        group: true,
      };

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.id_foco) {
        parameters.id_foco = Number(options.id_foco);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const response: object | any = await this.groupRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      response.map((item: any) => {
        item.group = (item.group.toString()).length > 1 ? item.group : `0${item.group.toString()}`;
      });

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Grupo controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Grupo erro');
    }
  }
}
