import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {   
    async create(User: object) {
        let Result = await prisma.user.createMany({ data: User}).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Data: Object) {
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

    async findOne(id: number) {
        let Result = await prisma.user.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll (select: object, where: object, paginate: any) {
        let Result = await prisma.user.findMany({ where , select}) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }
    
    async signIn (Where: object) {
        let Result = await prisma.user.findFirst({where: Where}) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async getPermissions() {
        const user = localStorage.getItem('user')
        let Result = await prisma.profile.findMany({
            where: {
                id: user.profile_id
            }, 
            select: {
                acess_permission: true
            }
          }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

}

