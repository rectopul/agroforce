import { Checkbox as Checkbox1 } from '@mui/material';
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import {
  AccordionFilter, Button, CheckBox, Content, Input,
} from 'src/components';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { userPreferencesService } from 'src/services';
import { experimentService } from 'src/services/experiment.service';
import * as XLSX from 'xlsx';

import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
  filterStatus: object | any;
  filterProtocolName: string | any;
  filterExperimentoName: string | any;
  filterRotulo: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface IParcela {
  id: number;
  experimento_name: string;
  foco: string;
  ensaio: string;
  tecnologia: string;
  cultura_unity_name: string;
  main_name: string;
  genotipo_name: string;
  lote: string;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allExperimentos: IParcela[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  cultureId: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any
}

export default function Listagem({
  allExperimentos, totalItems, itensPerPage, filterApplication, cultureId, pageBeforeEdit, filterBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'EXPERIMENTOS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.experimento || {
    id: 0, table_preferences: 'id,experimento_name,foco,ensaio,tecnologia,cultura_unity_name,main_name,genotipo_name,lote',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const router = useRouter();
  const [parcelas, setParcela] = useState<IParcela[]>(() => allExperimentos);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [orderCruza, setOrderCruza] = useState<number>(1);
  const [orderName, setOrderName] = useState<number>(1);
  const [arrowCruza, setArrowCruza] = useState<ReactNode>('');
  const [arrowName, setArrowName] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Nome experimento', value: 'experimento_name' },
    { name: 'CamposGerenciados[]', title: 'Foco', value: 'foco' },
    { name: 'CamposGerenciados[]', title: 'Ensaio', value: 'ensaio' },
    { name: 'CamposGerenciados[]', title: 'Cód. tec.', value: 'tecnologia' },
    { name: 'CamposGerenciados[]', title: 'Nome un. cultura', value: 'cultura_unity_name' },
    { name: 'CamposGerenciados[]', title: 'Nome principal', value: 'main_name' },
    { name: 'CamposGerenciados[]', title: 'Nome genotipo', value: 'genotipo_name' },
    { name: 'CamposGerenciados[]', title: 'Cód. Lote', value: 'lote' },
  ]);

  const [filter, setFilter] = useState<any>(filterApplication);

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const columns = columnsOrder(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterProtocolName: '',
      filterExperimentoName: '',
      filterRotulo: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus, filterProtocolName, filterExperimentoName, filterRotulo,
    }) => {
      const parametersFilter = `filterStatus=${filterStatus || 1}&filterProtocolName=${filterProtocolName}&id_culture=${cultureId}&filterExperimentoName=${filterExperimentoName}&filterRotulo=${filterRotulo}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await experimentService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setParcela(response.response);
        setTotalItems(response.total);
        setCurrentPage(0);
      });
    },
  });

  function columnsOrder(camposGerenciados: any): any {
    const ObjetCampos: any = camposGerenciados.split(',');
    const arrOb: any = [];

    Object.keys(ObjetCampos).forEach((_, index) => {
      if (ObjetCampos[index] === 'id') {
        arrOb.push({
          title: <button
            className="w-full h-full flex items-center justify-left border-0"
            onClick={() => { }}
          >
            <Checkbox1 sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }} />
          </button>,
          field: 'id',
          sorting: false,
          width: 0,
          render: () => (
            (
              <div className="h-10 flex">
                <div>
                  <button
                    className="w-full h-full flex items-center justify-center border-0"
                    onClick={() => { }}
                  >
                    <Checkbox1 sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }} />
                  </button>
                </div>
              </div>
            )
          ),
        });
      }
      if (ObjetCampos[index] === 'experimento_name') {
        arrOb.push({
          title: 'Nome experimento',
          field: 'experimento_name',
          sorting: false,

        });
      }
      if (ObjetCampos[index] === 'foco') {
        arrOb.push({
          title: 'Foco',
          field: 'foco.name',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'ensaio') {
        arrOb.push({
          title: 'Ensaio',
          field: 'ensaio.name',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'tecnologia') {
        arrOb.push({
          title: 'Cód tec',
          field: 'tecnologia.cod_tec',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'cultura_unity_name') {
        arrOb.push({
          title: 'Nome un. cultura',
          field: 'cultura_unity_name',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'main_name') {
        arrOb.push({
          title: 'Nome principal',
          field: 'main_name',
          cellStyle: {
            backgroundColor: '#c7da5e',
          },
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'genotipo_name') {
        arrOb.push({
          title: 'Nome genotipo',
          field: 'genotipo_name',
          cellStyle: {
            backgroundColor: '#c7da5e',
          },
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'lote') {
        arrOb.push({
          title: 'Cód. Lote',
          field: 'lote',
          sorting: false,
          render: (rowData: any) => (
            (
              <div className="h-10 flex">
                <div className="
                                            h-10
                                            "
                >
                  <Button
                    icon={<BiEdit size={32} />}
                    title={`Atualizar ${rowData.name}`}
                    onClick={() => { }}
                    bgColor="bg-red-600"
                    textColor="white"
                  />
                </div>
              </div>
            )
          ),
        });
      }
    });
    return arrOb;
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

    await experimentService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setParcela(response.response);
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

  async function handleOrderCruza(column: string, order: string | any): Promise<void> {
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

    await experimentService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setParcela(response.response);
      }
    });

    if (orderCruza === 2) {
      setOrderCruza(0);
      setArrowCruza(<AiOutlineArrowDown />);
    } else {
      setOrderCruza(orderCruza + 1);
      if (orderCruza === 1) {
        setArrowCruza(<AiOutlineArrowUp />);
      } else {
        setArrowCruza('');
      }
    }
  }

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox']");
    let selecionados = '';
    for (let i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 23 }).then((response) => {
        userLogado.preferences.parcelas = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.parcelas = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }
    setStatusAccordion(false);
    setCamposGerenciados(campos);
  }

  function handleOnDragEnd(result: DropResult): void {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    if (!filterApplication.includes('paramSelect')) {
      filterApplication += `&paramSelect=${camposGerenciados}`;
    }

    const workSheet = XLSX.utils.json_to_sheet(parcelas);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'parcelas');

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
    XLSX.writeFile(workBook, 'Parcelas.xlsx');
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
      parametersFilter = `${parametersFilter}&${filter}&${cultureId}`;
    }
    // await parcelasService.getAll(parametersFilter).then((response) => {
    //     if (response.status === 200) {
    //         setParcela(response.response);
    //     }
    // });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head><title>Listagem de parcelas</title></Head>

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main className="h-full w-full
                        flex flex-col
                        items-start
                        gap-8
                        "
        >
          <AccordionFilter title="Filtrar parcelas">
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                                    w-full
                                    h-full
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
                                        mb-6
                                        "
                >
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome Protocolo
                    </label>
                    <Input
                      type="text"
                      placeholder="Protocolo"
                      max="40"
                      id="filterProtocolName"
                      name="filterProtocolName"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome Experimento
                    </label>
                    <Input
                      type="text"
                      placeholder="Experimento"
                      max="40"
                      id="filterExperimentoName"
                      name="filterExperimentoName"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Foco
                    </label>
                    <Input
                      type="text"
                      placeholder="Foco"
                      max="40"
                      id="filterFoco"
                      name="filterFoco"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Ensaio
                    </label>
                    <Input
                      type="text"
                      placeholder="Ensaio"
                      max="40"
                      id="filterEnsaio"
                      name="filterEnsaio"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Cód tec.
                    </label>
                    <Input
                      type="text"
                      placeholder="Cód tec."
                      max="40"
                      id="filterTecnologia"
                      name="filterTecnologia"
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="w-full h-full
                                        flex
                                        justify-center
                                        pb-2
                                        "
                >
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      NCC
                    </label>
                    <Input
                      type="number"
                      placeholder="NCC"
                      max="40"
                      id="filterNcc"
                      name="filterNcc"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome un. cultura
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome un. cultura"
                      max="40"
                      id="filterCultureUnityName"
                      name="filterCultureUnityName"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome principal
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome principal"
                      max="40"
                      id="filterMainName"
                      name="filterMainName"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome do genótipo
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome do genótipo"
                      max="40"
                      id="filterGenotipoName"
                      name="filterGenotipoName"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Cód lote
                    </label>
                    <Input
                      type="text"
                      placeholder="Cód lote"
                      max="40"
                      id="filterLote"
                      name="filterLote"
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="h-12 w-32 mt-10">
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

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={parcelas}
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
                        title="Ação em massa"
                        value="Ação em massa"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
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
                                                  defaultChecked={camposGerenciados.includes(String(generate.value))}
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
                        <Button title="Exportar planilha de parcelas" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button icon={<RiSettingsFill size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { }} href="experimento/importar-planilha/config-planilha" />
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 10;

  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : 'filterStatus=1';

  const { token } = req.cookies;
  const cultureId = Number(req.cookies.cultureId);

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/experimento`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
  const filterApplication = req.cookies.filterBeforeEdit ? `${req.cookies.filterBeforeEdit}&id_culture=${cultureId}` : 'filterStatus=1';

  removeCookies('filterBeforeEdit', { req, res });

  removeCookies('pageBeforeEdit', { req, res });
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const api = await fetch(`${baseUrl}?id_culture=${cultureId}`, requestOptions);
  const data = await api.json();

  const allExperimentos = data.response;
  const totalItems = data.total;

  return {
    props: {
      allExperimentos,
      totalItems,
      itensPerPage,
      filterApplication,
      cultureId,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
