import { prisma } from '../pages/api/db/db';

export class MateriaisRepository {
    async create(data: any) {
        const materiais = await prisma.materiais.create({ data });
        return materiais;
    }
    async findOne(id: number) {
        const materiais = await prisma.materiais.findUnique({
            where: { id }
        });
        return materiais;
    }

    async update(id: number, data: any) {
        const materiais = await this.findOne(id);

        if (materiais !== null) {
            const result = await prisma.materiais.update({
                where: { id },
                data
            });
            return result;
        } else {
            return false;
        }
    }

    async list(id_experimento: number) {
        const materiais = await prisma.materiais.findMany({
            where: { id_experimento },
            select: {
                id: true,
                id_d1: true,
                id_dados: true,
                id_experimento: true,
                id_l1: true,
                name_genotipo: true,
                name_main: true,
                prox_nivel: true,
                tratamentos: true,
                status: true
            }
        });

        return materiais;
    }

    async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;

        if (orderBy) {
            order = JSON.parse(orderBy);
        }

        const count = await prisma.materiais.count({ where });

        const result: object | any = await prisma.materiais.findMany({
            select,
            skip,
            take,
            where,
            orderBy: order
        });

        result.total = count;
        return result;
    }
}
