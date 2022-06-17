
import { NextApiRequest, NextApiResponse } from 'next';
import { MateriaisController } from '../../../controllers/materiais.controller';
import { apiHandler } from '../../../helpers/api';

export default apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const materiaisController = new MateriaisController();

    switch (req.method) {
        case 'GET':
            const resultGet = await materiaisController.getAll(req.query);
            res.status(200).json(resultGet);
            break
        case 'POST':
            const resultPost = await materiaisController.create(req.body);
            res.status(201).json(resultPost);
            break
        case 'PUT':
            let resultPut = await materiaisController.update(req.body);
            res.status(200).json(resultPut);
            break
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
