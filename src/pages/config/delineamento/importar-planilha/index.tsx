import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";

interface IImportPlanilhaProps {
  title: string;
  dataTable: any[];
}

const data: IImportPlanilhaProps[] = [
  {
    title: 'A', 
    dataTable: [
      {
        id: 1, 
        name: 'Batata',
      },
      {
        id: 2,
        name: 'Coxinha',
      },
      {
        id: 3,
        name: 'Ovo frito',
      },
      {
        id: 4,
        name: 'Presunto',
      },
    ] 
  },
  {
    title: 'B',
    dataTable: [
      {
        id: 1,
        name: 'Maçã',
      },
      {
        id: 2,
        name: 'Banana',
      },
      {
        id: 3,
        name: 'Melancia',
      },
      {
        id: 4,
        name: 'Uva',
      },
    ]
  },
  {
    title: 'C',
    dataTable: [
      {
        id: 1, 
        name: 'Cachorro',
      },
      {
        id: 2,
        name: 'Gato',
      },
      {
        id: 3,
        name: 'Porco',
      },
      {
        id: 4,
        name: 'Zebra',
      },
    ]
  },
  {
    title: 'D',
    dataTable: [
      {
        id: 1, 
        name: 'Terra',
      },
      {
        id: 2,
        name: 'Jupiter',
      },
      {
        id: 3,
        name: 'Marte',
      },
      {
        id: 4,
        name: 'Saturno',
      },
    ]
  },
  {
    title: 'E',
    dataTable: [
      {
        id: 1, 
        name: 'Violino',
      },
      {
        id: 2,
        name: 'Saxofone',
      },
      {
        id: 3,
        name: 'Trompete',
      },
      {
        id: 4,
        name: 'Tuba',
      },
    ]
  },
  {
    title: 'F',
    dataTable: [
      {
        id: 1, 
        name: 'Celular',
      },
      {
        id: 2,
        name: 'Desktop',
      },
      {
        id: 3,
        name: 'Laptop',
      },
      {
        id: 4,
        name: 'Tablet',
      },
    ]
  },
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
