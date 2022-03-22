import {prisma} from '../pages/api/db/db';

export class ProfileRepository {   
    async findOne(id: number) {
        let Result = await prisma.profile.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll () {
        let Result = await prisma.profile.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Profile: object | any) {
        let Result = await prisma.profile.create({ data: Profile }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Profile: Object) {
        let profile = await this.findOne(id);
        if (profile != null) {
            let Result = await prisma.profile.update({ 
                where: {
                    id: id
                },
                data: Profile })
                .finally(async () => { await prisma.$disconnect() })
            return Result;
        } else {
            return false;
        }
    }
    
}

