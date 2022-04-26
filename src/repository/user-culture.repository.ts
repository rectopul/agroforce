import {prisma} from '../pages/api/db/db';
export class UserCultureRepository {   
    async create(Cultures: object | any) {
        let Result = await prisma.users_cultures.createMany({ data: Cultures})
        return Result;
    }

    async update(id: number, Data: Object) {
        let userCulture = await this.findOne(id);
        if (userCulture != null) { 
            let Result = await prisma.users_cultures.updateMany({ 
                where: {
                    id: id
                },
                data: Data })
                
            return Result;
        } else {
            return false;
        }
    }

    async updateAllStatus(userId: any) {
        await prisma.$executeRaw`UPDATE users_cultures SET status = 0 WHERE userId = ${userId}`;
    }

    async queryRaw(idUser: any, cultureId: any) {
        await prisma.$executeRaw`UPDATE users_cultures SET status = 1 WHERE userId = ${idUser} AND cultureId = ${cultureId}`;
    }

    async delete(where: object ) {
        let Result = await prisma.users_cultures.deleteMany({
            where: where
          }) 
        return Result;
    }

    async findOne(id: number) {
        let Result = await prisma.users_cultures.findMany({
               where: {
                   id: id
               }
             }) 
        return Result;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let count = await prisma.users_cultures.count({ where: where })
        let Result: object | any = await prisma.users_cultures.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) 
        Result.total = count;
        return Result;
    }

    async findAllByUser (userId: Number | any) {
        let Result = await prisma.users_cultures.findMany({
            where: {
                userId: userId,
                culture:<any> {
                    status: 1
                }
            }, 
            select: {
                id: true,    
                cultureId: true,
                status: true,        
                culture: {select: {name: true}}
            },
          }) 
        return Result;
    }
}

