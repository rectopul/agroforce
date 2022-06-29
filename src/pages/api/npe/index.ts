
import { NextApiRequest, NextApiResponse } from 'next';
import { NpeController } from '../../../controllers/npe.controller';
import { apiHandler } from '../../../helpers/api';


export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const npeController = new NpeController();
	switch (req.method) {
		case 'GET':
			const result = await npeController.getAll(req.query);
			res.status(result.status).json(result);
			break
		case 'POST':
			const resultPost = await npeController.create(req.body);
			res.status(resultPost.status).json(resultPost);
			break
		case 'PUT':
			const resultPut = await npeController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`)
	}

}