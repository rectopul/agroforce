import { prisma } from '../pages/api/db/db';

export class ReporteRepository {
  async findOne() {
    console.log('findOne');
  }

  async findAll() {
    console.log('findAll');
  }

  async create() {
    console.log('create');
  }

  async update() {
    console.log('update');
  }

  async queryRaw() {
    console.log('queryRaw');
  }
}
