import { NextApiRequest, NextApiResponse } from 'next';
import { ImportExperimentController } from '../../../controllers/experiment/import-experiment.controller';
import { ExperimentController } from '../../../controllers/experiment/experiment.controller';
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
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await experimentController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'DELETE': {
      const resultDelete = await experimentController.delete(req.body);
      res.status(200).json(resultDelete);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    // bodyParser: {
    //   sizeLimit: '16mb',
    // },
    //bodyParser: process.env.NODE_ENV !== 'production',
    bodyParser: false,
    responseLimit: false,
  },
};

export default apiHandler(handler);