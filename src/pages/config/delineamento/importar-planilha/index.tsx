import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";

interface IImportPlanilhaProps {
  title: string;
  dataTable: any[];
}

const data: IImportPlanilhaProps[] = [
  { title: 'A', dataTable: [{ id: 1, name: 'Teste 1' }] },
  { title: 'B', dataTable: [{ id: 1, name: 'Teste 2' }] },
  { title: 'C', dataTable: [{ id: 1, name: 'Teste 3' }] },
  { title: 'D', dataTable: [{ id: 1, name: 'Teste 4' }] },
  { title: 'E', dataTable: [{ id: 1, name: 'Teste 5' }] },
  { title: 'F', dataTable: [{ id: 1, name: 'Teste 6' }] },
];

export default function ImportacaoPlanilha() {
  return (
    <>
      <Head><title>Importação de planilha</title></Head>

      <ImportPlanilha
        data={data}
      />
    </>
  );
}
