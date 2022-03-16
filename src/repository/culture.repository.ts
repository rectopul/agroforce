import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CulturaRepository {   
    async findOne(id: number) {
        let Result = await prisma.culture.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let count = await prisma.culture.count({ where: where })
        let Result: object | any = await prisma.user.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }

    async create(Cultura: object | any) {
        Cultura.created_at = new Date();
        let Result = await prisma.culture.create({ data: Cultura }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Cultura: Object) {
        let Culture = await this.findOne(id);
        if (Culture != null) {
            let Result = await prisma.culture.update({ 
                where: {
                    id: id
                },
                data: Cultura })
                .finally(async () => { await prisma.$disconnect() })
            return Result;
        } else {
            return false;
        }
    }
    
}

