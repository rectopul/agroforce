
import { NextApiRequest, NextApiResponse } from 'next';
import {CulturaController} from '../../../controllers/cultura.controller';

export default async function teste(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new CulturaController;
    switch (req.method) {
        case 'GET':
          res.status(200).json(await Controller.getCulture(0));
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }

}