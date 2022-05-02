
import { NextApiRequest, NextApiResponse } from 'next';
import { SequenciaDelineamentoController } from 'src/controllers/sequencia-delineamento.controller';
import { DelineamentoController } from '../../../controllers/delineamento.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        id_delineamento,
        name,
        repeticao,
        sorteio,
        nt,
        bloco,
        created_by,
    } = req.body;

    const Controller =  new DelineamentoController();
    const sequenciaDelineamentoController =  new SequenciaDelineamentoController();
    
    const id = req.query.id.toString();
    switch (req.method) {
        case 'PUT':
            let resultPut = await Controller.update(req.body);  
            res.status(200).json(resultPut);
            break;
        case 'GET':
            let result: any = await Controller.getOne(id);  
            res.status(200).json(result.response);
            break;
        case 'POST':
            console.log("API")
            const resultPost = await sequenciaDelineamentoController.create({
                id_delineamento,
                name,
                repeticao,
                sorteio,
                nt,
                bloco,
                created_by,
            });
            res.status(201).json(resultPost);
        break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
