import {useFormik} from 'formik';
import MaterialTable from 'material-table';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {SetStateAction, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult,} from 'react-beautiful-dnd';
import {BiLeftArrow, BiRightArrow,} from 'react-icons/bi';

import {FaCheck} from 'react-icons/fa';
import {FiUserPlus} from 'react-icons/fi';
import {IoReloadSharp} from 'react-icons/io5';
import {MdFirstPage, MdLastPage} from 'react-icons/md';
import {RiFileExcel2Line} from 'react-icons/ri';
import {RequestInit} from 'next/dist/server/web/spec-extension/request';
import {removeCookies, setCookies} from 'cookies-next';
import {tableGlobalFunctions} from 'src/helpers';
import {semaforoService} from '../../../../services';
import {AccordionFilter, Button, CheckBox, Content, Input, Semaforo1 } from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import {UserPreferenceController} from '../../../../controllers/user-preference.controller';

interface IUsers {
  id: number;
  name: string;
  cpf: string;
  login: string;
  tel: string;
  avatar: string;
  status: boolean;
}

interface IFilter {
  filterStatus: object | any;
  filterName: string | any;
  filterLogin: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allUsers: IUsers[];
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string, // RR
  orderByserver: any | string // RR
}

export default function Listagem({
                                   allUsers,
                                   itensPerPage,
                                   filterApplication,
                                   totalItems,
                                   pageBeforeEdit,
                                   filterBeforeEdit,
                                   typeOrderServer, // RR
                                   orderByserver, // RR
                                 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {TabsDropDowns} = ITabs.default;

  const tabsDropDowns = TabsDropDowns('config');

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG'
  && tab.data.map((i) => i.labelDropDown === 'Semaforos')
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  let table_preferences = 'id,created_at,last_edit_at,created_by,sessao,acao,tipo,status,automatico,acoes'
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    table_preferences
  );
  const [users, setUsers] = useState(() => allUsers);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]',
      title: 'Data Início',
      value: 'created_at',
      defaultChecked: () => camposGerenciados.includes('avatar'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Data Atualizado',
      value: 'last_edit_at',
      defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Sessão',
      value: 'sessao',
      defaultChecked: () => camposGerenciados.includes('login'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ação',
      value: 'acao',
      defaultChecked: () => camposGerenciados.includes('tel'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Tipo',
      value: 'tipo',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const filters = [
    {id: 2, name: 'Todos'},
    {id: 1, name: 'Ativos'},
    {id: 0, name: 'Inativos'},
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');
  const columns = colums(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterName: checkValue('filterName'),
      filterLogin: checkValue('filterLogin'),
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({filterStatus, filterName, filterLogin}) => {
      // Call filter with there parameter
      // const parametersFilter = await tableGlobalFunctions.handleFilterParameter('usuarios', filterStatus || 1, filterName, filterLogin);

      // setFiltersParams(parametersFilter);
      // setCookiess('filterBeforeEdit', filtersParams);

      // await semaforoService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setUsers(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });

      const parametersFilter = `filterStatus=${filterStatus || 1}&filterName=${filterName}&filterLogin=${filterLogin}`;

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any) {
    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await semaforoService.getAll(parametersFilter).then((response: any) => {
      if (response.status === 200 || response.status === 400) {
        setUsers(response.response);
        setTotalItems(response.total); // Set new total records
      }
    });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button
            className="font-medium text-gray-900"
            onClick={() => handleOrder(title, orderList)}
          >
            {name}
          </button>
        </div>
      ),
      field: title,
      sorting: true,
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Ações',
      field: 'acoes',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: IUsers) => (
        <div className="h-7 flex">
          <div className="h-7">
            {
              // @ts-ignore
              rowData.status == 'andamento' && 
            <Button
              title="Inativo"
              icon={<FaCheck size={14} />}
              onClick={async () => {
                const index = users.findIndex((user: any) => user.id === rowData.id);

                setUsers((oldUser: any) => {
                  const copy = [...oldUser];
                  copy[index].status = 'finalizado';
                  return copy;
                });
                
                let ret = await semaforoService.finalizaAcao(rowData.id, global.sessao);
                
                if (ret.status == 400 && ret.message != '') {
                  setUsers((oldUser: any) => {
                    const copy = [...oldUser];
                    copy[index].status = 'andamento';
                    return copy;
                  });
                  
                  alert(ret.message);
                }
              }}
              bgColor="bg-red-800"
              textColor="white"
            />}
          </div>
        </div>
      ),
    };
  }

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item) => {
      if (columnCampos[item] === 'created_at') {
        tableFields.push(headerTableFactory('Data Início', 'created_at'));
      }
      if (columnCampos[item] === 'last_edit_at') {
        tableFields.push(headerTableFactory('Data Atualizado', 'last_edit_at'));
      }
      if (columnCampos[item] === 'created_by') {
        tableFields.push(headerTableFactory('Criado Por', 'created_by'));
      }
      if (columnCampos[item] === 'sessao') {
        tableFields.push(headerTableFactory('Sessão', 'sessao'));
      }
      if (columnCampos[item] === 'acao') {
        tableFields.push(headerTableFactory('Ação', 'acao'));
      }
      if (columnCampos[item] === 'tipo') {
        tableFields.push(headerTableFactory('Tipo', 'tipo'));
      }
      if (columnCampos[item] === 'status') {
        tableFields.push(headerTableFactory('Status', 'status'));
      }
      if (columnCampos[item] === 'automatico') {
        tableFields.push(headerTableFactory('Automatico', 'automatico'));
      }
      if (columnCampos[item] === 'acoes') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  async function handleOrder(
    column: string,
    order: string | any,
  ): Promise<void> {
    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
  }

  async function getValuesColumns(): Promise<void> {
    
  }

  function handleOnDragEnd(result: DropResult): void {
    
  }

  // manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(): Promise<void> {
    await callingApi(filter); // handle pagination globly
  }

  // Checking defualt values
  function checkValue(value: any) {
    return tableGlobalFunctions.getValuesForFilter(value, filtersParams);
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de semaforos</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          {/*<AccordionFilter title="Filtrar semaforos">
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-4
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-0
                "
                >
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatusBeforeEdit[13]}
                      // defaultValue={checkValue('filterStatus')}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div>

                  {filterFieldFactory('filterName', 'Nome')}
                  {filterFieldFactory('filterLogin', 'Login')}
                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      type="submit"
                      onClick={() => formik.handleChange}
                      value="Filtrar"
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiFilterAlt size={20} />}
                    />
                  </div>
                </div>
              </form>
            </div>
          </AccordionFilter>*/}

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-auto d-mt-1366-768">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={users}
              options={{
                sorting: true,
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
              }}
              components={{
                Toolbar: () => (
                  <div
                    className="w-full max-h-96
                    flex
                    items-center
                    justify-between
                    gap-4
                    bg-gray-50
                    py-2
                    px-5
                    border-solid border-b
                    border-gray-200
                  "
                  >
                    <div className="h-12" style={{
                      padding: 15
                    }}>
                      <Semaforo1 acao={'page-semaforo'} />
                      {/*<Button
                        title="Cadastrar semaforo"
                        value="Cadastrar semaforo"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {
                          router.push('usuarios/cadastro');
                        }}
                        icon={<FiUserPlus size={20} />}
                      />*/}
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div
                      className="h-full flex items-center gap-2
                    "
                    >
                      {/*<div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-64">
                          <AccordionFilter
                            title="Gerenciar Campos"
                            grid={statusAccordion}
                          >
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {(provided) => (
                                  <ul
                                    className="w-full h-full characters"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    <div className="h-8 mb-3">
                                      <Button
                                        value="Atualizar"
                                        bgColor="bg-blue-600"
                                        textColor="white"
                                        onClick={getValuesColumns}
                                        icon={<IoReloadSharp size={20} />}
                                      />
                                    </div>
                                    {generatesProps.map((generate, index) => (
                                      <Draggable
                                        key={index}
                                        draggableId={String(generate.title)}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <CheckBox
                                              name={generate.name}
                                              title={generate.title?.toString()}
                                              value={generate.value}
                                              defaultChecked={camposGerenciados.includes(
                                                generate.value,
                                              )}
                                            />
                                          </li>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </ul>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </AccordionFilter>
                        </div>
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de semaforos"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            //downloadExcel();
                          }}
                        />
                      </div>*/}
                    </div>
                  </div>
                ),
                Pagination: (props) => (
                  <div
                    className="flex
                      h-20
                      gap-2
                      pr-2
                      py-5
                      bg-gray-50
                    "
                    {...props}
                  >
                    <Button
                      onClick={() => setCurrentPage(0)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage < 1}
                    />
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiLeftArrow size={15} />}
                      disabled={currentPage <= 0}
                    />
                    {Array(1)
                      .fill('')
                      .map((value, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))}
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiRightArrow size={15} />}
                      disabled={currentPage + 1 >= pages}
                    />
                    <Button
                      onClick={() => setCurrentPage(pages - 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdLastPage size={18} />}
                      disabled={currentPage + 1 >= pages}
                    />
                  </div>
                  ) as any,
              }}
            />
          </div>
        </main>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 10;

  const { token } = req.cookies;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  // Last page
  const lastPageServer = req.cookies.lastPage
    ? req.cookies.lastPage
    : 'No';
  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('filtersParams', { req, res });
  }

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';
  const filterApplication = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'name';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });
  removeCookies('filtersParams', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const users = await fetch(urlParameters.toString(), requestOptions);
  const { response: allUsers, total: totalItems } = await users.json();

  return {
    props: {
      allUsers,
      totalItems,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
