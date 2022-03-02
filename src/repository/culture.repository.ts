import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CulturaRepository {   
    async findOne(id: number) {
        let Result = await prisma.culture.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll () {
        let Result = await prisma.culture.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Cultura: object) {
        Cultura.created_at = new Date();
        let Result = await prisma.culture.create({ data: Cultura }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Cultura: Object) {
        let Culture = await this.findOne(id);
        if (Culture != null) {
            let Result = await prisma.culture.update({ 
                where: {
                    id: id
                },
                data: Cultura })
                .finally(async () => { await prisma.$disconnect() })
            return Result;
        } else {
            return false;
        }
    }
    
}

