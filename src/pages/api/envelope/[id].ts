import { NextApiRequest, NextApiResponse } from 'next';
import { EnvelopeController } from '../../../controllers/envelope.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const envelopeController = new EnvelopeController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const result = await envelopeController.getOne({ id: Number(id) });
      res.status(200).json(result.response);
      break;
    }
    case 'PUT': {
      const resultPut = await envelopeController.update(req.body);
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