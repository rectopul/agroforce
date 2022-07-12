import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import { LogImportController } from '../../../controllers/log-import.controller';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const logImportController = new LogImportController();
	const { id } = req.query;

	switch (req.method) {
		case 'GET':
			const result = await logImportController.getOne({ id: number(id) });
			res.status(200).json(result.response);
			break
		case 'PUT':
			const resultPut = await logImportController.update(req.body);
			res.status(200).json(resultPut);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
