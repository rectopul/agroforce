import { NextApiRequest, NextApiResponse } from 'next';
import { EpocaController } from '../../../controllers/epoca.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const epocaController = new EpocaController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result = await epocaController.getOne(Number(id));
      res.status(200).json(result.response);
      break;
    case 'PUT':
      const resultPut = await epocaController.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
