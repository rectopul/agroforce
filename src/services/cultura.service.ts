import {prisma} from '../db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CulturaService {   
    async findOne(id: number) {
        let Result = await prisma.cultura.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
             console.log(typeof Result);
        return Result;
    }

    async findAll () {
        let Result = await prisma.cultura.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Cultura: object) {
        let Result = await prisma.cultura.createMany({ data: Cultura }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Cultura: Object) {
        let Culture = await this.findOne(id);
        if (Culture != null) {
            let Result = await prisma.cultura.update({ 
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

