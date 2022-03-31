import {prisma} from '../pages/api/db/db';

export class ProfileRepository {   
    async findOne(id: number) {
        let Result = await prisma.profile.findUnique({
               where: {
                   id: id
               }
             }) 
        return Result;
    }

    async findAll () {
        let Result = await prisma.profile.findMany() 
        return Result;
    }

    async create(Profile: object | any) {
        let Result = await prisma.profile.create({ data: Profile })
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
                
            return Result;
        } else {
            return false;
        }
    }
    
}

