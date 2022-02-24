
import { NextApiRequest, NextApiResponse } from 'next';
import {UserController} from '../../../controllers/user.controller';
import { apiHandler } from '../../../helpers/api';


/**
 * @swagger
 * /api/user:
 *   get:
 *     description: Retorna todos usuarios
 *     responses:
 *       200:
 *         description: Users
 */
export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserController();
    switch (req.method) {
        case 'GET':
            let response = await Controller.getAllUser(req.body);
            res.status(200).json(response);
            break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}