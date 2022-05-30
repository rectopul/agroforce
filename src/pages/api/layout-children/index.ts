
import { NextApiRequest, NextApiResponse } from 'next';
import {LayoutChildrenController} from '../../../controllers/layout-children.controller';
import { apiHandler } from '../../../helpers/api';


export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new LayoutChildrenController();
    switch (req.method) {
        case 'GET':
          let result = await Controller.listAll(req.query);
          res.status(200).json(result);
          break
        case 'POST':
          let resultPost = await Controller.create(req.body);  
          res.status(200).json(resultPost);
          break
        case 'PUT':
          let resultPut = await Controller.update(req.body);  
          res.status(200).json(resultPut);
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}