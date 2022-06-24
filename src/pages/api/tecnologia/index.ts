
import { NextApiRequest, NextApiResponse } from 'next';
import { TecnologiaController } from '../../../controllers/tecnologia.controller';
import { apiHandler } from '../../../helpers/api';


export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const tecnologiaController = new TecnologiaController();
	switch (req.method) {
		case 'GET':
			const result = await tecnologiaController.getAll(req.query);
			res.status(result.status).json(result);
			break;
		case 'POST':
			const resultPost = await tecnologiaController.create(req.body);
			res.status(resultPost.status).json(resultPost);
			break;
		case 'PUT':
			const resultPut = await tecnologiaController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break;
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
