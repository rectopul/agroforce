import { prisma } from '../pages/api/db/db';

interface IEpoca {
  id: number;
  id_culture: number;
  name: string;
  status: number;
  created_by: number;
};

type ICreateEpoca = Omit<IEpoca, "id" | "status">;
type IUpdateEpoca = Omit<IEpoca, "created_by">;

export class EpocaRepository {
  async create(data: ICreateEpoca) {
    const epoca = await prisma.epoca.create({ data });
    return epoca;
  }

  async findOne(id: number) {
    const epoca = await prisma.epoca.findUnique({
      where: { id }
    });
    return epoca;
  }

  async findByName(name: string) {
    const epoca = await prisma.epoca.findFirst({
      where: { 
        name
      }
    });
    return epoca;
  }

  async update(id: number, data: IUpdateEpoca) {
    const epoca = await this.findOne(id);

    if (epoca !== null) {
      const result = await prisma.epoca.update({
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

    const count = await prisma.epoca.count({ where: where });

    const result: object | any = await prisma.epoca.findMany({
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
