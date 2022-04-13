
import { NextApiRequest, NextApiResponse } from 'next';
import { ImportController } from '../../../controllers/import.controler';
import { apiHandler } from '../../../helpers/api';


export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new ImportController();
    switch (req.method) {
        case 'GET':
            let response = await Controller.getAll(1);
            console.log(response);
            res.status(200).json(response);
            break;
        case 'POST':
            // await Controller.validateInfoTable({moduleId: 1});
            let Result = await Controller.post(req.body);
            res.status(200).json(Result);
            break;
        case 'PUT':
            // let resultPut = await Controller.updateCultures(req.body);
            // res.status(200).json(resultPut);
            break;
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

}