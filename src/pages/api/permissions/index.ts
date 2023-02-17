import { NextApiRequest, NextApiResponse } from 'next';
import { PermissionsController } from '../../../controllers/permissions/permissions.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const permissionsController = new PermissionsController();

  switch (req.method) {
    case 'GET': {
      const resultGet = await permissionsController.getAll(req.query);
      res.status(200).json(resultGet);
      break;
    }
    case 'POST': {
      const resultPost = await permissionsController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await permissionsController.update(req.body);
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
