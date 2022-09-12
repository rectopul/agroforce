import { prisma } from '../pages/api/db/db';

export class ExperimentGenotipeRepository {

    async createMany(data: any) {
        const result = await prisma.experiment_genotipe.createMany({ data });
        return result;
    }

    async update(id: number, data: any) {
        const result = await prisma.experiment_genotipe.update({
            where: { id },
            data,
        });
        return result;
    }

    async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
        if (orderBy) {
            orderBy = JSON.parse(orderBy);
        }

        const count = await prisma.experiment_genotipe.count({ where });

        const result: object | any = await prisma.experiment_genotipe.findMany({
            select,
            skip,
            take,
            where,
            orderBy,
        });

        result.total = count;
        return result;
    }
}
