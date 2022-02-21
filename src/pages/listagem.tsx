import Head from "next/head";
import { FiUserPlus } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiFilterAlt, BiSearchAlt } from "react-icons/bi";

import { Content } from "../components/Content";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { Input } from "../components/Input";

// teste de listagem
import { people } from "../modules/users";
import { CartFooterPageButton } from "../components/CartFooterPageButton";

export default function Listagem() {
  const filters = [
    'Teste1',
    'Teste2',
    'Teste3',
    'Teste4',
  ];

  return (
    <>
      <Head>
        <title>Listagem</title>
      </Head>
      <Content>
        <main className="h-full
          flex flex-col
          items-start
          gap-8
        ">
          <div className="w-full
            flex
            flex-col
            justify-between
            items-center
            gap-10
            p-4
            rounded-lg
            bg-gray-50
          ">
          <div className="flex w-full gap-12">
            <div className="w-full h-10">
              <span>Inativo:</span>
              <Select values={filters} />
            </div>
            <div className="w-full h-10">
              <span>GRV a quem responde:</span>
              <Select values={filters} />
            </div>
            <div className="w-full h-10">
              <span>RDT a quem responde:</span>
              <Select values={filters} />
            </div>
          </div>

            <div className="h-10">
            <Button
              title="Filtrar"
              onClick={() => {}}
              bgColor="bg-blue-600"
              textColor="white"
              icon={<BiFilterAlt size={20} />}
            />
            </div>
          </div>
          <div className="w-full
            flex
            justify-between
            p-4
            rounded-lg
            bg-gray-50
          ">

            <div className="
              w-full
              flex
              gap-4
            ">
              <div>
                <Button 
                  title="Cadastrar um usuário"
                  bgColor="bg-blue-600"
                  textColor="white"
                  onClick={() => {}}
                  href="novo-usuario"
                  icon={<FiUserPlus />}
                />
              </div>

              <div className="flex 
                items-center 
                p-2
                px-4
                rounded-lg
                bg-blue-600
              ">
                <span className="text-white" >1</span>
              </div>

              <div className="w-2/4">
                <Input
                  type="search"
                  placeholder="Pesquisar..."
                  icon={<BiSearchAlt size={18} />}
                />
              </div>
            </div>

            <div className="
              w-full
              flex
              justify-between
              items-center
              gb-gray-50
            ">
              
              <span className="flex items-center gap-1">
                Total:
                <strong className="text-blue-600">
                  6 registro(s)
                  </strong>
              </span>

              <div className="h-full flex gap-2">
                <Button
                  icon={<FaRegEye size={20} />}
                  onClick={() => {}}
                  bgColor="bg-blue-600"
                  textColor="white"
                />

                <Button
                  icon={<HiOutlineClipboardList size={20} />}
                  onClick={() => {}}
                  textColor="white"
                  bgColor="bg-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-full
            overflow-y-scroll
            rounded-lg 
          ">
            <Table
              data={people}
            />

            <CartFooterPageButton  />
          </div>
        </main>
      </Content>
    </>
  );
}
