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
}
