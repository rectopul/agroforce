import { NextApiRequest, NextApiResponse } from 'next';
import { QuadraController } from '../../../controllers/quadra.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const quadraController =  new QuadraController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result: any = await quadraController.getOne(Number(id));
      res.status(result.status).json(result.response);
      break
    case 'PUT':
      const resultPut = await quadraController.update(req.body);
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
