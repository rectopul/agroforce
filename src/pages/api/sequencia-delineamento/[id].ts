import { NextApiRequest, NextApiResponse } from 'next';
import { SequenciaDelineamentoController } from '../../../controllers/sequencia-delineamento.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sequenciaDelineamentoController = new SequenciaDelineamentoController();
  const id = Number(req.query.id);
  switch (req.method) {
    case 'PUT': {
      const resultPut = await sequenciaDelineamentoController.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    case 'GET': {
      const result: any = await sequenciaDelineamentoController.getOne(id);
      res.status(200).json(result);
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