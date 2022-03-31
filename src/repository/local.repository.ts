import {prisma} from '../pages/api/db/db';

export class LocalRepository {   
    async findOne(id: number) {
        let Result = await prisma.local.findUnique({
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
        let count = await prisma.local.count({ where: where })
        let Result: object | any = await prisma.local.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) 
        Result.total = count;
        return Result;
    }

    async findUFs (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let Result: object | any = await prisma.uf.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) 
        return Result;
    }

    async findOneUFs(id: number) {
        let Result = await prisma.uf.findUnique({
               where: {
                   id: id
               }
             }) 
        return Result;
    }

    async findCitys (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let Result: object | any = await prisma.city.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) 
        return Result;
    }

    async create(Local: object | any) {
        Local.created_at = new Date();
        let Result = await prisma.local.create({ data: Local })
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
                
            return Result;
        } else {
            return false;
        }
    }
}

