import { prisma } from "../pages/api/db/db";

export class GenotypeTreatmentRepository {

	async create(data: any) {
		const result = await prisma.genotype_treatment.create({
			data: data
		});

		return result
	}

	async findById(id: number) {
		const result = await prisma.genotype_treatment.findUnique({
			where: { id }
		});

		return result
	}

	async update(id: number, data: any) {
		const result = await prisma.genotype_treatment.update({
			where: { id },
			data: data
		});
		return result;
	}

	async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
		if (orderBy) {
			orderBy = JSON.parse(orderBy);
		}

		const count = await prisma.genotype_treatment.count({ where: where });

		const result: object | any = await prisma.genotype_treatment.findMany({
			select: select,
			skip: skip,
			take: take,
			where: where,
			orderBy: orderBy
		});

		result.total = count;
		return result;
	}
}
