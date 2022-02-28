import Head from "next/head";
import { Button } from "../components/Button";
import { Content } from "../components/Content";

export default function NovoUsuario() {
  return (
   <>
      <Head>
        <title>Novo usuário</title>
      </Head>
      <Content>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="shadow 
                appearance-none 
                border
                border-blue-600
                rounded 
                w-full 
                py-2 px-3 
                text-gray-900
                leading-tight 
                focus:outline-none 
                focus:shadow-outline" 
              id="username" 
              type="text" 
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow
                appearance-none border 
                border-blue-600
                rounded w-full 
                py-2 px-3
                text-gray-700
                mb-3 
                leading-tight 
                focus:outline-none 
                focus:shadow-outline"
              id="password"
              type="password" 
              placeholder="******************"
            />
          </div>
          <div className="h-10 w-36 flex items-center justify-between">
            <Button 
              value="Cadastrar"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
        </form>
      </Content>
    </>
  );
}
