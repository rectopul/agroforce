import { ReactNode, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { BsCheckLg } from "react-icons/bs";
import { BiFilterAlt } from "react-icons/bi";
import { useFormik } from "formik";
import getConfig from 'next/config';

import { 
  Button, 
  Content, 
  Select, 
  Input,
  TabHeader,
  TablePagination 
} from "../../../../components";
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
  totalItems: Number;
  filter: string | any;
}

interface IFilter{
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export default function Listagem({ allUsers, totalItems, filter }: Idata) {
  const [users, setUsers] = useState<IUsers[]>(() => allUsers);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [filterEndpoint, setFilter] = useState<string | any>(filter);
  console.log(filterEndpoint)
  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: (values) => {
      let parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch;
      userService.getAll(parametersFilter + "&skip=0&take=5").then((response) => {
        if (response.status == 200) {
          setTotaItems(response.total)
          setFilter(parametersFilter)
          setUsers(response.response)
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

  const orderColumns = [
    { id: 'name', name: 'Nome'},
    { id: 'email', name: 'Email'},
  ];

  const typeOrder= [
    { id: 'asc', name: 'Crescente'},
    { id: 'desc', name: 'Decrescente'},
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

            <div className='flex gap-2 w-full'>
              <form 
                className="flex flex-col
                  w-full
                  items-center
                  py-4
                  pb-4
                  shadow-md
                  rounded 
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div className="w-full h-full
                  flex
                  justify-center
                  pb-2
                ">
                  <div className="h-10 w-64 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Status
                    </label>
                    <Select name="filterStatus" onChange={formik.handleChange} values={filters.map(id => id)} selected={false} />
                  </div>
                  <div className="h-10 w-64 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Order
                    </label>
                    <Select name="orderBy" onChange={formik.handleChange} values={orderColumns.map(id => id)} selected={false} />
                  </div>
                  <div className="h-10 w-64 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Tipo Order
                    </label>
                    <Select name="typeOrder" onChange={formik.handleChange} values={typeOrder.map(id => id)} selected={false} />
                  </div>
                  <div className="h-10 w-64 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Pesquisar
                    </label>
                    <Input 
                      type="text" 
                      placeholder="name ou email"
                      max="40"
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="h-16 w-32 ml-5 mt-3">
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

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <TablePagination data={users} totalItems={itemsTotal} filterAplication={filterEndpoint} />
          </div>
        </main>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const  token  =  req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
  let param = "skip=0&take=5&filterStatus=1";
  let filter = "filterStatus=1";
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const user = await fetch(urlParameters.toString(), requestOptions);
  let Response = await user.json();

  let allUsers = Response.response;
  let totalItems = Response.total;

  return {
    props: {
      allUsers,
      totalItems,
      filter
    },
  }
}
