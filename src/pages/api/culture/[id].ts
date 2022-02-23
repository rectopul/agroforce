
import { NextApiRequest, NextApiResponse } from 'next';
import {CulturaController} from '../../../controllers/cultura.controller';
import { apiHandler } from '../../../helpers/api';

/**
 * @swagger
 * /api/cultura:
 *   get:
 *     description: Retorna todas culturas da base
 *     responses:
 *       200:
 *         description: culturas
 */

 export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new CulturaController();
    const id = req.query.id.toString();
    switch (req.method) {
        case 'GET':
            let Result = await Controller.getOneCulture(id);
            res.status(Result.status).json(Result.response);
          break
        case 'PUT':
          let resultPut = await Controller.updateCulture(id, req.body);  
          res.status(200).json(resultPut);
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}