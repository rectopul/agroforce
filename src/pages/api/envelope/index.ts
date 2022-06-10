
import { NextApiRequest, NextApiResponse } from 'next';
import { EnvelopeController } from '../../../controllers/envelope.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const envelopeController = new EnvelopeController();
    switch (req.method) {
        case 'GET':
            const response = await envelopeController.listAll(req.query);
            res.status(200).json(response);
            break
        case 'POST':
            const responsePost = await envelopeController.create(req.body);
            res.status(201).json(responsePost);
            break
        case 'PUT':
            const responsePut = await envelopeController.update(req.body);
            res.status(200).json(responsePut);
            break
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    return;
}
