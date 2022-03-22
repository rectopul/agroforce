import {prisma} from '../pages/api/db/db';
import { ICreateFocoDTO } from 'src/shared/dtos/focoDTO/ICreateFocoDTO';
import { IUpdateFocoDTO } from 'src/shared/dtos/focoDTO/IUpdateFocoDTO';

export class FocoRepository {
  async create(data: ICreateFocoDTO) {
    const foco = await prisma.foco.create({ data });
    return foco;
  }

  async findOne(id: number) {
    const foco = await prisma.foco.findUnique({
      where: { id }
    });
    return foco;
  }

  async update(id: number, data: IUpdateFocoDTO) {
    const foco = await this.findOne(id);

    if (foco !== null) {
      const result = await prisma.foco.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy){
      order = JSON.parse(orderBy);
    }

    const count = await prisma.portfolio.count({ where: where });

    const result: object | any = await prisma.foco.findMany({
      select: select, 
      skip: skip, 
      take: take, 
      where: where,
      orderBy: order
    });
    
    result.total = count;
    return result;
  }
}
