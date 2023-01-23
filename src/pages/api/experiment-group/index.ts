import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import { ExperimentGroupController } from '../../../controllers/experiment-group/experiment-group.controller';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const experimentGroupController = new ExperimentGroupController();
  switch (req.method) {
    case 'GET': {
      const resultGet = await experimentGroupController.getAll(req.query);
      res.status(200).json(resultGet);
      break;
    }
    case 'POST': {
      const resultPost = await experimentGroupController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await experimentGroupController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'DELETE': {
      const resultDelete = await experimentGroupController.delete(req.body);
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
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);