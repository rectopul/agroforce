
import { NextApiRequest, NextApiResponse } from 'next';
import {LayoutQuadraController} from '../../../controllers/layout-quadra.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new LayoutQuadraController();
    const id = req.query.id.toString();
    switch (req.method) {
        case 'PUT':
            let resultPut = await Controller.update(req.body);  
            res.status(200).json(resultPut);
            break;
        case 'GET':
            let result: any = await Controller.getOne(id);  
            res.status(200).json(result.response);
            break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}