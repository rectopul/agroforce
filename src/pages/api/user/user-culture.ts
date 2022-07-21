import { NextApiRequest, NextApiResponse } from 'next';
import { UserCultureController } from 'src/controllers/user-culture.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new UserCultureController();
  switch (req.method) {
    case 'GET':
      res.status(200).json(await Controller.getByUserID(req.query.userId));
      break;
    case 'PUT':
      if (req.body.userId === undefined) {
        res.status(200).json(await Controller.update(req.body));
      } else {
        res.status(200).json(await Controller.updateAllStatus(req.body.userId));
      }
      break;
    case 'POST':
      res.status(200).json(await Controller.save(req.body));
      break;
    case 'DELETE':
      res.status(200).json(await Controller.delete(req.body));
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
