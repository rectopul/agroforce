
import { NextApiRequest, NextApiResponse } from 'next';
import { SequenciaDelineamentoController } from '../../../controllers/sequencia-delineamento.controller';
import { apiHandler } from '../../../helpers/api';


export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sequenciaDelineamentoController =  new SequenciaDelineamentoController();
  
  switch (req.method) {
    case 'GET':
      const result = await sequenciaDelineamentoController.listAll(req.query);
      res.status(200).json(result);
    break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
