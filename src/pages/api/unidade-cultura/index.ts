import { NextApiRequest, NextApiResponse } from 'next';
import { UnidadeCulturaController } from '../../../controllers/local/unidade-cultura.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const unidadeCulturaController = new UnidadeCulturaController();

  switch (req.method) {
    case 'GET': {
      const result = await unidadeCulturaController.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await unidadeCulturaController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await unidadeCulturaController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'DELETE': {
      const resultDelete = await unidadeCulturaController.delete(req.body);
      res.status(200).json(resultDelete);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
