import { NextApiRequest, NextApiResponse } from 'next';
import { ProfileController } from '../../../controllers/profile/profile.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const profileController = new ProfileController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const result: any = await profileController.getOne(Number(id));
      res.status(200).json(result.response);
      break;
    }
    case 'PUT': {
      const resultPut = await profileController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16mb',
    },
  },
};

export default apiHandler(handler);
