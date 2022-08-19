import { LayoutQuadraController } from '../../controllers/block-layout/layout-quadra.controller';

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
