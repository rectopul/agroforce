
import { NextApiRequest, NextApiResponse } from 'next';
import { SequenciaDelineamentoController } from '../../../controllers/sequencia-delineamento.controller';
import { apiHandler } from '../../../helpers/api';


export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_delineamento } = req.query;

  const sequenciaDelineamentoController =  new SequenciaDelineamentoController();
  
  switch (req.method) {
    case 'GET':
      const result = await sequenciaDelineamentoController.list(Number(id_delineamento));
      res.status(200).json(result);
    break;
    case 'PUT':
      const resultPut = await sequenciaDelineamentoController.update(req.body);  
      res.status(200).json(resultPut);
    break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
