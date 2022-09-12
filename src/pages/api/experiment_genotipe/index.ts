import { NextApiRequest, NextApiResponse } from 'next';
import { ExperimentGenotipeController } from '../../../controllers/experiment_genotipe.controller';
import { apiHandler } from '../../../helpers/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const experimentGenotipeController = new ExperimentGenotipeController();
    switch (req.method) {
        case 'GET': {
            const result = await experimentGenotipeController.getAll(req.query);
            res.status(200).json(result);
            break;
        }
        case 'POST': {
            const resultPost = await experimentGenotipeController.create(req.body);
            res.status(200).json(resultPost);
            break;
        }
        case 'PUT': {
            //   const resultPut = await experimentGenotipeController.update(req.body);
            //   res.status(200).json(resultPut);
            break;
        }
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default apiHandler(handler);
