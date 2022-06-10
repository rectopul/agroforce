import { prisma } from "../pages/api/db/db";

export class EnvelopeRepository {

    async create(data: any) {
        const type_assay_children = await prisma.type_assay_children.create({
            data: {
                id_type_assay: data.id_type_assay,
                seeds: data.seeds,
                id_safra: data.id_safra,
                created_by: data.created_by,
            }
        });

        return type_assay_children;
    }

    async findById(id: number) {
        const type_assay_children = await prisma.type_assay_children.findUnique({
            where: { id },
            select: { id: true, safra: { select: { safraName: true, id: true } }, type_assay: { select: { name: true, id: true } }, seeds: true, status: true }
        });

        return type_assay_children;
    }

    async update(id: number, data: any) {
        const type_assay_children = await this.findById(id);

        if (type_assay_children !== null) {
            const result = await prisma.type_assay_children.update({
                where: { id },
                data
            });
            return result;
        } else {
            return false;
        }
    }

    async findByData(data: any) {
        const type_assay_children = await prisma.type_assay_children.findFirst({
            where: {
                id_safra: data.id_safra,
                id_type_assay: data.id_type_assay,
            }
        });

        return type_assay_children;
    }

    async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
        let order: object | any;

        if (orderBy) {
            order = JSON.parse(orderBy);
        }
        const count = await prisma.type_assay_children.count({ where: where });
        const result: object | any = await prisma.type_assay_children.findMany({
            select: select,
            skip: skip,
            take: take,
            where: where,
            orderBy: order
        });

        result.total = count;
        return result;
    }
}
