// eslint-disable-next-line import/no-cycle
import { DelineamentoController } from '../../controllers/delimitation/delineamento.controller';

export async function countDelimitation(response: any) {
  const delineamentoController = new DelineamentoController();

  let repeticao = 0;
  let tratamentoRepeticao = 0;
  response.forEach((item: any) => {
    if (item.repeticao > repeticao) {
      repeticao = item.repeticao;
    }
    if (item.nt > tratamentoRepeticao) {
      tratamentoRepeticao = item.nt;
    }
  });
  await delineamentoController.update(
    {
      id: response[0]?.id_delineamento,
      repeticao,
      trat_repeticao: tratamentoRepeticao,
    },
  );
}
