import { NextApiRequest, NextApiResponse } from 'next';
import { UserController } from '../../../controllers/user.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userController =  new UserController();
  switch (req.method) {
    case 'POST':
      const result = await userController.findUserByEmail(req.body);
      res.status(200).json(result);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
