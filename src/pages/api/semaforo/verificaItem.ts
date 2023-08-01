import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import {SemaforoController} from "../../../controllers/semaforo.controller";

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new SemaforoController();
  switch (req.method) {
    case 'GET':
      const response = await Controller.validaSemaforoItem(
        '' + req.query.sessao,
        '' + req.query.acao, 
        String(req.query.referencia), 
        String(req.query.codReferencia),
        parseInt('' + req.query.user) || 0,
        '' + (req.query.tipo || 'front'),
        '' + (req.query.automatico || 's')
      );
      res.status(200).json(response);
      break;
    case 'POST':

      let response2 = {};
      
      switch (req.body.metodo){
        case 'finaliza':
          response2 = await Controller.finalizaRest(
              '' + req.body.sessao,
              '' + req.body.acao,
          );
          res.status(200).json(response2);
          break;
          
        default:
          response2 = await Controller.finalizaRest(
              '' + req.body.sessao,
              '' + req.body.acao,
          );
          res.status(200).json(response2);
          break;
      }
      
      break;
    case 'DELETE':
      const response3 = await Controller.finalizaAcao(
        parseInt(<string>req.body.id),
        req.body.sessao,
      );
      res.status(200).json(response3);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
