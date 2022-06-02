
import { NextApiRequest, NextApiResponse } from 'next';
import { GrupoController } from '../../../controllers/grupo.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const grupoController =  new GrupoController();

  switch (req.method) {
    case 'GET':
      let result = await grupoController.listAll(req.query);
      res.status(200).json(result);
      break
    case 'POST':
      let resultPost = await grupoController.create(req.body);
      res.status(201).json(resultPost);
      break
    case 'PUT':
      let resultPut = await grupoController.update(req.body);  
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  return;
}
