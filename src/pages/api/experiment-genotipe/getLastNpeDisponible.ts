import { NextApiRequest, NextApiResponse } from 'next';
import { ExperimentGenotipeController } from '../../../controllers/experiment-genotipe.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new ExperimentGenotipeController();
  switch (req.method) {
    case 'POST': {
      const response: any = await Controller.getLastNpeDisponible(req.body);
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
      sizeLimit: '16mb',
    },
  },
};

export default apiHandler(handler);
