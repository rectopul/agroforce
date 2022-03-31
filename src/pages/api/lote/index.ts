
import { NextApiRequest, NextApiResponse } from 'next';
import { LoteController } from '../../../controllers/lote.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const loteController =  new LoteController();

  switch (req.method) {
    case 'GET':
      let result = await loteController.listAll(req.query);
      res.status(200).json(result);
      break
    case 'POST':
      let resultPost = await loteController.create(req.body);
      res.status(201).json(resultPost);
      break
    case 'PUT':
      let resultPut = await loteController.update(req.body);  
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  return;
}
