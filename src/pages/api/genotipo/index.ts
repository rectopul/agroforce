import { NextApiRequest, NextApiResponse } from 'next';
import { GenotipoController } from '../../../controllers/genotipo.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const genotipoController = new GenotipoController();

  switch (req.method) {
    case 'GET': {
      const resultGet = await genotipoController.getAll(req.query);
      res.status(200).json(resultGet);
      break;
    }
    case 'POST': {
      const resultPost = await genotipoController.create(req.body);
      res.status(201).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await genotipoController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
