
import { NextApiRequest, NextApiResponse } from 'next';
import { AssayListController } from '../../../controllers/assay-list.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const assayListController = new AssayListController();
	const { id } = req.query;

	switch (req.method) {
		case 'GET':
			const result = await assayListController.getOne(Number(id));
			res.status(result.status).json(result.response);
			break
		case 'PUT':
			const resultPut = await assayListController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break
		case 'DELETE':
			const resultDelete = await assayListController.delete(id);
			res.status(resultDelete.status).json(resultDelete);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
