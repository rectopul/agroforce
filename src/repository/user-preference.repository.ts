import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserPreferenceRepository {   
    async create(Permission: object | any) {
        let Result = await prisma.users_Preferences.createMany({ data: Permission}).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Data: Object) {
        let Result = await prisma.users_Preferences.update({ 
            where: {
                id: id
            },
            data: Data })
            .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let count = await prisma.users_Preferences.count({ where: where })
        let Result: object | any = await prisma.users_Preferences.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }

    async findAllconfigGerais (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let Result: object | any = await prisma.config_Gerais.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() });
        return Result;
    }
}

