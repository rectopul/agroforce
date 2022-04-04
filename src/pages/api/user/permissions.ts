
import { NextApiRequest, NextApiResponse } from 'next';
import { UserPermissionController } from 'src/controllers/user-permission.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserPermissionController();
    switch (req.method) {
        case 'GET':
            res.status(200).json(await Controller.getByUserID(req.query.userId));
            break
        case 'PUT':
            if (req.body.userId === undefined) {
                res.status(200).json( await Controller.updateCultures(req.body));
            } else {
                res.status(200).json( await Controller.updateAllStatusCultures(req.body.userId));
            }
            break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}