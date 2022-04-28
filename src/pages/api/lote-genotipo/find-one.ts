import { NextApiRequest, NextApiResponse } from "next";
import { LoteGenotipoController } from "src/controllers/lote-genotipo.controller";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const loteGenotipoController = new LoteGenotipoController();

  switch(req.method) {
    case 'GET':
      const resultPost = await loteGenotipoController.findOne({
        id: Number(id),
      });

      res.status(200).json(resultPost.loteGenotipo);
    break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
