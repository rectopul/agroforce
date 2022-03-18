import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalRepository {   
    async findOne(id: number) {
        let Result = await prisma.local.findUnique({
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
        let count = await prisma.local.count({ where: where })
        let Result: object | any = await prisma.local.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }

    async findUFs (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let Result: object | any = await prisma.uf.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findCitys (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let Result: object | any = await prisma.uf.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Local: object | any) {
        Local.created_at = new Date();
        let Result = await prisma.local.create({ data: Local }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Local: Object) {
        let ExisLocal = await this.findOne(id);
        if (ExisLocal != null) {
            let Result = await prisma.local.update({ 
                where: {
                    id: id
                },
                data: Local })
                .finally(async () => { await prisma.$disconnect() })
            return Result;
        } else {
            return false;
        }
    }
}

