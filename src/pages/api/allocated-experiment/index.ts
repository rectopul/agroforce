import { NextApiRequest, NextApiResponse } from 'next';
import { AllocatedExperimentController } from '../../../controllers/allocation/allocated-experimento.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allocatedExperimentController = new AllocatedExperimentController();

  switch (req.method) {
    case 'GET': {
      const result = await allocatedExperimentController.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await allocatedExperimentController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await allocatedExperimentController.update(req.body);
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
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);