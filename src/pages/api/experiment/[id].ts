import { NextApiRequest, NextApiResponse } from 'next';
import { ExperimentController } from '../../../controllers/experiment/experiment.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const experimentoController = new ExperimentController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const result: any = await experimentoController.getOne(Number(id));
      res.status(200).json(result.response);
      break;
    }
    case 'PUT': {
      const resultPut = await experimentoController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
