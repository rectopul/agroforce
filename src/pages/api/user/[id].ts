import { NextApiRequest, NextApiResponse } from 'next';
import { UserController } from '../../../controllers/user.controller';
import { apiHandler } from '../../../helpers/api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new UserController();
  const id = Number(req.query.id);
  switch (req.method) {
    case 'PUT':
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    case 'GET':
      const result = await Controller.getOne(id);
      res.status(200).json(result);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
