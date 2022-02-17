import type { NextPage } from 'next';
import Head from 'next/head';
import { Button } from '../components/Button';

import { Input } from '../components/Input';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <div className='w-screen h-screen flex items-stretch'>
        <main className='flex bg-light'>
          <div className='flex flex-col gap-8 w-full items-center justify-center px-24
          '>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Nuseed" className='w-80 h-44 self-center'/>

            <form className='flex w-72 flex-col gap-4 mt-24'>
                <div>
                  <span className="block text-sm font-medium text-blue-600">Usuário</span>
                  <Input 
                    placeholder='Usuário'
                    type="email"
                    required
                  />

                  <span className="block text-sm font-medium text-blue-600">Senha</span>
                  <Input 
                    placeholder='Senha'
                    type="password"
                    required
                  />
                </div>

                <Button 
                  title='Conectar'
                  onClick={() => {}} 
                  bgColor="blue-600"
                  textColor="white"
                />
            </form>

            <a href="#" className='text-blue-600 mb-64
            '>
              Esqueci minha senha - I forgot my password - Olvide mi contraseña
            </a>
          </div>
        </main>

        <aside className='flex-initial'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/agroforce.png" alt="teste" className='w-screen h-screen' />
        </aside>
      </div>
    </>
  );
}

export default Home;
