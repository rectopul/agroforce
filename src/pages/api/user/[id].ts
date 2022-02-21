
import { NextApiRequest, NextApiResponse } from 'next';
import {UserController} from '../../../controllers/user.controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserController();
    const id = req.query.id.toString();
    switch (req.method) {
        case 'PUT':
            let resultPut = await Controller.updateUser(id, req.body);  
            res.status(200).json(resultPut);
            break
        case 'GET':
            let result = await Controller.getOneUser(id);  
            res.status(200).json(result.response);
            break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}