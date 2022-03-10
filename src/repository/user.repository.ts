import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {   
    async create(User: object) {
        let Result = await prisma.user.create({ data: User}).finally(async () => { await prisma.$disconnect() })

        return Result;
    }

    async update(id: number, Data: Object) {
        let User = await this.findOne(id);
        if (User != null) { 
            let Result = await prisma.user.updateMany({ 
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
        let Result = await prisma.user.findMany({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll (where: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;
        if (orderBy){
            order = JSON.parse(orderBy);
        }
        const select = {id: true, name: true, cpf:true, email:true, tel:true, avatar:true, status: true};
        let count = await prisma.user.count({ where: where })
        let Result: object | any = await prisma.user.findMany({ select: select, skip: skip, take: take, where: where,  orderBy: order }) .finally(async () => { await prisma.$disconnect() })
        Result.total = count;
        return Result;
    }
    
    async signIn (Where: object) {
        let Result = await prisma.user.findFirst({where: Where}) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async getPermissions(userId: any) {
        let Result = await prisma.profile.findMany({
            where: {
                id: userId
            }, 
            select: {
                acess_permission: true
            }
          }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

}

