import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";

const data: string[] = [
  'nameLocal',
  "nameSafra",
  "nameFoco",
  "nameTipoEnsaio",
  "nameOgm",
  "nameEpoca",
  "npe",
  "prox_npe",
];

export default function ImportacaoPlanilha() {
  return (
    <>
      <Head><title>Importação de planilha</title></Head>

        <ImportPlanilha
          data={data}
          moduleId={1}
        />
    </>
  );
}
