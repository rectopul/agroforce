import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import { prisma } from '../db/db';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default apiHandler(handler);
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userLogin } = req.body;

    if (req.method !== 'POST') {
      return res.status(404).end({ message: 'Erro de requisição!' });
    }

    const user = await prisma.user.findFirst({
      where: { login: String(userLogin) },
    });

    // if (!user) return res.status(400).json({message: 'Usuário não encontrado.'});

    const result = {
      name: user?.name,
      login: user?.login,
    };

    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).end({ message: `Erro de requisição! [ERRO]: ${err}` });
  }
}
