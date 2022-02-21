import Head from "next/head";
import { Button } from "../components/Button";
import { Content } from "../components/Content";

import { Input } from "../components/Input";
import { MainHeader } from "../components/MainHeader";


export default function NovoUsuario() {
  return (
   <>
      <Head>
        <title>Novo usuário</title>
      </Head>
      <Content>
        <form 
          className="h-full
          flex
          flex-col
          items-center
          gap-12
          rounded-lg
          bg-gray-50
          p-10
          border border-2 border-gray-300
          shadow-lg
        ">
          <h1 className="text-xl">Cadastro de usuário</h1>

          <div className=" w-3/4 flex justify-around">
            <div className="h-9 w-72">
              <label htmlFor="userName">Nome: </label>
              <Input />
            </div>
            <div className="h-9 w-72">
              <label htmlFor="userName">Nome: </label>
              <Input />
            </div>
            <div className="h-9 w-72">
              <label htmlFor="userName">Nome: </label>
              <Input />
            </div>
          </div>

          <div className="w-3/4 flex justify-around">
            <div className="h-9 w-72">
              <label htmlFor="userName">Nome: </label>
              <Input />
            </div>
            <div className="h-9 w-72">
              <label htmlFor="userName">Nome: </label>
              <Input />
            </div>
            <div className="h-9 w-72">
              <label htmlFor="userName">Nome: </label>
              <Input />
            </div>
          </div>
        </form>
      </Content>
   </>
  );
}
