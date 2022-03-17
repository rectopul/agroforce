import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCultureRepository {   
    async create(Cultures: object | any) {
        let Result = await prisma.users_Cultures.createMany({ data: Cultures}).finally(async () => { await prisma.$disconnect() })

        return Result;
    }

    async update(id: number, Data: Object) {
        let userCulture = await this.findOne(id);
        if (userCulture != null) { 
            let Result = await prisma.users_Cultures.updateMany({ 
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
        let Result = await prisma.users_Cultures.findMany({
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
        let count = await prisma.users_Cultures.count({ where: where })
        let Result: object | any = await prisma.users_Cultures.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }

    async findAllByUser (userId: Number | any) {
        let Result = await prisma.users_Cultures.findMany({
            where: {
                user_id: userId,
                status: 1,
                culture: {
                    status: 1
                }
            }, 
            select: {
                id: true,            
                culture: {select: {name: true}}
            },
          }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }
    
}
