import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import router from 'next/router';
import { useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage, MdUpdate } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { epocaService, userPreferencesService } from 'src/services';
import * as XLSX from 'xlsx';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

interface IEpoca {
  id: number;
  id_culture: number;
  name: string;
  status?: number;
}

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  allItems: IEpoca[];
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  cultureId: number;
}

export default function Listagem({
  allItems, itensPerPage, filterApplication, totalItems, cultureId,
}: Idata) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.tipo_epoca || { id: 0, table_preferences: 'id,name,status' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [epoca, setEpoca] = useState<IEpoca[]>(() => allItems);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderName, setOrderName] = useState<number>(0);
  const [arrowName, setArrowName] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]', title: 'Favorito ', value: 'id', defaultChecked: () => camposGerenciados.includes('id'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Nome', value: 'name', defaultChecked: () => camposGerenciados.includes('name'),
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
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      const parametersFilter = `filterStatus=${values.filterStatus}&filterSearch=${values.filterSearch}&id_culture=${cultureId}`;
      await epocaService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setEpoca(response.response);
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

  async function handleStatus(idItem: number, data: IEpoca): Promise<void> {
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }

    const index = epoca.findIndex((epoca) => epoca.id === idItem);

    if (index === -1) {
      return;
    }

    setEpoca((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = data.status;
      return copy;
    });

    const { id, name, status } = epoca[index];

    await epocaService.update({
      id,
      name,
      status,
    });
  }

  function colums(camposGerenciados: any): any {
    const ObjetCampos: any = camposGerenciados.split(',');
    const arrOb: any = [];
    Object.keys(ObjetCampos).forEach((item) => {
      if (ObjetCampos[item] === 'id') {
        arrOb.push({
          title: '',
          field: 'id',
          width: 0,
          render: () => (
            colorStar === '#eba417' ? (
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
            ) : (
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
        });
      }

      if (ObjetCampos[item] === 'id') {
        arrOb.push({ title: 'Código', field: 'id', sorting: false });
      }
      if (ObjetCampos[item] === 'name') {
        arrOb.push({
          title: (
            <div className="flex items-center">
              {arrowName}
              <button className="font-medium text-gray-900" onClick={() => handleOrderName('name', orderName)}>
                Nome
              </button>
            </div>
          ),
          field: 'name',
          sorting: false,
        });
      }

      if (ObjetCampos[item] === 'status') {
        arrOb.push({
          title: 'Status',
          field: 'status',
          sorting: false,
          searchable: false,
          filterPlaceholder: 'Filtrar por status',
          render: (rowData: IEpoca) => (
            <div className="h-10 flex">
              <div className="
                h-10
              "
              >
                <Button
                  icon={<BiEdit size={16} />}
                  onClick={() => { }}
                  bgColor="bg-blue-600"
                  textColor="white"
                  href={`/config/ensaio/epoca/atualizar?id=${rowData.id}`}
                  title={`Atualizar ${rowData.name}`}
                />
              </div>
              {rowData.status === 1 ? (
                <div>
                  <Button
                    icon={<FaRegThumbsUp size={16} />}
                    onClick={async () => await handleStatus(rowData.id, {
                      status: rowData.status,
                      ...rowData,
                    })}
                    title="Ativo"
                    bgColor="bg-green-600"
                    textColor="white"
                  />
                </div>
              ) : (
                <div>
                  <Button
                    icon={<FaRegThumbsDown size={16} />}
                    onClick={async () => await handleStatus(rowData.id, {
                      status: rowData.status,
                      ...rowData,
                    })}
                    title="Inativo"
                    bgColor="bg-red-800"
                    textColor="white"
                  />
                </div>
              )}
            </div>
          ),
        });
      }
    });

    return arrOb;
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 15 }).then((response) => {
        userLogado.preferences.tipo_epoca = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.tipo_epoca = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  }

  async function handleOrderName(column: string, order: string | any): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }

    if (filter && typeof (filter) !== undefined) {
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

    await epocaService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setEpoca(response.response);
      }
    });

    if (orderName === 2) {
      setOrderName(0);
      setArrowName(<AiOutlineArrowDown />);
    } else {
      setOrderName(orderName + 1);
      if (orderName === 1) {
        setArrowName(<AiOutlineArrowUp />);
      } else {
        setArrowName('');
      }
    }
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
      filterApplication += `&paramSelect=${camposGerenciados}&id_culture=${cultureId}`;
    }

    await epocaService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = epoca.map((row) => {
          if (row.status === 0) {
            row.status = 'Inativo' as any;
          } else {
            row.status = 'Ativo' as any;
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Época');

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
        XLSX.writeFile(workBook, 'Época.xlsx');
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
    const skip = currentPage * Number(take);
    let parametersFilter = `skip=${skip}&take=${take}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await epocaService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setEpoca(response.response);
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
        <title>Listagem de Épocas</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        "
        >
          <AccordionFilter title="Filtrar épocas">
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
                    <Select name="filterStatus" onChange={formik.handleChange} values={filters.map((id) => id)} selected="1" />
                  </div>

                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="nome"
                      max="40"
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="h-16 w-32 mt-3">
                  <Button
                    type="submit"
                    onClick={() => { }}
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
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={epoca}
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
                        title="Cadastrar época"
                        value="Cadastrar época"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="/config/ensaio/epoca/cadastro"
                        icon={<MdUpdate size={20} />}
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
                        <Button title="Exportar planilha de locais" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0]?.itens_per_page ?? 15;

  const { token } = req.cookies;
  const { cultureId } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/epoca`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
  const filterApplication = `filterStatus=1&id_culture=${cultureId}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const epoca = await fetch(urlParameters.toString(), requestOptions);
  const Response = await epoca.json();
  const allItems = Response.response;
  const totalItems = Response.total;

  return {
    props: {
      allItems,
      totalItems,
      itensPerPage,
      filterApplication,
      cultureId,
    },
  };
};
