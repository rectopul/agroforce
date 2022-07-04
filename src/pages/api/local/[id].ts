
import { NextApiRequest, NextApiResponse } from 'next';
import { LocalController } from '../../../controllers/local.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const localController = new LocalController();
	const id = req.query.id.toString();
	switch (req.method) {
		case 'PUT':
			const resultPut = await localController.update(req.body);
			res.status(200).json(resultPut);
			break;
		case 'GET':
			const result: any = await localController.getOne({ id });
			res.status(200).json(result);
			break;
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}