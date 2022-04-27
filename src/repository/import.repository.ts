import {prisma} from '../pages/api/db/db';

export class ImportRepository {   
    async create(Data: object | any) {
        let Result = await prisma.import_spreadsheet.createMany({ data: Data})
        return Result;
    }

    async update(id: number, Data: Object) {
        let Result = await prisma.import_spreadsheet.update({ 
            where: {
                id: id
            },
            data: Data })
            
        return Result;
    }

    async findAll (where: any) {
        let Result = await prisma.import_spreadsheet.findMany({ where: where }) 
        return Result;
    }

    async findAllByUser (userId: Number | any) {
        let Result = await prisma.import_spreadsheet.findMany({
            where: {
                userId: userId,
                culture: {
                    status: 1
                }
            }, 
            select: {
                id: true,    
                cultureId: true,
                profileId: true,
                status: true,        
                culture: {select: {name: true}}
            },
            distinct: ['cultureId'],
          }) 
        return Result;
    }
    
    async delete(where: object ) {
        let Result = await prisma.import_spreadsheet.deleteMany({
            where: where
          }) 
        return Result;
    }

    async updateAllStatus(userId: any) {
        await prisma.$executeRaw`UPDATE import_spreadsheet SET status = 0 WHERE userId = ${userId}`;
    }

    async queryRaw(idUser: any, cultureId: any) {
        await prisma.$executeRaw`UPDATE import_spreadsheet SET status = 1 WHERE userId = ${idUser} AND cultureId = ${cultureId}`;
    }
}

