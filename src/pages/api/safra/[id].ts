import { NextApiRequest, NextApiResponse } from 'next';
import { SafraController } from '../../../controllers/safra.controller';
import { apiHandler } from '../../../helpers/api';

/**
 * @swagger
 * /api/safras/[id]:
 *   get:
 *     description: Retorna todas safras da base
 *     responses:
 *       200:
 *         description: safras
*/

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new SafraController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const Result = await Controller.getOne(Number(id));
      res.status(200).json(Result.response);
      break;
    }
    case 'PUT': {
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default apiHandler(handler);
