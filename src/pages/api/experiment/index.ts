import { NextApiRequest, NextApiResponse } from 'next';
import { ExperimentController } from '../../../controllers/experiment.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const experimentController = new ExperimentController();

  switch (req.method) {
    case 'GET': {
      const resultGet = await experimentController.getAll(req.query);
      res.status(200).json(resultGet);
      break;
    }
    case 'POST': {
      const resultPost = await experimentController.create(req.body);
      res.status(201).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await experimentController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
