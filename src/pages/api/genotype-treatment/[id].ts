import { NextApiRequest, NextApiResponse } from 'next';
import { GenotypeTreatmentController } from '../../../controllers/genotype-treatment/genotype-treatment.controller';
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
  const genotypeTreatmentController = new GenotypeTreatmentController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result = await genotypeTreatmentController.getOne(Number(id));
      res.status(200).json(result.response);
      break;
    case 'PUT':
      const resultPut = await genotypeTreatmentController.update(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
