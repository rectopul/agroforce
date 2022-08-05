import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { userPreferencesService, userService } from 'src/services';
import { handleFormatTel } from 'src/shared/utils/tel';
import * as XLSX from 'xlsx';
import { removeCookies, setCookies } from 'cookies-next';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  login: string,
  tel: string,
  avatar: string,
  status: boolean,
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
  pageBeforeEdit: string | any
  filterBeforeEdit: string | any;
}

export default function Listagem({
  allUsers, itensPerPage, filterApplication, totalItems, pageBeforeEdit, filterBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('config');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG' && tab.data.map((i) => i.labelDropDown === 'Usuários')
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.usuario || { id: 0, table_preferences: 'id,avatar,name,tel,login,status' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const router = useRouter();
  const [users, setUsers] = useState<IUsers[]>(() => allUsers);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]', title: 'Favorito', value: 'id', defaultChecked: () => camposGerenciados.includes('id'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Avatar', value: 'avatar', defaultChecked: () => camposGerenciados.includes('avatar'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Nome', value: 'name', defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Login', value: 'login', defaultChecked: () => camposGerenciados.includes('login'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Telefone', value: 'tel', defaultChecked: () => camposGerenciados.includes('tel'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Status', value: 'status', defaultChecked: () => camposGerenciados.includes('status'),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const columns = colums(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterName: '',
      filterLogin: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({ filterStatus, filterName, filterLogin }) => {
      const parametersFilter = `filterStatus=${filterStatus || 1}&filterName=${filterName}&filterLogin=${filterLogin}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await userService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setUsers(response.response);
        setTotalItems(response.total);
        setCurrentPage(0);
      });
    },
  });

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatus = filterBeforeEdit.split('');

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button className="font-medium text-gray-900" onClick={() => handleOrder(title, orderList)}>
            {name}
          </button>
        </div>
      ),
      field: title,
      sorting: false,
    };
  }

  function idHeaderFactory() {
    return {
      title: (
        <div className="flex items-center">
          {arrowOrder}
        </div>
      ),
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (
        colorStar === '#eba417'
          ? (
            <div className="h-10 flex">
              <div>
                <button
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('')}
                >
                  <AiTwotoneStar size={25} color="#eba417" />
                </button>
              </div>
            </div>
          )
          : (
            <div className="h-10 flex">
              <div>
                <button
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('#eba417')}
                >
                  <AiTwotoneStar size={25} />
                </button>
              </div>
            </div>
          )
      ),
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Status',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: IUsers) => (
        rowData.status ? (
          <div className="h-10 flex">
            <div className="
							h-10
						"
            />
            <div className="
							h-10
						"
            >
              <Button
                icon={<BiEdit size={16} />}
                title={`Atualizar ${rowData.name}`}
                onClick={() => {
                  setCookies('pageBeforeEdit', currentPage?.toString());
                  setCookies('filterBeforeEdit', filtersParams);
                  router.push(`/config/tmg/usuarios/atualizar?id=${rowData.id}`);
                }}
                bgColor="bg-blue-600"
                textColor="white"
              />
            </div>
            <div>
              <Button
                icon={<FaRegThumbsUp size={16} />}
                title="Ativo"
                onClick={() => handleStatus(rowData.id, !rowData.status)}
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
          </div>
        ) : (
          <div className="h-10 flex">
            <div className="
							h-10
						"
            />
            <div className="
							h-10
						"
            >
              <Button
                icon={<BiEdit size={16} />}
                title={`Atualizar ${rowData.name}`}
                onClick={() => {
                  setCookies('pageBeforeEdit', currentPage?.toString());
                  setCookies('filterBeforeEdit', filtersParams);
                  router.push(`/config/tmg/usuarios/atualizar?id=${rowData.id}`);
                }}
                bgColor="bg-blue-600"
                textColor="white"
              />
            </div>
            <div>
              <Button
                icon={<FaRegThumbsDown size={16} />}
                title="Inativo"
                onClick={() => handleStatus(rowData.id, !rowData.status)}
                bgColor="bg-red-800"
                textColor="white"
              />
            </div>
          </div>
        )
      ),
    };
  }

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item) => {
      if (columnCampos[item] === 'id') {
        tableFields.push(idHeaderFactory());
      }

      if (columnCampos[item] === 'avatar') {
        tableFields.push({
          title: 'Avatar',
          field: 'avatar',
          sorting: false,
          width: 0,
          exports: false,
          render: (rowData: IUsers) => (
            !rowData.avatar || rowData.avatar === '' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="https://media-exp1.licdn.com/dms/image/C4E0BAQGtzqdAyfyQxw/company-logo_200_200/0/1609955662718?e=2147483647&v=beta&t=sfA6x4MWOhWda5si7bHHFbOuhpz4ZCTdeCPtgyWlAag"
                alt={rowData.name}
                style={{ width: 45, height: 43, borderRadius: 99999 }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={rowData.avatar} alt={rowData.name} style={{ width: 45, height: 43, borderRadius: 99999 }} />
            )
          ),
        });
      }
      if (columnCampos[item] === 'name') {
        tableFields.push(headerTableFactory('Nome', 'name'));
      }

      if (columnCampos[item] === 'login') {
        tableFields.push(headerTableFactory('Login', 'login'));
      }
      if (columnCampos[item] === 'tel') {
        tableFields.push({
          title: 'Telefone',
          field: 'tel',
          sorting: false,
          render: (rowData: IUsers) => (
            handleFormatTel(rowData.tel)
          ),
        });
      }
      if (columnCampos[item] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  async function handleOrder(column: string, order: string | any): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }
    if (filter && typeof (filter) !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    } else {
      parametersFilter = filter;
    }
    await userService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setUsers(response.response);
      }
    });
    if (orderList === 2) {
      setOrder(0);
      setArrowOrder(<AiOutlineArrowDown />);
    } else {
      setOrder(orderList + 1);
      if (orderList === 1) {
        setArrowOrder(<AiOutlineArrowUp />);
      } else {
        setArrowOrder('');
      }
    }
  }

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = '';
    for (let i = 0; i < els.length; i += 1) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 1 }).then((response) => {
        userLogado.preferences.usuario = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.usuario = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  }

  async function handleStatus(id: number, status: any): Promise<void> {
    if (status) {
      status = 1;
    } else {
      status = 0;
    }

    await userService.update({ id, status });
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return;
    }

    setUsers((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = status;
      return copy;
    });
  }

  function handleOnDragEnd(result: DropResult): void {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    if (!filterApplication.includes('paramSelect')) {
      // filterApplication += `&paramSelect=${camposGerenciados}`;
    }

    await userService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        /* const newData = users.map((row: { avatar: any; status: any }) => {
          delete row.avatar;
          if (row.status === 0) {
            row.status = 'Inativo';
          } else {
            row.status = 'Ativo';
          }
          return row;
        }); */

        const dataExcel: any = response.response;
        dataExcel.forEach((line: any) => {
          delete line.avatar;
          delete line.id;

          if (line.status === 0) {
            line.status = 'Inativo';
          } else {
            line.status = 'Ativo';
          }
        });

        const workSheet = XLSX.utils.json_to_sheet(dataExcel);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'usuarios');

        // Buffer
        const buf = XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx || csv
          type: 'buffer',
        });
        // Binary
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx || csv
          type: 'binary',
        });
        // Download xlsx || csv
        XLSX.writeFile(workBook, 'Usuários.xlsx');
      }
    });
  };

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }

  async function handlePagination(): Promise<void> {
    const skip = Number(currentPage) * Number(take);
    let parametersFilter = `skip=${skip}&take=${take}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await userService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setUsers(response.response);
      }
    });
  }

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-10 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-2">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de usuários</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        "
        >
          <AccordionFilter title="Filtrar usuários">
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
                <div className="w-full h-full
                  flex
                  justify-center
                  pb-2
                "
                >
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Status
                    </label>
                    <Select name="filterStatus" onChange={formik.handleChange} defaultValue={filterStatus[13]} values={filters.map((id) => id)} selected="1" />
                  </div>
                  {filterFieldFactory('filterName', 'Nome')}
                  {filterFieldFactory('filterLogin', 'login')}
                </div>

                <div className="h-16 w-32 mt-3">
                  <Button
                    type="submit"
                    onClick={() => formik.handleChange}
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
          <div className="w-full h-full overflow-y-scroll d-mt-1366-768">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={users}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb' },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
              }}
              components={{
                Toolbar: () => (
                  <div
                    className="w-max max-h-96
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
                    <div className="h-12">
                      <Button
                        title="Cadastrar usuário"
                        value="Cadastrar usuário"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { router.push('usuarios/cadastro'); }}
                        icon={<FiUserPlus size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2
                    "
                    >
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-64">
                          <AccordionFilter title="Gerenciar Campos" grid={statusAccordion}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {
                                  (provided) => (
                                    <ul className="w-full h-full characters" {...provided.droppableProps} ref={provided.innerRef}>
                                      <div className="h-8 mb-3">
                                        <Button
                                          value="Atualizar"
                                          bgColor="bg-blue-600"
                                          textColor="white"
                                          onClick={getValuesColumns}
                                          icon={<IoReloadSharp size={20} />}
                                        />
                                      </div>
                                      {
                                        generatesProps.map((generate, index) => (
                                          <Draggable key={index} draggableId={String(generate.title)} index={index}>
                                            {(provided) => (
                                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <CheckBox
                                                  name={generate.name}
                                                  title={generate.title?.toString()}
                                                  value={generate.value}
                                                  defaultChecked={camposGerenciados.includes(generate.value)}
                                                />
                                              </li>
                                            )}
                                          </Draggable>
                                        ))
                                      }
                                      {provided.placeholder}
                                    </ul>
                                  )
                                }
                              </Droppable>
                            </DragDropContext>
                          </AccordionFilter>
                        </div>
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button title="Exportar planilha de usuários" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
                      </div>
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
                      onClick={() => setCurrentPage(currentPage - 10)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage <= 1}
                    />
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiLeftArrow size={15} />}
                      disabled={currentPage <= 0}
                    />
                    {
                      Array(1).fill('').map((value, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))
                    }
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiRightArrow size={15} />}
                      disabled={currentPage + 1 >= pages}
                    />
                    <Button
                      onClick={() => setCurrentPage(currentPage + 10)}
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0]?.itens_per_page ?? 10;

  const { token } = req.cookies;
  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : 'filterStatus=1';
  const filterApplication = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : 'filterStatus=1';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

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
    },
  };
};
