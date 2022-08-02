import { NextApiRequest, NextApiResponse } from 'next';
import { SafraController } from '../../../controllers/safra.controller';
import { apiHandler } from '../../../helpers/api';

/**
 * @swagger
 * /api/safras:
 *   get:
 *     description: Retorna todas safras da base
 *     responses:
 *       200:
 *         description: safras
 */

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new SafraController();
  switch (req.method) {
    case 'GET':
      const result = await Controller.getAll(req.query);
      res.status(200).json(result);
      break;
    case 'POST':
      const resultPost = await Controller.create(req.body);
      res.status(200).json(resultPost);
      break;
    case 'PUT':
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
