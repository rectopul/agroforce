import { NextApiRequest, NextApiResponse } from 'next';
import { LayoutQuadraController } from '../../../controllers/block-layout/layout-quadra.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const layoutQuadraController = new LayoutQuadraController();
  switch (req.method) {
    case 'GET': {
      const result = await layoutQuadraController.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await layoutQuadraController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await layoutQuadraController.update(req.body);
      res.status(200).json(resultPut);
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