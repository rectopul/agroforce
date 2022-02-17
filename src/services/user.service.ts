import {prisma} from '../db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {   
    async findOne(id: number) {
        let Result = await prisma.user.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll () {
        let Result = await prisma.user.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(User: object) {
        let Result = await prisma.user.createMany({ data: User }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Data: Object) {
        console.log("id: " + id + "," + "data: " + Data) 
        let User = await this.findOne(id);
        if (User != null) {
            let Result = await prisma.user.update({ 
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
    
}

