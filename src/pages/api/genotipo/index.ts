
import { NextApiRequest, NextApiResponse } from 'next';
import { GenotipoController } from '../../../controllers/genotipo.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_culture } = req.query;
  const genotipoController =  new GenotipoController();

  switch (req.method) {
    case 'GET':
      const resultGet = await genotipoController.listAllGenotipos(req.query);
      res.status(200).json(resultGet);
      break
    case 'POST':
      const resultPost = await genotipoController.createGenotipo(req.body);
      res.status(201).json(resultPost);
      break
    case 'PUT':
      let resultPut = await genotipoController.updategenotipo(req.body);
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
