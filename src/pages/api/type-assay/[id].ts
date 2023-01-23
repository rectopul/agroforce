import { NextApiRequest, NextApiResponse } from 'next';
import { TypeAssayController } from '../../../controllers/tipo-ensaio.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const typeAssayController = new TypeAssayController();
  const { id } = req.query;
  switch (req.method) {
    case 'PUT': {
      const resultPut = await typeAssayController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'GET': {
      const result = await typeAssayController.getOne(Number(id));
      res.status(200).json(result.response);
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