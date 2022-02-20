import type { NextPage } from 'next';
import Head from 'next/head';
import { BiUser } from 'react-icons/bi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Button } from '../components/Button';
import { useForm } from 'react-hook-form'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Input } from '../components/Input';

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm();
  const { signIn } =  useContext(AuthContext)

  function handleSignIn(data: any) {
    signIn(data)
  }

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

            <form className='w-80
              flex
              flex-col
              justify-between
              gap-4 
              mt-24 
            ' onSubmit={handleSubmit(handleSignIn)}>
              <div className='
                h-40
                flex
                flex-col
                justify-start
                gap-10
              '>
                <div className='h-10'>
                  <span className="block text-sm font-medium text-blue-600">Usuário</span>
                    <input
                      {...register('email')}
                      placeholder='Usuário'
                      type="email"
                      name="email"
                      required
                      id="company-website"
                      className="h-full w-full
                      px-2
                      flex-1 
                      block
                      rounded-none
                      rounded-r-md 
                      sm:text-sm 
                      bg-gray-200
                      border-gray-300
                      focus:ring-indigo-500
                      focus:border-indigo-500
                    "/>
                  {/* <Input 
                    placeholder='Usuário'
                    type="email"
                    required
                    icon={<BiUser size={18} color="#1e40af" />}
                  /> */}
                </div>

                <div className='h-10'>
                  <span className="block text-sm font-medium text-blue-600">Senha</span>
                  <input
                     {...register('password')}
                      placeholder='Senha'
                      type="password"
                      name="password"
                      required
                      id="company-website"
                      className="h-full w-full
                      px-2
                      flex-1 
                      block
                      rounded-none
                      rounded-r-md 
                      sm:text-sm 
                      bg-gray-200
                      border-gray-300
                      focus:ring-indigo-500
                      focus:border-indigo-500
                    "/>
                  {/* <Input 
                    placeholder='Senha'
                    type="password"
                    required
                    icon={<RiLockPasswordLine size={18} color="#eba417" />}
                  /> */}
                </div>
              </div>

              <div className='h-10
                w-2/4
                flex
              '>
                <Button 
                  title='Conectar'
                  onClick={() => {}} 
                  bgColor="blue-600"
                  textColor="white"
                />
              </div>
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
