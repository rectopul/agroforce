
import { NextApiRequest, NextApiResponse } from 'next';
import { UnidadeCulturaController } from '../../../controllers/unidade-cultura.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const unidadeCulturaController = new UnidadeCulturaController();

    switch (req.method) {
        case 'GET':
            const result = await unidadeCulturaController.listAll(req.query);
            res.status(200).json(result);
            break
        case 'POST':
            const resultPost = await unidadeCulturaController.create(req.body);
            res.status(201).json(resultPost);
            break
        case 'PUT':
            const resultPut = await unidadeCulturaController.update(req.body);
            res.status(200).json(resultPut);
            break
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    return;
}
