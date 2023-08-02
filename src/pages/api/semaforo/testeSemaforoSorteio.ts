import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import {SemaforoController} from "../../../controllers/semaforo.controller";

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new SemaforoController();
  switch (req.method) {
    case 'POST':

      let response = {};
      response = await Controller.testeSemaforo();
      res.status(200).json(response);
      
      break;
      
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
