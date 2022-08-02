import { NextApiRequest, NextApiResponse } from 'next';
import { LoteController } from '../../../controllers/lote.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const loteController = new LoteController();

  switch (req.method) {
    case 'GET': {
      const result = await loteController.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await loteController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await loteController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
