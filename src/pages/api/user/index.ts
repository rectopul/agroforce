import { NextApiRequest, NextApiResponse } from 'next';
import { UserController } from '../../../controllers/user.controller';
import { apiHandler } from '../../../helpers/api';

/**
 * @swagger
 * /api/user:
 *   get:
 *     description: Retorna todos usuarios
 *     responses:
 *       200:
 *         description: Users
 */
export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new UserController();
  switch (req.method) {
    case 'GET':
      const response = await Controller.getAll(req.query);
      res.status(200).json(response);
      break;
    case 'POST':
      const Result = await Controller.create(req.body);
      res.status(200).json(Result);
      break;
    case 'PUT':
      const resultPut = await Controller.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
