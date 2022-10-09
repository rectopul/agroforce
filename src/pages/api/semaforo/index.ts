import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import {SemaforoController} from "../../../controllers/semaforo.controller";

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new SemaforoController();
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
