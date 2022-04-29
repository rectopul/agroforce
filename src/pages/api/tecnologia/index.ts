
import { NextApiRequest, NextApiResponse } from 'next';
import { TecnologiaController } from '../../../controllers/tecnologia.controller';
import { apiHandler } from '../../../helpers/api';


export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tecnologiaController =  new TecnologiaController();
  switch (req.method) {
    case 'GET':
      const result = await tecnologiaController.getAll(req.query);
      res.status(200).json(result);
    break;
    case 'POST':
      const resultPost = await tecnologiaController.post(req.body);  
      res.status(200).json(resultPost);
    break;
    case 'PUT':
      const resultPut = await tecnologiaController.update(req.body);  
      res.status(200).json(resultPut);
    break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
