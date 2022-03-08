import { ReactNode, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { BsCheckLg, BsEye } from "react-icons/bs";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { useFormik } from "formik";

import { 
  Button, 
  Content, 
  Select, 
  TabHeader,
  TablePagination 
} from "../../components";
import { get } from "react-hook-form";
import { userService } from "src/services";

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

interface IFilter{
  status: number | undefined;
}

export default function Listagem({ allUsers }: Idata) {
  const [users, setUsers] = useState<IUsers[]>(() => allUsers);

  const formik = useFormik<IFilter>({
    initialValues: {
      status: 2,
    },
    onSubmit: (values) => {
      let parametersFilter = "status=" + values.status
      userService.getAll(parametersFilter).then((response) => {
        if (response.status == 200) {
          setUsers(response.response);
        }
      })
    },
  });

  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
  ];

  const filters = [
    { id: 2, name: 'Todos'},
    { id: 1, name: 'Ativos'},
    { id: 0, name: 'Inativos'},
  ];

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
              <form 
                  className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2 flex"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="h-10 w-44 ml-4">
                    <Select name="status" onChange={formik.handleChange} values={filters.map(id => id)} selected={false} />
                  </div>

                    <div>
                      <Button
                        onClick={() => {}}
                        value="Filtrar"
                        bgColor="bg-blue-600"
                        textColor="white"
                        icon={<BiFilterAlt size={20} />}
                      />
                    </div>
              </form>
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
  let allUsers = await user.json();
  allUsers = allUsers.response;

  return {
    props: {
      allUsers,
    },
  }
}
