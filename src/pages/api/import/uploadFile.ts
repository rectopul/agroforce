import { NextApiRequest, NextApiResponse } from 'next';
import { ImportController } from '../../../controllers/import.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new ImportController();
  switch (req.method) {
    case 'POST': {
      const response: any = await Controller.uploadFile(req);
      res.status(200).json(response);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiHandler(handler);
