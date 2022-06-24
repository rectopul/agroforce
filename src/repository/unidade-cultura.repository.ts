import { prisma } from "../pages/api/db/db";

export class UnidadeCulturaRepository {

	async create(data: any) {
		const result = await prisma.local_children.create({
			data: data
		});

		return result
	}

	async findById(id: number) {
		const result = await prisma.local_children.findUnique({
			where: { id }
		});

		return result
	}

	async update(id: number, data: any) {
		const result = await prisma.local_children.update({
			where: { id },
			data: data
		});
		return result;
	}

	async findByName({ culture_unity_name }: any) {
		const result = await prisma.local_children.findFirst({
			where: {
				culture_unity_name: culture_unity_name
			}
		});

		return result
	}

	async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
		let order: object | any;

		if (orderBy) {
			order = JSON.parse(orderBy);
		}

		const count = await prisma.local_children.count({ where: where });

		const result: object | any = await prisma.local_children.findMany({
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
