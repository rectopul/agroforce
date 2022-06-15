import { NextApiRequest, NextApiResponse } from 'next';
import { GenotipoController } from '../../../controllers/genotipo.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const genotipoController =  new GenotipoController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result: any = await genotipoController.getOneGenotipo(Number(id));
      res.status(result.status).json(result.response);
      break
    case 'PUT':
      const resultPut = await genotipoController.updategenotipo(req.body);
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
