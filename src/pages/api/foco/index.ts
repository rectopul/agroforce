
import { NextApiRequest, NextApiResponse } from 'next';

import { FocoController } from '../../../controllers/foco.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const focoController = new FocoController();

	switch (req.method) {
		case 'GET':
			const result = await focoController.getAll(req.query);
			res.status(result.status).json(result);
			break
		case 'POST':
			const resultPost = await focoController.create(req.body);
			res.status(resultPost.status).json(resultPost);
			break
		case 'PUT':
			const resultPut = await focoController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
