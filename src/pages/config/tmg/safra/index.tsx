import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdDateRange, MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { AccordionFilter, Button, CheckBox, Content, Input, Select } from "src/components";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { safraService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import ITabs from "../../../../shared/utils/dropdown";
import { removeCookies, setCookies } from "cookies-next";

interface IFilter {
  filterStatus: object | any;
  filterSafra: string | any;
  filterYear: string | number
  filterStartDate: string | any;
  filterEndDate: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

interface ISafra {
  id: number;
  id_culture: number;
  safraName: string;
  year: number;
  plantingStartTime: string;
  plantingEndTime: string;
  main_safra: string;
  status?: number;
}

interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allSafras: ISafra[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  cultureId: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any
}

export default function Listagem({ allSafras, totalItems, itensPerPage, filterAplication, cultureId, pageBeforeEdit, filterBeforeEdit }: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.safra || { id: 0, table_preferences: "id,safraName,year,plantingStartTime,plantingEndTime,status" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const [safras, setSafras] = useState<ISafra[]>(() => allSafras);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit)
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [arrowSafra, setArrowSafra] = useState<string>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito", value: "id" },
    { name: "CamposGerenciados[]", title: "Safra", value: "safraName" },
    { name: "CamposGerenciados[]", title: "Ano", value: "year" },
    { name: "CamposGerenciados[]", title: "Período ideal de início de plantio", value: "plantingStartTime" },
    { name: "CamposGerenciados[]", title: "Período ideal do fim do plantio", value: "plantingEndTime" },
    { name: "CamposGerenciados[]", title: "Status", value: "status" }
  ]);
  const [filter, setFilter] = useState<any>(filterAplication);
  const [colorStar, setColorStar] = useState<string>('');

  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const columns = columnsOrder(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSafra: '',
      filterYear: '',
      filterStartDate: '',
      filterEndDate: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({ filterStatus, filterSafra, filterYear, filterStartDate, filterEndDate }) => {
      const parametersFilter = `filterStatus=${filterStatus}&filterSafra=${filterSafra}&filterYear=${filterYear}&filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}&id_culture=${cultureId}`
      //const parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch + "&id_culture=" + cultureId;
      setFiltersParams(parametersFilter)
      setCookies("filterBeforeEdit", filtersParams)
      await safraService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setSafras(response.response);
        setTotalItems(response.total)
        setCurrentPage(0)
      })
    },
  });

  async function handleStatusSafra(idItem: number, data: ISafra): Promise<void> {
    if (data.status === 1) {
      data.status = 0;
    } else {
      data.status = 1;
    }

    const index = safras.findIndex((safra) => safra.id === idItem);

    if (index === -1) {
      return;
    }

    setSafras((oldSafra) => {
      const copy = [...oldSafra];
      copy[index].status = data.status;
      return copy;
    });

    const {
      id,
      safraName,
      year,
      plantingStartTime,
      plantingEndTime,
      status
    } = safras[index];

    await safraService.updateSafras({
      id,
      safraName,
      year,
      plantingStartTime,
      plantingEndTime,
      status,
    });
  };

  function columnsOrder(camposGerenciados: string) {
    let ObjetCampos: string[] = camposGerenciados.split(',');
    let arrOb: any = [];

    Object.keys(ObjetCampos).forEach((item, index) => {
      if (ObjetCampos[index] === 'id') {
        arrOb.push({
          title: "",
          field: "id",
          width: 0,
          render: () => (
            colorStar === '#eba417' ? (
              <div className='h-10 flex'>
                <div>
                  <button
                    className="w-full h-full flex items-center justify-center border-0"
                    onClick={() => setColorStar('')}
                  >
                    <AiTwotoneStar size={25} color={'#eba417'} />
                  </button>
                </div>
              </div>
            ) : (
              <div className='h-10 flex'>
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
        })
      }
      if (ObjetCampos[index] === 'safraName') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              {arrowSafra}
              <button className='font-medium text-gray-900' onClick={() => { } /*handleOrderName('value', item.value)*/}>
                Safra
              </button>
            </div>
          ),
          field: "safraName",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'year') {
        arrOb.push({
          title: "Ano ",
          field: "year",
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'plantingStartTime') {
        arrOb.push({
          title: "Período ideal de início de plantio",
          field: "plantingStartTime",
          sorting: false,
        })
      }
      if (ObjetCampos[index] === 'plantingEndTime') {
        arrOb.push({
          title: "Período ideal do fim do plantio",
          field: "plantingEndTime",
          sorting: false,
        })
      }
      if (ObjetCampos[index] === 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: ISafra) => (
            <div className='h-10 flex'>
              <div className="h-10">
                <Button
                  icon={<BiEdit size={16} />}
                  bgColor="bg-blue-600"
                  textColor="white"
                  onClick={() => {
                    setCookies("pageBeforeEdit", currentPage?.toString())
                    setCookies("filterBeforeEdit", filtersParams)
                    router.push(`/config/tmg/safra/atualizar?id=${rowData.id}`)
                  }}

                />
              </div>
              {rowData.status === 1 ? (
                <div className="h-10">
                  <Button
                    icon={<FaRegThumbsUp size={16} />}
                    onClick={async () => await handleStatusSafra(
                      rowData.id, {
                      status: rowData.status,
                      ...rowData
                    }
                    )}
                    bgColor="bg-green-600"
                    textColor="white"
                  />
                </div>
              ) : (
                <div className="h-10">
                  <Button
                    icon={<FaRegThumbsDown size={16} />}
                    onClick={async () => await handleStatusSafra(
                      rowData.id, {
                      status: rowData.status,
                      ...rowData
                    }
                    )}
                    bgColor="bg-red-800"
                    textColor="white"
                  />
                </div>
              )}
            </div>
          ),
        })
      }
    });
    return arrOb;
  };

  async function getValuesComluns(): Promise<void> {
    let els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = '';
    for (let i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += els[i].value + ',';
      }
    }
    let totalString = selecionados.length;
    let campos = selecionados.substr(0, totalString - 1)
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 3 }).then((response) => {
        userLogado.preferences.safra = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.safra = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  };

  function handleOnDragEnd(result: DropResult) {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(genaratesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGenaratesProps(items);
  };

  const downloadExcel = async (): Promise<void> => {
    if (filterAplication) {
      filterAplication += `&paramSelect=${camposGerenciados}&id_culture=${cultureId}`;
    }

    await safraService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = safras.map((row) => {
          if (row.status === 0) {
            row.status = "Inativos" as any;
          } else {
            row.status = "Ativos" as any;
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "safras");

        // Buffer
        let buf = XLSX.write(workBook, {
          bookType: "xlsx", //xlsx
          type: "buffer",
        });
        // Binary
        XLSX.write(workBook, {
          bookType: "xlsx", //xlsx
          type: "binary",
        });
        // Download
        XLSX.writeFile(workBook, "Safras.xlsx");
      }
    });
  };

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  };

  async function handlePagination(): Promise<void> {
    let skip = currentPage * Number(take);
    let parametersFilter = "skip=" + skip + "&take=" + take;

    if (filter) {
      parametersFilter = parametersFilter + "&" + filter;
    }
    await safraService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setSafras(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);


  return (
    <>
      <Head><title>Listagem de safras</title></Head>

      <Content contentHeader={tabsDropDowns}>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar safras">
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
                    <Select name="filterStatus" id="filterStatus" onChange={formik.handleChange} values={filtersStatusItem.map(id => id)} selected={'1'} />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Safra
                    </label>
                    <Input
                      placeholder="Nome da Safra"
                      id="filterSafra"
                      name="filterSafra"
                      onChange={formik.handleChange}
                      className="shadow
                          appearance-none
                          bg-white bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          w-full
                          py-2 px-3
                          text-gray-900
                          leading-tight
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                        "
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Ano
                    </label>
                    <Input
                      placeholder="Ano"
                      id="filterYear"
                      name="filterYear"
                      onChange={formik.handleChange}
                      className="shadow
                          appearance-none
                          bg-white bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          w-full
                          py-2 px-3
                          text-gray-900
                          leading-tight
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                        "
                    />
                  </div>

                  {/* <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Data do início do plantio
                    </label>
                    <Input
                      placeholder="____-__-__"
                      id="filterStartDate"
                      name="filterStartDate"
                      onChange={formik.handleChange}
                      className="shadow
                          appearance-none
                          bg-white bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          w-full
                          py-2 px-3
                          text-gray-900
                          leading-tight
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                        "
                    />
                  </div> */}

                  {/* <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Data do fim do plantio
                    </label>
                    <Input
                      placeholder="____-__-__"
                      id="filterEndDate"
                      name="filterEndDate"
                      onChange={formik.handleChange}
                      className="shadow
                          appearance-none
                          bg-white bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          w-full
                          py-2 px-3
                          text-gray-900
                          leading-tight
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                        "
                    />
                  </div> */}
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
              data={safras}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20
                },
                search: false,
                filtering: false,
                pageSize: itensPerPage
              }}
              components={{
                Toolbar: () => (
                  <div
                    className='w-full max-h-96	
                      flex
                      items-center
                      justify-between
                      gap-4
                      bg-gray-50
                      py-2
                      px-5
                      border-solid border-b
                      border-gray-200
                    '>
                    <div className='h-12'>
                      <Button
                        title="Cadastrar safra"
                        value="Cadastrar safra"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { router.push('safra/cadastro') }}
                        icon={<MdDateRange size={20} />}
                      />
                    </div>

                    <strong className='text-blue-600'>Total registrado: {itemsTotal}</strong>

                    <div className='h-full flex items-center gap-2'>
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
                          <AccordionFilter title='Gerenciar Campos' grid={statusAccordion}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId='characters'>
                                {
                                  (provided) => (
                                    <ul className="w-full h-full characters" {...provided.droppableProps} ref={provided.innerRef}>
                                      <div className="h-8 mb-2">
                                        <Button
                                          value="Atualizar"
                                          bgColor='bg-blue-600'
                                          textColor='white'
                                          onClick={getValuesComluns}
                                          icon={<IoReloadSharp size={20} />}
                                        />
                                      </div>
                                      {
                                        genaratesProps.map((genarate, index) => (
                                          <Draggable key={index} draggableId={String(genarate.title)} index={index}>
                                            {(provided) => (
                                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <CheckBox
                                                  name={genarate.name}
                                                  title={genarate.title?.toString()}
                                                  value={genarate.value}
                                                  defaultChecked={camposGerenciados.includes(genarate.value as string)}
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
                      <div className='h-12 flex items-center justify-center w-full'>
                        <Button title="Exportar planilha de safras" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
                      </div>
                    </div>
                  </div>
                ),
                Pagination: (props) => (
                  <>
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
                          <>
                            <Button
                              key={index}
                              onClick={() => setCurrentPage(index)}
                              value={`${currentPage + 1}`}
                              bgColor="bg-blue-600"
                              textColor="white"
                              disabled={true}
                            />
                          </>
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
                  </>
                ) as any
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0].itens_per_page;

  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : 0;

  const token = req.cookies.token;
  const cultureId = req.cookies.cultureId;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/safra`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
  let filterAplication = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit + "&id_culture=" + cultureId : "filterStatus=1&id_culture=" + cultureId;

  removeCookies('filterBeforeEdit', { req, res });

  removeCookies('pageBeforeEdit', { req, res });

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const safra = await fetch(urlParameters.toString(), requestOptions);
  let Response = await safra.json();

  let allSafras = Response.response;
  let totalItems = Response.total;


  return {
    props: {
      allSafras,
      totalItems,
      itensPerPage,
      filterAplication,
      cultureId,
      pageBeforeEdit,
      filterBeforeEdit
    },
  }
}
