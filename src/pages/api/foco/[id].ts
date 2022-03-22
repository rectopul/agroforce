import { NextApiRequest, NextApiResponse } from 'next';
import { FocoController } from '../../../controllers/foco.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const focoController =  new FocoController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result = await focoController.getOneFoco(Number(id));
      res.status(result.status).json(result.response);
      break
    case 'PUT':
      const resultPut = await focoController.updateFoco(req.body);
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
