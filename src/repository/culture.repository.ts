import {prisma} from '../pages/api/db/db';

export class CulturaRepository {   
    async findOne(id: number) {
        const foco = await prisma.culture.findUnique({
            where: { id }
        });
        return foco;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
    
        if (orderBy){
          order = JSON.parse(orderBy);
        }
    
        const count = await prisma.culture.count({ where: where });
    
        const result: object | any = await prisma.culture.findMany({
          select: select, 
          skip: skip, 
          take: take, 
          where: where,
          orderBy: order
        });
        
        result.total = count;
        return result;
      }

    async create(data: any) {
        const culture = await prisma.culture.create({ data });
        return culture;
    }

    async update(id: number, data: any) {
        const culture = await this.findOne(id);

        if (culture !== null) {
            const result = await prisma.culture.update({
                where: { id },
                data
            });
            return result;
        } else {
            return false;
        }
    }
}
