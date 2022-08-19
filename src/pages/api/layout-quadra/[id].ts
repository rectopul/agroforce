import { NextApiRequest, NextApiResponse } from 'next';
import { LayoutQuadraController } from '../../../controllers/block-layout/layout-quadra.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const layoutQuadraController = new LayoutQuadraController();
  const id = Number(req.query.id);
  switch (req.method) {
    case 'PUT': {
      const resultPut = await layoutQuadraController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'GET': {
      const result: any = await layoutQuadraController.getOne(id);
      res.status(200).json(result.response);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
