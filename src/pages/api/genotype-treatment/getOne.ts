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

  switch (req.method) {
    case 'POST':
      console.log('req.body',req.body, req.body?.id);
      const result = await genotypeTreatmentController.getOne(Number(req.body?.id));
      res.status(200).json(result);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
