import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from 'src/components';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { departmentService, userPreferencesService } from 'src/services';
import * as XLSX from 'xlsx';
import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

interface IDepartment {
  id: number;
  name: string;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allDepartments: IDepartment[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
}

export default function Listagem({
  allDepartments,
  totalItems,
  itensPerPage,
  filterApplication,
  pageBeforeEdit,
  filterBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.department || {
    id: 0,
    table_preferences: 'id,name,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [items, setItems] = useState<IDepartment[]>(() => allDepartments);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Nome', value: 'name' },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatus = filterBeforeEdit.split('');

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const columns = columnsOrder(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({ filterStatus, filterSearch }) => {
      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterSearch=${filterSearch}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await departmentService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response) => {
          setFilter(parametersFilter);
          setItems(response.response);
          setTotalItems(response.total);
          setCurrentPage(0);
        });
    },
  });

  async function handleStatusItem(
    idItem: number,
    data: IDepartment,
  ): Promise<void> {
    if (data.status === 1) {
      data.status = 0;
    } else {
      data.status = 1;
    }

    const index = items.findIndex((item) => item.id === idItem);

    if (index === -1) {
      return;
    }

    setItems((oldItem) => {
      const copy = [...oldItem];
      copy[index].status = data.status;
      return copy;
    });

    const { id, status, name } = items[index];

    await departmentService.update({ id, name, status });
  }

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
      sorting: false,
    };
  }

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (colorStar === '#eba417' ? (
        <div className="h-9 flex">
          <div>
            <button
              className="w-full h-full flex items-center justify-center border-0"
              onClick={() => setColorStar('')}
            >
              <AiTwotoneStar size={20} color="#eba417" />
            </button>
          </div>
        </div>
      ) : (
 
        <div className="h-9 flex">

          <div>
            <button
              className="w-full h-full flex items-center justify-center border-0"
              onClick={() => setColorStar('#eba417')}
            >
              <AiTwotoneStar size={20} />

            </button>
          </div>
        </div>
      )),
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Status',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: IDepartment) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filtersParams);
                router.push(`/config/tmg/setor/atualizar?id=${rowData.id}`);
              }}
            />
          </div>
          <div style={{ width: 5 }} />
          {rowData.status === 1 ? (
            <div className="h-7">
              <Button
                icon={<FaRegThumbsUp size={14} />}
                onClick={async () => await handleStatusItem(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
          ) : (
            <div className="h-7">
              <Button
                icon={<FaRegThumbsDown size={14} />}
                onClick={async () => await handleStatusItem(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                bgColor="bg-red-800"
                textColor="white"
              />
            </div>
          )}
        </div>
      ),
    };
  }

  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnCampos[index] === 'name') {
        tableFields.push(headerTableFactory('Nome', 'name'));
      }
      if (columnCampos[index] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  async function handleOrder(
    column: string,
    order: string | any,
  ): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }
    setOrderBy(column);
    setOrderType(typeOrder);
    if (filter && typeof filter !== 'undefined') {
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

    await departmentService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then((response) => {
        if (response.status === 200) {
          setItems(response.response);
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
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id: 11,
        })
        .then((response) => {
          userLogado.preferences.department = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.department = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
      };
      await userPreferencesService.update({
        table_preferences: campos,
        id: preferences.id,
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  }

  function handleOnDragEnd(result: DropResult) {
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
      filterApplication += `&paramSelect=${camposGerenciados}`;
    }

    await departmentService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = items.map((row) => {
          if (row.status === 0) {
            row.status = 'Inativo' as any;
          } else {
            row.status = 'Ativo' as any;
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'setores');

        // Buffer
        const buf = XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'buffer',
        });
        // Binary
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'binary',
        });
        // Download
        XLSX.writeFile(workBook, 'Setores.xlsx');
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
    let parametersFilter;
    if (orderType) {
      parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await departmentService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setItems(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de setores</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar setores">
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
                  "
                >
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatus[13]}
                      values={filtersStatusItem.map((id) => id)}
                      selected="1"
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="setor"
                      max="40"
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      type="submit"
                      onClick={() => {}}
                      value="Filtrar"
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiFilterAlt size={20} />}
                    />
                  </div>
                </div>
              </form>
            </div>
          </AccordionFilter>

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={items}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
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
                    <div className="h-12">
                      <Button
                        title="Cadastrar setor"
                        value="Cadastrar setor"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {
                          router.push('setor/cadastro');
                        }}
                        icon={<HiOutlineOfficeBuilding size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
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
                                    <div className="h-8 mb-2">
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
                                                generate.value as string,
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
                          title="Exportar planilha de setores"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
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

                      onClick={() => setCurrentPage(pages)}
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
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  const { token } = req.cookies;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterApplication = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/department`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const departments = await fetch(urlParameters.toString(), requestOptions);
  const { response: allDepartments, total: totalItems } = await departments.json();

  return {
    props: {
      allDepartments,
      totalItems,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
