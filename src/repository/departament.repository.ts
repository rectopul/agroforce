import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DepartamentRepository {   
    async findOne(id: number) {
        let Result = await prisma.departament.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll () {
        let Result = await prisma.departament.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Departament: object) {
        let Result = await prisma.departament.create({ data: Departament }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Departament: Object) {
        let departament = await this.findOne(id);
        if (departament != null) {
            let Result = await prisma.departament.update({ 
                where: {
                    id: id
                },
                data: Departament })
                .finally(async () => { await prisma.$disconnect() })
            return Result;
        } else {
            return false;
        }
    }
    
}

