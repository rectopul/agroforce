import { NextApiRequest, NextApiResponse } from 'next';
import { GroupController } from '../../../controllers/group.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const groupController = new GroupController();
	const { id } = req.query;

	switch (req.method) {
		case 'GET':
			const result = await groupController.getOne({ id: Number(id) });
			res.status(result.status).json(result.response);
			break
		case 'PUT':
			const resultPut = await groupController.update(req.body);
			res.status(200).json(resultPut);
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
