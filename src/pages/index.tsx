import Head from "next/head";
import { Content } from "../components/Content";
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';

export default function Listagem() {
  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const router = useRouter();

  setCookie(null, 'token',  userLogado.token, {
    maxAge: 86400 * 7,
    path: '/',
  });

  setCookie(null, 'userId',  userLogado.id, {
    maxAge: 86400 * 7,
    path: '/',
  });

  if (userLogado.token) {
    router.push('/config/tmg/usuarios/')
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Content contentHeader={[]}>
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
