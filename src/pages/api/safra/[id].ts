
import { NextApiRequest, NextApiResponse } from 'next';
import {SafraController} from '../../../controllers/safra.controller';
import { apiHandler } from '../../../helpers/api';

/**
 * @swagger
 * /api/safras/[id]:
 *   get:
 *     description: Retorna todas safras da base
 *     responses:
 *       200:
 *         description: safras
 */

 export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new SafraController();
    const id = req.query.id.toString();
    switch (req.method) {
        case 'GET':
            let Result = await Controller.getOneSafra(id);
            res.status(Result.status).json(Result.response);
          break
        case 'PUT':
          let resultPut = await Controller.updateSafra(req.body);  
          res.status(200).json(resultPut);
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}