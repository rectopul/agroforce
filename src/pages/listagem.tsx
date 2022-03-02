import Head from "next/head";
import { BiFilterAlt } from "react-icons/bi";

import { useGetUsers } from "src/hooks/useGetUsers";

import { Content, TabHeader } from "../components";
import { Select } from "../components";
import { Button } from "../components";
import { TablePagination } from "src/components";

export default function Listagem() {
  const { items: users } = useGetUsers();

  const filters = [
    'Teste1',
    'Teste2',
    'Teste3',
    'Teste4',
  ];

  return (
    <>
      <Head>
        <title>Listagem de usuários</title>
      </Head>
      <Content
        headerCotent={
          <TabHeader
            title="Teste" 
            value="1"
            active={true}
          />
        }
      >
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
              value="Filtrar"
              onClick={() => {}}
              bgColor="bg-blue-600"
              textColor="white"
              icon={<BiFilterAlt size={20} />}
            />
            </div>
          </div>
          

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <TablePagination data={users}  />
          </div>
        </main>
      </Content>
    </>
  );
}
