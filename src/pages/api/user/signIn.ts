
import { NextApiRequest, NextApiResponse } from 'next';
import {UserController} from '../../../controllers/user.controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserController();
    switch (req.method) {
        case 'POST':
          let result = await Controller.signinUSer(req.body);
          res.status(200).json(result?.response);
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}