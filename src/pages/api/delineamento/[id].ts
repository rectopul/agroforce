import { NextApiRequest, NextApiResponse } from 'next';
import { DelineamentoController } from '../../../controllers/delineamento.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new DelineamentoController();
  const id = Number(req.query.id);
  switch (req.method) {
    case 'PUT': {
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'GET': {
      const result: any = await Controller.getOne(id);
      res.status(200).json(result.response);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
