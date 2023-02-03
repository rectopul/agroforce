import { NextApiRequest, NextApiResponse } from 'next';
import { SequenciaDelineamentoController } from '../../../controllers/sequencia-delineamento.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sequenciaDelineamentoController = new SequenciaDelineamentoController();

  switch (req.method) {
    case 'GET': {
      const result = await sequenciaDelineamentoController.getAll(req.query);
      res.status(200).json(result);
      break;
    }
    case 'POST': {
      const resultPost = await sequenciaDelineamentoController.create(req.body);
      res.status(200).json(resultPost);
      break;
    }
    case 'PUT': {
      const resultPut = await sequenciaDelineamentoController.update(req.body);
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
      sizeLimit: '16mb',
    },
  },
};

export default apiHandler(handler);