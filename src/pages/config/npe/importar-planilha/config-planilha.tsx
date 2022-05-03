import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";

const data: object = [
            { id: 'Local', name: '*Local'}, 
            { id: 'Foco', name: 'Foco'}, 
            { id: 'OGM', name: 'OGM'}, 
            { id: 'Ensaio', name: 'Ensaio'}, 
            { id: 'NPEI', name: 'NPEI'}, 
            { id: 'Epoca', name: 'Epoca'}, 
            {id: 'Safra', name: 'Safra' }
          ];

export default function ImportacaoPlanilha() {
  return (
    <>
      <Head><title>Importação de planilha NPE</title></Head>

        <ImportPlanilha
          data={data}
          moduleId={14}
        />
    </>
  );
}
