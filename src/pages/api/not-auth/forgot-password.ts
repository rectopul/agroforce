import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import { prisma } from '../db/db';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userEmail } = req.body;

    if (req.method !== 'POST') {
      return res.status(404).end({message: 'Erro de requisição!'});
    }

    const user = await prisma.user.findFirst({
      where: { email: String(userEmail) }
    });

    if (!user) return res.status(400).json({message: 'Usuário não encontrado.'});

    const result = {
      name: user.name,
      email: user.email,
    }

    // console.log(JSON.stringify(user, null, 2))
    console.log(JSON.stringify(result, null, 2))

    return res.status(200).json(result);
  } catch(err) {
    return res.status(404).end({message: `Erro de requisição! [ERRO]: ${err}`});
  }
}