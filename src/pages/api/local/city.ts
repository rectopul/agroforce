
import { NextApiRequest, NextApiResponse } from 'next';
import {LocalController} from '../../../controllers/local.controller';
import { apiHandler } from '../../../helpers/api';


export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new LocalController();
    switch (req.method) {
        case 'GET':
          let result = await Controller.getCitys(req.query.ufId);
          res.status(200).json(result);
          break
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}