import { NextApiRequest, NextApiResponse } from 'next';
import { LayoutQuadraController } from '../../../controllers/block-layout/layout-quadra.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new LayoutQuadraController();
  switch (req.method) {
    case 'GET': {
      const result = await Controller.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await Controller.post(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
