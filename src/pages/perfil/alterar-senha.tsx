import Head from "next/head";
import router from "next/router";
import { FormEvent, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { Button, Input } from "src/components";
import { Content } from "../../components/Content";
import stylesCommon from '../../shared/styles/common.module.css';

interface ChangePasswordProps {
  password: string;
}

export default function AlterarDadosPessoais() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleChangePassword(event: FormEvent) {
    event.preventDefault();

    // TODO
  }

  return (
    <>
      <Head>
        <title>Alterar senha</title>
      </Head>
      <Content
        contentHeader={[]}
      >
        <div className={stylesCommon.container}>
          <form onSubmit={handleChangePassword}>
            <h1 className={stylesCommon.titlePage}>Alterar senha</h1>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-72">
                <label
                  htmlFor="currentPassword"
                  className={stylesCommon.labelForm}
                >
                  Senha atual
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  placeholder="*********"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="w-72">
                <label 
                  htmlFor="newPassword"
                  className={stylesCommon.labelForm}
                >
                  Nova senha
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  placeholder="*********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="w-72">
                <label 
                  htmlFor="confirmPassword"
                  className={stylesCommon.labelForm}
                >
                  Confirmar nova senha
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="*********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className={stylesCommon.containerButtonSubmit}>
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
                  icon={<RiLockPasswordLine size={20} />}
                  onClick={() => {}}
                />
              </div>
            </div>
          </form>
        </div>
      </Content>
    </>
  );
}
