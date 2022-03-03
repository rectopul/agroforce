
import { NextApiRequest, NextApiResponse } from 'next';
import { UserPermissionController } from 'src/controllers/user-permission.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserPermissionController();
    switch (req.method) {
        case 'GET':
            console.log(req.query.userId)
            let response = await Controller.getAllPermissions(req.query.userId);
            res.status(200).json(response);
            break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}