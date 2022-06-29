
import { NextApiRequest, NextApiResponse } from 'next';
import { NpeController } from '../../../controllers/npe.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const npeController = new NpeController();
	const id = Number(req.query.id)
	switch (req.method) {
		case 'PUT':
			const resultPut = await npeController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break;
		case 'GET':
			const result: any = await npeController.getOne(id);
			res.status(result.status).json(result.response);
			break;
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}