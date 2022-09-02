// eslint-disable-next-line import/no-cycle
import { AssayListController } from '../../controllers/assay-list/assay-list.controller';
import { LayoutQuadraController } from '../../controllers/block-layout/layout-quadra.controller';
import { DelineamentoController } from '../../controllers/delimitation/delineamento.controller';
import { GenotipoController } from '../../controllers/genotype/genotipo.controller';

export async function countBlock(response: any) {
  const layoutQuadraController = new LayoutQuadraController();
  let disparos = 0;
  let tiros = 0;
  response.forEach((item: any) => {
    if (item.tiro > tiros) {
      tiros = item.tiro;
    }
    if (item.disparo > disparos) {
      disparos = item.disparo;
    }
  });
  await layoutQuadraController.update({ id: response[0]?.id_layout, tiros, disparos });
}

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

export async function countLotesNumber({ response }: any) {
  const genotipoController = new GenotipoController();

  const numberLotes = response.lote?.length;

  await genotipoController.update({ id: response.id, numberLotes });
}

export async function countTreatmentsNumber(id: any) {
  const assayListController = new AssayListController();
  const { response } = await assayListController.getOne(id);
  const treatmentsNumber = response.genotype_treatment?.length;

  await assayListController.update({ id, treatmentsNumber });
}
