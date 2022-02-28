import Head from "next/head";
import { Content } from "../components/Content";
import { Input } from "src/components/Input"; 
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { BsCheckLg } from 'react-icons/bs';
import { TabHeader } from "src/components/MainHeader/TabHeader";

export default function NovoUsuario() {
  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, active: (() => true)  },
    { title: 'ENSAIO', value: <BsCheckLg />, active: (() => false)  },
    { title: 'LOCAL', value: <BsCheckLg />, active: (() => false)  },
    { title: 'DELINEAMENTO', value: <BsCheckLg />, active: (() => false)  },
    { title: 'NPE', value: <BsCheckLg />, active: (() => false)  },
    { title: 'QUADRAS', value: <BsCheckLg />, active: (() => false)  },
    { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, active: (() => false)  },
  ];

  return (
   <>
      <Head>
        <title>Novo usuário</title>
      </Head>


      <Content headerCotent={
        tabs.map((tab) => (
          <TabHeader
            key={tab.title}
            title={tab.title}
            value={tab.value}
            active={tab.active}
            onClick={() => {}}
          />
        ))
      }>
        
        <div className="
          w-full
          h-20
          flex
          items-center
          gap-2
          rounded-lg
          bg-white
          px-5
        ">
          <div className="h-10 w-32">
            <Button 
              value="Usuário"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
          <div className="h-10 w-32">
            <Button 
              value="Safra"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
          <div className="h-10 w-32">
            <Button 
              value="Portfólio"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
        </div>

        <form className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-10">
          <div className="w-full
            flex 
            justify-around
            gap-2
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código usuário
              </label>
              <Input value={123456} disabled />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Nome usuário
              </label>
              <Input type="text" placeholder="Nome" />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login único
              </label>
              <Input type="text" placeholder="Login de usuário" />
            </div>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-2
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                CPF
              </label>
              <Input type="text" placeholder="ex: 111.111.111-11" />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Matricula
              </label>
              <Input type="text" placeholder="Matricula do usuário" />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Selecione o Setor
              </label>
              <Select
                values={[""]}
              />
            </div>
          </div>

          <div className="w-8/12
            flex
            justify-between
            gap-2
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                E-mail
              </label>
              <Input type="text" placeholder="usuario@tmg.com.br" />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Telefone
              </label>
              <Input type="tel" placeholder="(11) 99999-9999" />
            </div>
          </div>
          <div className="w-8/12
            flex
            justify-between
            gap-2
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Senha
              </label>
              <Input type="password" placeholder="*************" />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Confirmar senha
              </label>
              <Input type="password" placeholder="*************" />
            </div>
          </div>
          <div className="w-8/12
            flex
            justify-between
            gap-2
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Libera jivochat
              </label>
              <Select
                values={["Sim", "Não"]}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login do App
              </label>
              <Input type="text" placeholder="Login APP usuário" />
            </div>
          </div>

          <div className="w-4/12
            flex
            justify-between
            gap-2
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Selecione um ou mais perfis
              </label>
              <Select
                values={["Administrator", "Funcionário", "Usuário comum"]}
              /> 
            </div>
          </div>
          
          <div className="h-10 w-full
            flex
            justify-center
            mt-20
          ">
            <div className="w-40">
              <Button 
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
