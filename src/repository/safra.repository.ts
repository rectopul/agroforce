import {prisma} from '../pages/api/db/db';

export class SafraRepository {   
    async create(data: any) {
        const safra = await prisma.safra.create({data});
        return safra;
    }

    async update(id: number, data: any) {
        let safra = await this.findOne(id);
        if (safra != null) {
            let Result = await prisma.safra.update({ 
                where: { id },
                data
            })
            return Result;
        } else {
            return false;
        }
    }

    async findOne(id: number) {
        const safra = await prisma.safra.findUnique({
            where: { id }
        });
        return safra;
    }

    async findByYear(year: string) {
        const safra = await prisma.safra.findFirst({
            where: {
                year
            }
        });

        return safra;
    }

    async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        let count = await prisma.safra.count({ where: where })
        let Result: object | any = await prisma.safra.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }
}
