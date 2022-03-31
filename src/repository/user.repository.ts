import {prisma} from '../pages/api/db/db';

export class UserRepository {   
    async create(User: object | any) {
        let Result = await prisma.user.create({ data: User})

        return Result;
    }

    async createUserCulture(Cultures: object | any) {
        let Result = await prisma.users_cultures.createMany({ data: Cultures})

        return Result;
    }

    async update(id: number, Data: Object) {
        let User = await this.findOne(id);
        if (User != null) { 
            let Result = await prisma.user.updateMany({ 
                where: {
                    id: id
                },
                data: Data })
                
            return Result;
        } else {
            return false;
        }
    }

    async findOne(id: number) {
        let Result : object | any = await prisma.user.findMany({
               where: {
                   id: id
               }
             }) 
             Result.cultures = await prisma.users_cultures.findMany({where:{userId: id}});
        return Result;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let count = await prisma.user.count({ where: where })
        let Result: object | any = await prisma.user.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) 
        Result.total = count;
        return Result;
    }
    
    async signIn (Where: object) {
        let Result = await prisma.user.findFirst({where: Where}) 
        return Result;
    }

    async getPermissions(userId: any) {
        let Result = await prisma.profile.findMany({
            where: {
                id: userId
            }, 
            select: {
                acess_permission: true
            }
          }) 
        return Result;
    }

}

