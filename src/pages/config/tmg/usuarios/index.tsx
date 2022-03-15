import { ReactNode, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { BiFilterAlt } from "react-icons/bi";
import { useFormik } from "formik";
import getConfig from 'next/config';

import { userService } from "src/services";

import { 
  Button, 
  Content, 
  Select, 
  Input,
  TabHeader,
  TablePagination, 
  AccordionFilter
} from "../../../../components";

import { tabs, tmgDropDown } from '../../../../utils/dropdown';
import { UserPreferenceController } from "src/controllers/user-preference.controller";

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
  itensPerPage: number | any;
}

interface IFilter{
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export default function Listagem({ allUsers, totalItems, filter, itensPerPage}: Idata) {
  const [users, setUsers] = useState<IUsers[]>(() => allUsers);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [filterEndpoint, setFilter] = useState<string | any>(filter);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: (values) => {
      let parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch;
      userService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
        if (response.status == 200) {
          setTotaItems(response.total)
          setFilter(parametersFilter)
          setUsers(response.response)
        }
      })
    },
  });

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
          <TabHeader data={tabs} dataDropDowns={tmgDropDown}  />
        }
      >
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar usuários">
            <div className='w-full flex gap-2'>
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-4
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div className="w-full h-full
                  flex
                  justify-center
                  pb-2
                ">
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Status
                    </label>
                    <Select name="filterStatus" onChange={formik.handleChange} values={filters.map(id => id)} selected={'1'} />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
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

                <div className="h-16 w-32 mt-3">
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
          </AccordionFilter>

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <TablePagination data={users} totalItems={itemsTotal} filterAplication={filterEndpoint} itensPerPage={itensPerPage} />
          </div>
        </main>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais('')).response[0].itens_per_page;
  const  token  =  req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
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
      itensPerPage,
      filter
    },
  }
}
