import { NextApiRequest, NextApiResponse } from 'next';
import { UnidadeCulturaController } from '../../../controllers/local/unidade-cultura.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const unidadeCulturaController = new UnidadeCulturaController();
  const { id } = req.query;
  switch (req.method) {
    case 'GET': {
      const result = await unidadeCulturaController.getOne({ id: Number(id) });
      res.status(200).json(result);
      break;
    }
    case 'PUT': {
      const resultPut = await unidadeCulturaController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
