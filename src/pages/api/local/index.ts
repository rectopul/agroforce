
import { NextApiRequest, NextApiResponse } from 'next';
import {LocalController} from '../../../controllers/local.controller';
import { apiHandler } from '../../../helpers/api';


export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new LocalController();
    switch (req.method) {
        case 'GET':
          let result = await Controller.getAllLocal(req.query);
          res.status(200).json(result);
          break
        case 'POST':
          let resultPost = await Controller.postLocal(req.body);  
          res.status(200).json(resultPost);
          break
        case 'PUT':
          let resultPut = await Controller.updateLocal(req.body);  
          res.status(200).json(resultPut);
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}