
import { NextApiRequest, NextApiResponse } from 'next';
import {CulturaController} from '../../../controllers/cultura.controller';

/**
 * @swagger
 * /api/cultura:
 *   get:
 *     description: Retorna todas culturas da base
 *     responses:
 *       200:
 *         description: culturas
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new CulturaController;
    switch (req.method) {
        case 'GET':
          res.status(200).json(await Controller.getCulture(0));
          break
        case 'POST':
          console.log(req.body);
          res.status(200).json(await Controller.postCulture([req.body]));
        break
        case 'PUT':
          console.log(req.body);
          res.status(200).json(await Controller.postCulture([req.body]));
        break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }

}