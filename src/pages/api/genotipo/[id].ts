import { NextApiRequest, NextApiResponse } from 'next';
import { GenotipoController } from '../../../controllers/genotype/genotipo.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const genotipoController = new GenotipoController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const result: any = await genotipoController.getOne(Number(id));
      res.status(200).json(result.response);
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);