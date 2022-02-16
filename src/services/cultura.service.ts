import {prisma} from '../db/db';
import {CulturaModule} from '../model/cultura.module';

export class CulturaService {   
    async findOne(id: number) {
        let Result = await prisma.cultura.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll () {
        let Result = await prisma.cultura.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Cultura: CulturaModule) {
        let Result = await prisma.cultura.createMany({ data: Cultura }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    update(Cultura: CulturaModule) {

    }
    
}

