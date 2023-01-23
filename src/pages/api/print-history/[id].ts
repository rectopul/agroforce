import { NextApiRequest, NextApiResponse } from 'next';
import { PrintHistoryController } from '../../../controllers/print-history/print-history.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const printHistoryController = new PrintHistoryController();
  const id = Number(req.query.id);
  switch (req.method) {
    case 'PUT': {
      const resultPut = await printHistoryController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'GET': {
      const result: any = await printHistoryController.getOne(id);
      res.status(200).json(result);
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