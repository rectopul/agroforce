import { ICreateCultureDTO } from 'src/shared/dtos/culturaDTO/ICreateCultureDTO';
import { IUpdateCultureDTO } from 'src/shared/dtos/culturaDTO/IUpdateCultureDTO';
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
        let count = await prisma.culture.count({ where: where })
        let Result: object | any = await prisma.culture.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }

    async create(data: ICreateCultureDTO) {
        const culture = await prisma.culture.create({ data });
        return culture;
    }

    async update(id: number, data: IUpdateCultureDTO) {
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
