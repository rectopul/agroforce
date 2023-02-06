import { NextApiRequest, NextApiResponse } from 'next';
import { AssayListController } from '../../../controllers/assay-list/assay-list.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const assayListController = new AssayListController();
  const { id } = req.query;
  switch (req.method) {
    case 'GET': {
      const result = await assayListController.getOne(Number(id));
      res.status(200).json(result.response);
      break;
    }
    case 'PUT': {
      const resultPut = await assayListController.update(req.body);
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