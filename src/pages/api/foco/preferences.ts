
import { NextApiRequest, NextApiResponse } from 'next';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const userPreferenceController = new UserPreferenceController();
	switch (req.method) {
		case 'GET':
			res.status(200).json(await userPreferenceController.getAllPreferences(req.query));
			break
		case 'PUT':
			res.status(200).json(await userPreferenceController.updateUserPreferences(req.body));
			break
		case 'POST':
			res.status(200).json(await userPreferenceController.postUser(req.body));
			break
		default:
			res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}