import { NextApiRequest, NextApiResponse } from 'next';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { apiHandler } from '../../../helpers/api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new UserPreferenceController();
  switch (req.method) {
    case 'GET':
      res.status(200).json(await Controller.getAll(req.query));
      break;
    case 'PUT':
      res.status(200).json(await Controller.update(req.body));
      break;
    case 'POST':
      res.status(200).json(await Controller.create(req.body));
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
