import { NextApiRequest, NextApiResponse } from 'next';
import { ReporteController } from '../../../controllers/reporte/reporte.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reporteController = new ReporteController();
  switch (req.method) {
    case 'GET':
      const result = await reporteController.getAll(req.query);
      res.status(200).json(result);
      break;
    case 'POST':
      const resultPost = await reporteController.create(req.body);
      res.status(200).json(resultPost);
      break;
    case 'PUT':
      const resultPut = await reporteController.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
