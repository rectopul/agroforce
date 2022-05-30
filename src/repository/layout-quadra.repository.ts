import { prisma } from '../pages/api/db/db';

export class LayoutQuadraRepository {
    async findOne(id: number) {
        let Result = await prisma.layoult_quadra.findUnique({
            where: {
                id: id
            }
        })
        return Result;
    }

    async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy) {
            order = JSON.parse(orderBy);
        }
        let count = await prisma.layoult_quadra.count({ where: where })
        let Result: object | any = await prisma.layoult_quadra.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
        Result.map((value: string | object | any, item: any) => {
            Result[item].local = Result[item].local.name;
        })
        Result.total = count;
        return Result;
    }

    async create(Local: object | any) {
        Local.created_at = new Date();
        let Result = await prisma.layoult_quadra.create({ data: Local })
        return Result;
    }

    async update(id: number, Local: Object) {
        let ExisLocal = await this.findOne(id);
        if (ExisLocal !== null) {
            let Result = await prisma.layoult_quadra.update({
                where: {
                    id: id
                },
                data: Local
            })

            return Result;
        } else {
            return false;
        }
    }
}

