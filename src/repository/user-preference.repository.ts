import {prisma} from '../pages/api/db/db';

export class UserPreferenceRepository {   
    async create(Permission: object | any) {
        let Result = await prisma.users_preferences.create({ data: Permission, select:{id: true}}).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Data: Object | any) {
        let preference: any = this.findAll({id: id}, {id: true},  1,  0, '');
        let Result: undefined | any;
        if (preference) {
            Result = await prisma.users_preferences.update({ 
                where: {
                    id: id
                },
                data: {table_preferences: Data.table_preferences}
                })
                .finally(async () => { await prisma.$disconnect() })
        } else {
            Result = await prisma.users_preferences.upsert({ 
                update:{
                    table_preferences: Data.table_preferences
                },
                where: {
                    id: id
                },
                create: {
                    table_preferences: Data.table_preferences,
                    userId: Data.userId,
                    module_id: Data.module_id
                }})
                .finally(async () => { await prisma.$disconnect() })
        }
        return Result;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let count = await prisma.users_preferences.count({ where: where })
        let Result: object | any = await prisma.users_preferences.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }

    async findAllconfigGerais (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let Result: object | any = await prisma.config_gerais.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() });
        return Result;
    }
}

