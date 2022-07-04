
import { NextApiRequest, NextApiResponse } from 'next';
import { AssayListController } from '../../../controllers/assay-list.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const assayListController = new AssayListController();

	switch (req.method) {
		case 'GET':
			const result = await assayListController.getAll(req.query);
			res.status(200).json(result);
			break
		case 'POST':
			const resultPost = await assayListController.create(req.body);
			res.status(200).json(resultPost);
			break
		case 'PUT':
			const resultPut = await assayListController.update(req.body);
			res.status(200).json(resultPut);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
