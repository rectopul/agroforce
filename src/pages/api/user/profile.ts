import { NextApiRequest, NextApiResponse } from 'next';
import { ProfileController } from 'src/controllers/profile.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new ProfileController();
  switch (req.method) {
    case 'GET':
      const response = await Controller.getAllProfiles();
      res.status(200).json(response);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
