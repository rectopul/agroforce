import Head from "next/head";
import { Table } from "src/components/Table";
import { Content } from "../components/Content";
export default function Listagem() {
  const filters = [
    'Teste1',
    'Teste2',
    'Teste3',
    'Teste4',
  ];

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Content>
        <main className="h-full
          flex flex-col
          items-start
          gap-8
        ">
         {/* <Table data={users} /> */}

        </main>
      </Content>
    </>
  );
}
