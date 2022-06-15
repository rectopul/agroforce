import { prisma } from '../pages/api/db/db';

export class UsersPermissionsRepository {
    async create(Permission: object | any) {
        let Result = await prisma.users_permissions.createMany({ data: Permission })
        return Result;
    }

    async update(id: number, Data: Object) {
        let Result = await prisma.users_permissions.update({
            where: {
                id: id
            },
            data: Data
        })

        return Result;
    }

    async findAll(where: any) {
        const select = { id: true, name: true, cpf: true, login: true, telefone: true, avatar: true, status: true };
        let Result = await prisma.users_permissions.findMany({ where: where, select: select })
        return Result;
    }

    async findAllByUser(userId: Number | any) {
        let Result = await prisma.users_permissions.findMany({
            where: {
                userId: userId,
                culture: { status: 1 }
            },
            select: {
                id: true,
                cultureId: true,
                profileId: true,
                status: true,
                culture: { select: { name: true, desc: true } }
            },
            distinct: ['cultureId'],
        })
        return Result;
    }

    async delete(where: object) {
        let Result = await prisma.users_permissions.deleteMany({
            where: where
        })
        return Result;
    }

    async updateAllStatus(userId: any) {
        await prisma.$executeRaw`UPDATE users_permissions SET status = 0 WHERE userId = ${userId}`;
    }

    async queryRaw(idUser: any, cultureId: any) {
        await prisma.$executeRaw`UPDATE users_permissions SET status = 1 WHERE userId = ${idUser} AND cultureId = ${cultureId}`;
    }
}

