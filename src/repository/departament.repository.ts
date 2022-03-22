import {prisma} from '../pages/api/db/db';

export class DepartamentRepository {   
    async findOne(id: number) {
        let Result = await prisma.department.findUnique({
               where: {
                   id: id
               }
             }) .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async findAll () {
        let Result = await prisma.department.findMany() .finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async create(Departament: object | any) {
        let Result = await prisma.department.create({ data: Departament }).finally(async () => { await prisma.$disconnect() })
        return Result;
    }

    async update(id: number, Departament: Object) {
        let departament = await this.findOne(id);
        if (departament != null) {
            let Result = await prisma.department.update({ 
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

