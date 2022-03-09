import Head from "next/head";
import { Content } from "../components/Content";
import { setCookie } from 'nookies';

export default function Listagem() {
  const userLogado = JSON.parse(localStorage.getItem('user') as string);

  setCookie(null, 'token',  userLogado.token, {
    maxAge: 86400 * 7,
    path: '/',
  });
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
