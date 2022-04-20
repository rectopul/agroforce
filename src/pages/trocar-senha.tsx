import Head from "next/head";
import { Button, Input } from "src/components";

export default function TrocarSenha() {
  return (
    <>
      <Head>
        <title>Esqueci minha senha</title>
      </Head>

      <div className='w-screen h-screen flex items-stretch bg-gray-200'>
        <main className='flex bg-light'>
          <div className='flex flex-col gap-8 w-full px-24 py-12
          '>
            <div className="flex flex-col items-center justify-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="Nuseed" className='w-80 h-44 self-center'/>
              <h1 className="text-xl">Alterar senha do usuário</h1>
              <small className="text-sm">Esqueci minha senha</small>
            </div>

            <form className='w-80
              flex
              flex-col
              justify-between
              gap-4 
              mt-10'
              onSubmit={() => {}}
            >
              <div className='
                h-40
                flex
                flex-col
                justify-start
                gap-10
              '>
                <div className='h-10'>
                  <span className="block text-sm font-medium text-blue-600">E-mail</span>
                  <Input
                    type="email"
                    placeholder="E-mail"
                  />
                </div>

                <div className='h-10'>
                  <span className="block text-sm font-medium text-blue-600">Confirmar e-mail</span>
                  <Input
                    type="email"
                    placeholder="E-mail"
                  />
                </div>
              </div>

              <div className='h-10
                w-2/4
                flex
              '>
                <Button 
                  type='submit'
                  value='Confirmar'
                  onClick={() => {}} 
                  disabled={false}
                  bgColor="bg-blue-600"
                  textColor="white"
                />
              </div>
            </form>
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
