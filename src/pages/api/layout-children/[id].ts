import { NextApiRequest, NextApiResponse } from 'next';
import { LayoutChildrenController } from '../../../controllers/layout-children.controller';
import { apiHandler } from '../../../helpers/api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16mb',
    },
  },
};

export default apiHandler(handler);
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new LayoutChildrenController();
  const id = Number(req.query.id);
  switch (req.method) {
    case 'PUT':
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    case 'GET':
      const result: any = await Controller.getOne(Number(id));
      res.status(200).json(result.response);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
