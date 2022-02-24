
import { NextApiRequest, NextApiResponse } from 'next';
import {UserController} from '../../../controllers/user.controller';
import { UserRepository } from 'src/repository/user.repository';
import { apiHandler } from '../../../helpers/api';


/**
 * @swagger
 * /api/user/permissions:
 *   get:
 *     description: Retorna todas as permissions do usuário logado
 *     responses:
 *       200:
 *         description: Users
 */
export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserRepository();
    switch (req.method) {
        case 'GET':
            let response = await Controller.getPermissions();
            res.status(200).json(response);
            break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}