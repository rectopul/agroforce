import { NextApiRequest, NextApiResponse } from 'next';
import { QuadraController } from '../../../controllers/quadra.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_culture } = req.query;
  const Controller = new QuadraController();

  switch (req.method) {
    case 'GET':
      const resultGet = await Controller.getAll(req.query);
      res.status(200).json(resultGet);
      break;
    case 'POST':
      const resultPost = await Controller.create(req.body);
      res.status(201).json(resultPost);
      break;
    case 'PUT':
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
