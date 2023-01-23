import { NextApiRequest, NextApiResponse } from 'next';
import { ExperimentGenotipeController } from '../../../controllers/experiment-genotipe.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new ExperimentGenotipeController();
  switch (req.method) {
    case 'POST': {
      console.log('POST');
      console.log('req.body', req.body);
      const response: any = await Controller.getLastNpeDisponible(req.body);
      console.log('response', response);
      res.status(200).json(response);
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
