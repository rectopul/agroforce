
import { NextApiRequest, NextApiResponse } from 'next';
import { TecnologiaController } from '../../../controllers/tecnologia.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const tecnologiaController = new TecnologiaController();
	const id = req.query.id.toString();
	switch (req.method) {
		case 'PUT':
			const resultPut = await tecnologiaController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break;
		case 'GET':
			const result: any = await tecnologiaController.getOne(id);
			res.status(result.status).json(result);
			break;
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
