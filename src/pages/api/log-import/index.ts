import { NextApiRequest, NextApiResponse } from 'next';
import { LogImportController } from '../../../controllers/log-import.controller';
import { apiHandler } from '../../../helpers/api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16mb',
    },
    responseLimit: false,
  },
};

export default apiHandler(handler);
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const logImportController = new LogImportController();

  switch (req.method) {
    case 'GET':
      const result = await logImportController.getAll(req.query);
      res.status(200).json(result);
      break;
    case 'POST':
      const resultPost = await logImportController.create(req.body);
      res.status(200).json(resultPost);
      break;
    case 'PUT':
      const resultPut = await logImportController.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
