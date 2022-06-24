import { prisma } from '../pages/api/db/db';

export class TecnologiaRepository {
	async findOne(id: number) {
		const result = await prisma.tecnologia.findUnique({
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
		const count = await prisma.tecnologia.count({ where: where })
		const result: object | any = await prisma.tecnologia.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
		result.total = count;
		return result;
	}

	async create(data: object | any) {
		const result = await prisma.tecnologia.create({ data: data })
		return result;
	}

	async update(id: number, data: Object) {
		const result = await prisma.tecnologia.update({
			where: {
				id: id
			},
			data: data
		})
		return result;
	}
}
