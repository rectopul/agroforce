
import { NextApiRequest, NextApiResponse } from 'next';
import {CulturaController} from '../../../controllers/cultura.controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new CulturaController;
    const id = req;
    console.log(id);
    switch (req.method) {
        case 'GET':
            const Result = await Controller.getCulture(2);
            res.status(200).json({Result});
          break
        case 'POST':
          res.status(200).json(await Controller.postCulture(2));
        break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }

}