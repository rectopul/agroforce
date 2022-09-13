import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { ReporteRepository } from '../../repository/reporte.repository';
import { prisma } from '../../pages/api/db/db';

export class ReporteController {

  async getAll(options: object | any) {
    try {
      console.log('get all')
    } catch (error: any) {
      console.log(error)
    }
  }

  async getOne(id: number) {
    try {
      console.log('get one for id')
    } catch (error: any) {
      console.log(error)
    }
  }

  async create(data: object | any) {
    try {
      console.log('create');
    } catch (error: any) {
      console.log(error);
    }
  }

  async update(data: any) {
    try {
      console.log('update');
      } catch (error: any) {
        console.log(error);
    }
}
