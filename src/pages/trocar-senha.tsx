import Head from "next/head";
import router from "next/router";
import { FormEvent, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoMdArrowBack } from "react-icons/io";
import { Button, Input } from "src/components";
import Swal from "sweetalert2";
import { forgotPasswordService } from '../services';

export default function TrocarSenha() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userConfirmEmail, setUserConfirmEmail] = useState<string>('');

  async function handleSendEmail(event: FormEvent) {
    event.preventDefault();

    if (userEmail !== userConfirmEmail) {
      Swal.fire({
        title: "Credenciais  inválidas!",
        text: "Usuário não encontrado! mais dúvidas procure o suporte.",
      });

      return;
    }

    await forgotPasswordService.sendEmail({ userEmail: userEmail });
  };
  
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
              onSubmit={handleSendEmail}
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
                    required
                    placeholder="E-mail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                <div className='h-10'>
                  <span className="block text-sm font-medium text-blue-600">Confirmar e-mail</span>
                  <Input
                    type="email"
                    required
                    placeholder="Confirmar e-mail"
                    value={userConfirmEmail}
                    onChange={(e) => setUserConfirmEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="
                h-10 w-full
                flex
                gap-3
                justify-center
              ">
                <div className="w-30">
                  <Button 
                    type="button"
                    value="Voltar"
                    bgColor="bg-red-600"
                    textColor="white"
                    icon={<IoMdArrowBack size={18} />}
                    onClick={() => router.back()}
                  />
                </div>
                <div className="w-40">
                  <Button 
                    type="submit"
                    value="Confirmar"
                    bgColor="bg-blue-600"
                    textColor="white"
                    icon={<GiConfirmed size={18} />}
                    onClick={() => {}}
                  />
                </div>
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
