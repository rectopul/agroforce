import { NextApiRequest, NextApiResponse } from 'next';
import { EnvelopeController } from '../../../controllers/envelope.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const envelopeController = new EnvelopeController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result = await envelopeController.listOne({ id: Number(id) });
      res.status(200).json(result.response);
      break;
    case 'PUT':
      const resultPut = await envelopeController.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
