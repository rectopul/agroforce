import { prisma } from "../pages/api/db/db";

export class AssayListRepository {

	async create(data: any) {
		const result = await prisma.assay_list.create({
			data: data
		});

		return result
	}

	async findById(id: number) {
		const result = await prisma.assay_list.findUnique({
			where: { id }
		});

		return result
	}

	async update(id: number, data: any) {
		const result = await prisma.assay_list.update({
			where: { id },
			data: data
		});
		return result;
	}

	async findByName({ gli }: any) {
		const result = await prisma.assay_list.findFirst({
			where: {
				gli: gli
			}
		});

		return result
	}

	async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
		if (orderBy) {
			orderBy = JSON.parse(orderBy);
		}

		const count = await prisma.assay_list.count({ where: where });

		const result: object | any = await prisma.assay_list.findMany({
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
