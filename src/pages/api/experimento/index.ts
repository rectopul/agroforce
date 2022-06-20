
import { NextApiRequest, NextApiResponse } from 'next';
import { ExperimentoController } from '../../../controllers/experimento.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const experimentoController =  new ExperimentoController();

  switch (req.method) {
    case 'GET':
      const resultGet = await experimentoController.getAll(req.query);
      res.status(200).json(resultGet);
      break
    case 'POST':
      const resultPost = await experimentoController.create(req.body);
      res.status(201).json(resultPost);
      break
    case 'PUT':
      let resultPut = await experimentoController.update(req.body);
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
