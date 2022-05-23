import Head from "next/head";
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { Content } from "../components/Content";

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

  setCookie(null, 'cultureId',  userLogado.userCulture.cultura_selecionada, {
    maxAge: 86400 * 7,
    path: '/',
  });

  setCookie(null, 'safraId',  userLogado.safras.safra_selecionada, {
    maxAge: 86400 * 7,
    path: '/',
  });

  if (userLogado.token) {
    router.push('/dashboard')
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
