
import { NextApiRequest, NextApiResponse } from 'next';
import { UnidadeCulturaController } from '../../../controllers/unidade-cultura.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const unidadeCulturaController = new UnidadeCulturaController();

	switch (req.method) {
		case 'GET':
			const result = await unidadeCulturaController.getAll(req.query);
			res.status(result.status).json(result);
			break
		case 'POST':
			const resultPost = await unidadeCulturaController.create(req.body);
			res.status(resultPost.status).json(resultPost);
			break
		case 'PUT':
			const resultPut = await unidadeCulturaController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`)
	}

	return;
}
