import { prisma } from "../pages/api/db/db";

export class UnidadeCulturaRepository {

	async create(data: any) {
		const result = await prisma.cultureUnity.create({
			data: data
		});

		return result
	}

	async findById(id: number) {
		const result = await prisma.cultureUnity.findUnique({
			where: { id }
		});

		return result
	}

	async update(id: number, data: any) {
		const result = await prisma.cultureUnity.update({
			where: { id },
			data: data
		});
		return result;
	}

	async findByName({ name_unity_culture }: any) {
		const result = await prisma.cultureUnity.findFirst({
			where: {
				name_unity_culture: name_unity_culture
			}
		});

		return result
	}

	async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
		if (orderBy) {
			orderBy = JSON.parse(orderBy);
		}

		const count = await prisma.cultureUnity.count({ where: where });

		const result: object | any = await prisma.cultureUnity.findMany({
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
