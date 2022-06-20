import Head from "next/head";
import router from "next/router";
import { FormEvent, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoMdArrowBack } from "react-icons/io";
import { Button, Input } from "src/components";
import Swal from "sweetalert2";
import { forgotPasswordService } from '../services';

export default function TrocarSenha() {
  const [login, setLogin] = useState<string>('');
  const [confirmLogin, setConfirmLogin] = useState<string>('');

  async function handleSendLogin(event: FormEvent) {
    event.preventDefault();

    if (login !== confirmLogin) {
      Swal.fire({
        title: "Campos inválidos!",
        text: "Login não iguais.",
      });

      return;
    }

    await forgotPasswordService.sendlogin({
      login,
      confirmLogin,
    }).then(() => {
      Swal.fire({
        title: "Login de recuperação de senha enviado com sucesso!",
        text: `Verifique seu Login para concluir sua troca de senha.`,
      });
    }
    ).finally(() => {
      router.back();
    })
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
              <img src="/images/logo.png" alt="Nuseed" className='w-80 h-44 self-center' />
              <h1 className="text-xl">Alterar senha do usuário</h1>
              <small className="text-sm">Esqueci minha senha</small>
            </div>

            <form className='w-80
              flex
              flex-col
              justify-between
              gap-4 
              mt-10'
              onSubmit={handleSendLogin}
            >
              <div className='
                h-40
                flex
                flex-col
                justify-start
                gap-10
              '>
                <div className='h-10'>
                  <span className="block text-sm font-medium text-blue-600">Login</span>
                  <Input
                    type="login"
                    required
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                </div>

                <div className='h-10'>
                  <span className="block text-sm font-medium text-blue-600">Confirmar Login</span>
                  <Input
                    type="login"
                    required
                    placeholder="Confirmar Login"
                    value={confirmLogin}
                    onChange={(e) => setConfirmLogin(e.target.value)}
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
                    onClick={() => { }}
                  />
                </div>
              </div>
            </form>
          </div>
        </main>

        <aside className='flex-initial'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/agroforce.png" alt="Agroforce" className='w-screen h-screen' />
        </aside>
      </div>
    </>
  );
}
