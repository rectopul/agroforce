import {prisma} from '../pages/api/db/db';

export class TypeAssayRepository {   
    async findOne(id: number) {
        let Result = await prisma.type_assay.findUnique({
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
        let count = await prisma.type_assay.count({ where: where })
        let Result: object | any = await prisma.type_assay.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) 
        Result.total = count;
        return Result;
    }

    async create(Local: object | any) {
        Local.created_at = new Date();
        let Result = await prisma.type_assay.create({ data: Local })
        return Result;
    }

    async update(id: number, Local: Object) {
        let ExisLocal = await this.findOne(id);
        if (ExisLocal != null) {
            let Result = await prisma.type_assay.update({ 
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

