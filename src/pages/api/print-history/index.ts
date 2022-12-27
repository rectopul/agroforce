import { NextApiRequest, NextApiResponse } from 'next';
import { PrintHistoryController } from '../../../controllers/print-history/print-history.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const printHistoryController = new PrintHistoryController();
  switch (req.method) {
    case 'GET': {
      const result = await printHistoryController.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await printHistoryController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await printHistoryController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
