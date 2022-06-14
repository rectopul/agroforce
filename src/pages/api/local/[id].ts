
import { NextApiRequest, NextApiResponse } from 'next';
import { LocalController } from '../../../controllers/local.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller = new LocalController();
    const id = req.query.id.toString();   
    switch (req.method) {
        case 'PUT':
            const resultPut = await Controller.updateLocal(req.body);
            res.status(200).json(resultPut);
            break;
        case 'GET':
            const result: any = await Controller.getOneLocal({ id });            
            res.status(200).json(result.response);
            break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}