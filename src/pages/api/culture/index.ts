
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
    switch (req.method) {
        case 'GET':
          let result = await Controller.getAllCulture();
          res.status(200).json(result);
          break
        case 'POST':
          let resultPost = await Controller.postCulture(req.body);  
          res.status(200).json(resultPost);
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}