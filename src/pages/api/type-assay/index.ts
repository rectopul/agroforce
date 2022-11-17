import { NextApiRequest, NextApiResponse } from 'next';
import { TypeAssayController } from '../../../controllers/tipo-ensaio.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const typeAssayController = new TypeAssayController();
  console.log('req.method');
  console.log(req.method);
  switch (req.method) {
    case 'GET': {
      const result = await typeAssayController.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await typeAssayController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await typeAssayController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
