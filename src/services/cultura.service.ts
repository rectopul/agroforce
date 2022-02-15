import {prisma} from '../db/db';
import {Cultura} from '../model/cultura';

export class CulturaService {   
    async findOne(id: number) {
        const Result = await prisma.cultura.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll () {
        const Result = await prisma.cultura.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Teste: Cultura) {
    
    }

    update(Cultura: Cultura) {

    }
    
}

