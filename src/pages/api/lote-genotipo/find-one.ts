import { NextApiRequest, NextApiResponse } from "next";
import { LoteGenotipoController } from "src/controllers/lote-genotipo.controller";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { id: id_lote, status } = req.body;

  const loteGenotipoController = new LoteGenotipoController();

  switch(req.method) {
    case 'GET':
      const resultPost = await loteGenotipoController.findOne({
        id: Number(id),
      });

      res.status(200).json(resultPost.loteGenotipo);
    break;

    case 'PUT':
      const resultPut = await loteGenotipoController.changeStatus({
        id: Number(id_lote),
        status: Number(status),
      });

      res.status(200).json(resultPut);
    break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
