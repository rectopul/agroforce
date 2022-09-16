import { NextApiRequest, NextApiResponse } from 'next';
import { ExperimentGroupController } from '../../../controllers/experiment-group/experiment-group.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const experimentGroupController = new ExperimentGroupController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const result: any = await experimentGroupController.getOne(Number(id));
      res.status(200).json(result.response);
      break;
    }
    case 'PUT': {
      const resultPut = await experimentGroupController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
