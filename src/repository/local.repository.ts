import { prisma } from '../pages/api/db/db';

export class LocalRepository {
	async findOne(id: number) {
		const result = await prisma.local.findUnique({
			where: {
				id: id
			}
		})
		return result;

	}

	async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
		let order: object | any;
		if (orderBy) {
			order = JSON.parse(orderBy);
		}
		const count = await prisma.local.count({ where: where })
		const result: object | any = await prisma.local.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
		result.total = count;
		return result;

	}

	async create(data: object | any) {
		const result = await prisma.local.create({ data: data })
		return result;
	}

	async update(id: number, data: Object) {
		const result = await prisma.local.update({
			where: { id: id },
			data: data
		})

		return result;
	}
}

