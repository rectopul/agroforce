import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SafraRepository {   
    async create(Safra: object | any) {
        let Result = await prisma.safra.create({ data: Safra}).finally(async () => { await prisma.$disconnect() })

        return Result;
    }

    async update(id: number, Data: Object) {
        let User = await this.findOne(id);
        if (User != null) { 
            let Result = await prisma.safra.updateMany({ 
                where: {
                    id: id
                },
                data: Data })
                .finally(async () => { await prisma.$disconnect() })
            return Result;
        } else {
            return false;
        }
    }

    async findOne(id: number) {
        let Result = await prisma.safra.findMany({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll (where: any, take: any, skip: any) {
        const select = {id: true, name: true, cpf:true, email:true, tel:true, avatar:true, status: true};
        let count = await prisma.safra.count()
        let Result: any = await prisma.safra.findMany({ select: select, skip: skip, take: take, where: where }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }

}

