import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from 'react-icons/ri';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select,
} from 'src/components';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { userPreferencesService } from 'src/services';
import { experimentoService } from 'src/services/experimento.service';
import Swal from 'sweetalert2';
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

export interface IExperimento {
  id: number;
  protocol_name: string;
  experimento_name: string;
  year: number;
  rotulo: string;
  foco: string;
  ensaio: string;
  cod_tec: number;
  epoca: number;
  materiais: number;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allExperimentos: IExperimento[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  id_culture: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any
}

export default function Listagem({
  allExperimentos, totalItems, itensPerPage, filterApplication, id_culture, pageBeforeEdit, filterBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'EXPERIMENTOS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.experimento || { id: 0, table_preferences: 'id,protocolo_name,experimento_name,year,rotulo,foco,ensaio,tecnologia,epoca,materiais,status' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const router = useRouter();
  const [experimentos, setExperimento] = useState<IExperimento[]>(() => allExperimentos);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Nome protocolo', value: 'protocolo_name' },
    { name: 'CamposGerenciados[]', title: 'Nome experimento', value: 'experimento_name' },
    { name: 'CamposGerenciados[]', title: 'Ano', value: 'year' },
    { name: 'CamposGerenciados[]', title: 'Rótulo', value: 'rotulo' },
    { name: 'CamposGerenciados[]', title: 'Foco', value: 'foco' },
    { name: 'CamposGerenciados[]', title: 'Ensaio', value: 'ensaio' },
    { name: 'CamposGerenciados[]', title: 'Cód. Tec.', value: 'tecnologia' },
    { name: 'CamposGerenciados[]', title: 'EP', value: 'epoca' },
    { name: 'CamposGerenciados[]', title: 'N de materiais', value: 'materiais' },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
  ]);

  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');

  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatus = filterBeforeEdit.split('');

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
      const parametersFilter = `filterStatus=${filterStatus || 1}&filterProtocolName=${filterProtocolName}&id_culture=${id_culture}&filterExperimentoName=${filterExperimentoName}&filterRotulo=${filterRotulo}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await experimentoService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setExperimento(response.response);
        setTotalItems(response.total);
        setCurrentPage(0);
      });
    },
  });

  async function handleStatus(idExperimento: number, data: IExperimento): Promise<void> {
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }

    const index = experimentos.findIndex((experimento) => experimento.id === idExperimento);

    if (index === -1) {
      return;
    }

    setExperimento((oldExperimento) => {
      const copy = [...oldExperimento];
      copy[index].status = data.status;
      return copy;
    });

    const {
      id,
      status,
    } = experimentos[index];

    await experimentoService.update({
      id,
      status,
    });
  }

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
      render: (rowData: IExperimento) => (
        <div className="h-10 flex">
          <div className="h-10">
            <Button
              icon={<BiEdit size={16} />}
              bgColor="bg-blue-600"
              textColor="white"
              title={`Editar ${rowData.experimento_name}`}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filtersParams);
                router.push(`/listas/experimentos/experimento/atualizar?id=${rowData.id}`);
              }}
            />
          </div>
          {rowData.status === 1
            ? (
              <div className="h-10">
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
            )
            : (
              <div className="h-10">
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
    };
  }

  function columnsOrder(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((_, index) => {
      if (columnCampos[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnCampos[index] === 'protocolo_name') {
        tableFields.push(headerTableFactory('Nome protocolo', 'protocolo_name'));
      }
      if (columnCampos[index] === 'experimento_name') {
        tableFields.push(headerTableFactory('Nome experimento', 'experimento_name'));
      }
      if (columnCampos[index] === 'year') {
        tableFields.push(headerTableFactory('Ano', 'year'));
      }
      if (columnCampos[index] === 'rotulo') {
        tableFields.push(headerTableFactory('Ano', 'year'));
      }
      if (columnCampos[index] === 'foco') {
        tableFields.push(headerTableFactory('Foco', 'foco.name'));
      }
      if (columnCampos[index] === 'ensaio') {
        tableFields.push(headerTableFactory('Ensaio', 'ensaio.name'));
      }
      if (columnCampos[index] === 'tecnologia') {
        tableFields.push(headerTableFactory('Cód tec', 'tecnologia.cod_tec'));
      }
      if (columnCampos[index] === 'epoca') {
        tableFields.push(headerTableFactory('Época', 'epoca'));
      }
      if (columnCampos[index] === 'materiais') {
        tableFields.push(headerTableFactory('Nº Materiais', 'materiais'));
      }
      if (columnCampos[index] === 'status') {
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

    await experimentoService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setExperimento(response.response);
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 22 }).then((response) => {
        userLogado.preferences.experimento = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.experimento = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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

    await experimentoService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = experimentos.map((row) => {
          if (row.status === 0) {
            row.status = 'Inativo' as any;
          } else {
            row.status = 'Ativo' as any;
          }

          return row;
        });

        // newData.map((item: any) => {
        //     return item.tecnologia = item.tecnologia?.tecnologia
        // })

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'experimentos');

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
        XLSX.writeFile(workBook, 'Experimentos.xlsx');
      } else {
        Swal.fire(response);
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
      parametersFilter = `${parametersFilter}&${filter}&${id_culture}`;
    }
    await experimentoService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setExperimento(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-10 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-2">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          max="40"
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  return (
    <>
      <Head><title>Listagem de experimentos</title></Head>

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main className="h-full w-full
                        flex flex-col
                        items-start
                        gap-8
                        "
        >
          <AccordionFilter title="Filtrar experimentos">
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
                    <Select name="filterStatus" onChange={formik.handleChange} defaultValue={filterStatus[13]} values={filtersStatusItem.map((id) => id)} selected="1" />
                  </div>

                  {filterFieldFactory('filterProtocolName', 'Nome Protocolo')}

                  {filterFieldFactory('filterExperimentoName', 'Nome Experimento')}

                  {filterFieldFactory('filterRotulo', 'Rótulo')}

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

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={experimentos}
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
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="experimento/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
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
                        {/* <Button title="Importação de planilha" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {router.push('portfolio/importacao')}} /> */}
                        <Button title="Exportar planilha de experimentos" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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

  const { token } = req.cookies;
  const id_culture = Number(req.cookies.cultureId);
  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : 'filterStatus=1';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/experimento`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${id_culture}`;
  const filterApplication = req.cookies.filterBeforeEdit ? `${req.cookies.filterBeforeEdit}&id_culture=${id_culture}` : 'filterStatus=1';

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const experimento = await fetch(`${baseUrl}?id_culture=${id_culture}`, requestOptions);
  const { response: allExperimentos, total: totalItems } = await experimento.json();

  console.log('allExperimentos');
  console.log(allExperimentos);

  return {
    props: {
      allExperimentos,
      totalItems,
      itensPerPage,
      filterApplication,
      id_culture,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
