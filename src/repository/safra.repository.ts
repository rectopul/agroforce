import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';
import { ISafraPropsDTO } from 'src/shared/dtos/ISafraPropsDTO';

@Injectable()
export class SafraRepository {   
    async create(data: ISafraPropsDTO) {
        const safra = await prisma.safra.create({data});
        return safra;
    }

    async update(id: number, Data: Object) {
        let safra = await this.findOne(id);
        if (safra != null) {
            let Result = await prisma.safra.updateMany({ 
                where: {
                    id: id
                },
                data: Data })
                .finally(async () => { await prisma.$disconnect() })
            return Result;
        } else {
            return false;
        }
    }

    async findOne(id: number) {
        let Result = await prisma.safra.findMany({
            where: {
                id: id
            }
                }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        console.log(where, select, take);
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let count = await prisma.safra.count({ where: where })
        let Result: object | any = await prisma.safra.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }
}

