import Head from "next/head";
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { AiOutlineContainer } from "react-icons/ai";
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

  // if (userLogado.token) {
  //   router.push('/dashboard')
  // }

  return (
    <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Content contentHeader={[]}>
                    <div className="flex bg-blue-480 text-white p-3 rounded-md items-center">
                        <AiOutlineContainer className="mr-2"/>
                            Dashboard
                    </div> 
                    <div className="flex items-end m-auto">
                        <img src="/images/logo.png" alt="GOM" className='w-48 h-40'/>
                    </div>
            </Content>
        </>
    )
}
