import { NextApiRequest, NextApiResponse } from 'next';
import { ReplaceTreatmentController } from '../../../controllers/genotype-treatment/replace-treatment.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const replaceTreatmentController = new ReplaceTreatmentController();

  switch (req.method) {
    case 'GET': {
      const resultGet = await replaceTreatmentController.getAll(req.query);
      res.status(200).json(resultGet);
      break;
    }
    case 'POST': {
      const resultPut = await replaceTreatmentController.replace(req.body);
      res.status(200).json(resultPut);
      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);