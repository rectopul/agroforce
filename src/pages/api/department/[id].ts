import { NextApiRequest, NextApiResponse } from 'next';
import { DepartamentController } from '../../../controllers/departament.controller';
import { apiHandler } from '../../../helpers/api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const departamentController = new DepartamentController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result = await departamentController.getOneDepartament({ id: Number(id) });
      res.status(200).json(result.response);
      break;
    case 'PUT':
      const resultPut = await departamentController.updateDepartament(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
