import { prisma } from "../pages/api/db/db";

export class UnidadeCulturaRepository {

    async create(data: any) {
        const local_children = await prisma.local_children.create({
            data: {
                id_local: data.id_local,
                id_culture_unity: data.id_culture_unity,
                culture_unity_name: data.culture_unity_name,
                year: data.year,
                created_by: data.created_by,
            }
        });

        return local_children;
    }

    async findById(id: number) {
        const local_children = await prisma.local_children.findUnique({
            where: { id },
            select: {
                id: true,
                id_culture_unity: true,
                year: true,
                culture_unity_name: true,
                status: true,
            }
        });

        return local_children;
    }

    async update(id: number, data: any) {
        const local_children = await this.findById(id);

        if (local_children !== null) {
            const result = await prisma.local_children.update({
                where: { id },
                data
            });
            return result;
        } else {
            return false;
        }
    }

    async findByData(data: any) {
        const local_children = await prisma.local_children.findFirst({
            where: {
                id_culture_unity: data.id_culture_unity
            }
        });

        return local_children;
    }

    async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;

        if (orderBy) {
            order = JSON.parse(orderBy);
        }

        const count = await prisma.local_children.count({ where: where });

        const result: object | any = await prisma.local_children.findMany({
            select: select,
            skip: skip,
            take: take,
            where: where,
            orderBy: order
        });

        result.total = count;
        return result;
    }
}
