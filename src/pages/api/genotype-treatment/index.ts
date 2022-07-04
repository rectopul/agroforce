
import { NextApiRequest, NextApiResponse } from 'next';
import { GenotypeTreatmentController } from '../../../controllers/genotype-treatment.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const genotypeTreatmentController = new GenotypeTreatmentController();

	switch (req.method) {
		case 'GET':
			const result = await genotypeTreatmentController.getAll(req.query);
			res.status(result.status).json(result);
			break
		case 'POST':
			const resultPost = await genotypeTreatmentController.create(req.body);
			res.status(resultPost.status).json(resultPost);
			break
		case 'PUT':
			const resultPut = await genotypeTreatmentController.update(req.body);
			res.status(resultPut.status).json(resultPut);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
