import {prisma} from '../pages/api/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersPermissionsRepository {   
    async create(User: object) {
        let Result = await prisma.users_Permissions.createMany({ data: User}).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Data: Object) {
        let User = await this.findOne(id);
        if (User != null) { 
            let Result = await prisma.Users_Permissions.update({ 
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

    async findAll (where: any) {
        const select = {id: true, name: true, cpf:true, email:true, telefone:true, avatar:true, status: true};
        let Result = await prisma.Users_Permissions.findMany({ where: where, select: select }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async getPermissionsByUser(userId: any) {
        let Result = await prisma.users_Permissions.findMany({
            where: {
                userId: userId
            },
            select: {
                profile: {
                    select: {
                        acess_permission: true
                    }
                },
              },
          }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

}

