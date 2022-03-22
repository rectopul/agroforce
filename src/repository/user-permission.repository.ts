import {prisma} from '../pages/api/db/db';

export class UsersPermissionsRepository {   
    async create(Permission: object | any) {
        let Result = await prisma.users_permissions.createMany({ data: Permission}).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Data: Object) {
        let Result = await prisma.users_permissions.update({ 
            where: {
                id: id
            },
            data: Data })
            .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll (where: any) {
        const select = {id: true, name: true, cpf:true, email:true, telefone:true, avatar:true, status: true};
        let Result = await prisma.users_permissions.findMany({ where: where, select: select }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async getPermissionsByUser(userId: any) {
        let Result = await prisma.users_permissions.findMany({
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

