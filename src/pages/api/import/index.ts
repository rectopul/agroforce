import { NextApiRequest, NextApiResponse } from 'next';
import { ImportController } from '../../../controllers/import.controler';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new ImportController();
  switch (req.method) {
    case 'GET': {
      const response = await Controller.getAll(Number(req.query.moduleId));
      res.status(200).json(response);
      break;
    }
    case 'POST': {
      const result = await Controller.post(req.body);
      res.status(200).json(result);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
export default apiHandler(handler);
