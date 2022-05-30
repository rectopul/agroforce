import { prisma } from '../pages/api/db/db';

export class DelineamentoRepository {
    async findOne(id: number) {
        let Result = await prisma.delineamento.findUnique({
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
        let count = await prisma.delineamento.count({ where: where })
        let Result: object | any = await prisma.delineamento.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
        Result.total = count;
        return Result;
    }

    async create(Local: object | any) {
        Local.created_at = new Date();
        let Result = await prisma.delineamento.create({ data: Local })
        return Result;
    }

    async update(id: number, Local: Object) {
        let ExisLocal = await this.findOne(id);
        if (ExisLocal !== null) {
            let Result = await prisma.delineamento.update({
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

