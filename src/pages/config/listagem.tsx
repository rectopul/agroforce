import { ReactNode, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { BsCheckLg, BsEye } from "react-icons/bs";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineClipboardList } from "react-icons/hi";

import { 
  Button, 
  Content, 
  Select, 
  TabHeader,
  TablePagination 
} from "../../components";

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string | ReactNode,
  status: boolean,
}

interface Idata {
  allUsers: IUsers[];
}

export default function Listagem({ allUsers }: Idata) {
  const [users, setUsers] = useState<IUsers[]>(() => allUsers);
  const [ filter, setFilter ] = useState<number>(3)

  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
  ];

  const filters = [
    { id: 1, name: 'Todos'},
    { id: 2, name: 'Ativos'},
    { id: 3, name: 'Inativos'},
  ];

  const handleFilterUserbyStatus = (id: number) => {
    // const allUsers = values.map((user) => user.name === 'Todos');
    const selected = filters.find((select) => select.id === id);

    const filterUsers = users.filter((user) => {
      if (selected?.id === 3) {
        return !user.status;
      } else if (selected?.id === 2) {
        return user.status
      } else {
        return user;
      }
    });

    setUsers(filterUsers)
  }

  return (
    <>
      <Head>
        <title>Listagem de usuários</title>
      </Head>
      <Content
        headerCotent={
          <TabHeader data={tabs} />
        }
      >
        <main className="h-full
          flex flex-col
          items-start
          gap-8
        ">

          <div className="w-full bg-white p-7 rounded-lg">
            <div className='flex gap-2'>
              <div>
                <Button
                  onClick={() => {}}
                  bgColor="bg-blue-600"
                  textColor="white"
                  icon={<BsEye size={20} />}
                  // BsEyeSlash
                />
              </div>

              <div>
                <Button
                  onClick={() => {}}
                  bgColor="bg-blue-600"
                  textColor="white"
                  icon={<HiOutlineClipboardList size={20} />}
              />
              </div>
              <div className="h-10 w-44 ml-4">
                <Select values={filters.map(id => id)} selected={false} />
              </div>

              <div>
                <Button
                  value="Filtrar"
                  onClick={() => handleFilterUserbyStatus(filter)}
                  bgColor="bg-blue-600"
                  textColor="white"
                  icon={<BiFilterAlt size={20} />}
                />
              </div>
            </div>
          </div>

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <TablePagination data={users} />
          </div>
        </main>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTY0NjY1MTAyMiwiZXhwIjoxNjQ3MjU1ODIyfQ.3QX-_a5O2sZK5VVjdZ1jwLLuY7wemFKTEU9OYaXMzIc` }
  } as RequestInit | undefined;

  const user = await fetch('http://localhost:3000/api/user', requestOptions);

  const allUsers = await user.json();

  return {
    props: {
      allUsers,
    },
  }
}
