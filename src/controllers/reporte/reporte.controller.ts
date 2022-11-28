import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { ReporteRepository } from '../../repository/reporte.repository';
import { prisma } from '../../pages/api/db/db';

export class ReporteController {
  reporteRepository = new ReporteRepository();

  async getAll(options: object | any) {
    const parameters: object | any = {};
    let orderBy: object | any = {};
    try {
      const select = {
        id: true,
        madeBy: true,
        madeIn: true,
        module: true,
        operation: true,
        idOperation: true,
        name: true,
        ip: true,
        user: true,
      };

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.reporteRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (!response && response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Reporte controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Reporte erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.reporteRepository.findOne(id);

      if (!response) throw new Error('Relatório não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Reporte controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Reporte erro');
    }
  }

  async create(data: object | any) {
    try {
      await this.reporteRepository.create(data);
      return { status: 200, message: 'Relatório cadastrado' };
    } catch (error: any) {
      handleError('Reporte controller', 'Create', error.message);
      throw new Error('[Controller] - Create Reporte erro');
    }
  }

  async update(data: any) {
    try {
      const response: any = await this.reporteRepository.findOne(data.id);

      if (!response) return { status: 400, message: 'Relatório não encontrado' };

      await this.reporteRepository.update(Number(data.id), data);

      return { status: 200, message: 'Genótipo atualizado' };
    } catch (error: any) {
      handleError('Reporte controller', 'Update', error.message);
      throw new Error('[Controller] - Update Reporte erro');
    }
  }
}
