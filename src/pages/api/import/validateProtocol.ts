import { NextApiRequest, NextApiResponse } from 'next';
import { ImportController } from '../../../controllers/import.controler';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new ImportController();
  switch (req.method) {
    case 'POST': {
      const resp: any = await Controller.validateProtocol(req.body);
      res.status(resp.status).json(resp);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
