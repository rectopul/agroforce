import { NextApiRequest, NextApiResponse } from 'next';
import { ProfileController } from '../../../controllers/profile/profile.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const profileController = new ProfileController();

  switch (req.method) {
    case 'GET': {
      const resultGet = await profileController.getAll(req.query);
      res.status(200).json(resultGet);
      break;
    }
    case 'POST': {
      const resultPost = await profileController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await profileController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'DELETE': {
      const resultDelete = await profileController.deleted(req.body);
      res.status(200).json(resultDelete);
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
