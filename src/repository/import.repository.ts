import { prisma } from '../pages/api/db/db';

export class ImportRepository {
    async create(Data: object | any) {
        const result = await prisma.import_spreadsheet.createMany({ data: Data })
        return result;
    }

    async update(id: number, Data: Object) {
        const result = await prisma.import_spreadsheet.update({
            where: {
                id: id
            },
            data: Data
        })

        return result;
    }

    async findAll(where: any) {
        const result = await prisma.import_spreadsheet.findMany({ where: where })
        return result;
    }

    async delete(where: object) {
        const result = await prisma.import_spreadsheet.deleteMany({
            where: where
        })
        return result;
    }

    async updateAllStatus(userId: any) {
        await prisma.$executeRaw`UPDATE import_spreadsheet SET status = 0 WHERE userId = ${userId}`;
    }

    async queryRaw(idUser: any, cultureId: any) {
        await prisma.$executeRaw`UPDATE import_spreadsheet SET status = 1 WHERE userId = ${idUser} AND cultureId = ${cultureId}`;
    }
}

