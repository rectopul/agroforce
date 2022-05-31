import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from "react-icons/ri";
import { AccordionFilter, Button, CheckBox, Content, Input, Select } from "src/components";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { quadraService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import ITabs from "../../../shared/utils/dropdown";
import Swal from "sweetalert2";

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface IQuadra {
  id: number;
  id_culture: number;
  local_preparo: string;
  local_plagio: string;
  cod_quadra: string;
  comp_p: string;
  linha_p: string;
  esquema: string;
  divisor: string;
  status?: number;
}

interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allquadra: IQuadra[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  cultureId: number;
}

export default function Listagem({ allquadra, totalItems, itensPerPage, filterAplication, cultureId }: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'QUADRAS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.quadras || { id: 0, table_preferences: "id,local_preparo,cod_quadra,linha_p,esquema, status" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const router = useRouter();
  const [quadra, setQuadra] = useState<IQuadra[]>(() => allquadra);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Código", value: "id" },
    { name: "CamposGerenciados[]", title: "Local Preparo", value: "local_preparo" },
    { name: "CamposGerenciados[]", title: "Código Quadra", value: "cod_quadra" },
    { name: "CamposGerenciados[]", title: "Linha P", value: "linha_p" },
    { name: "CamposGerenciados[]", title: "Esquema", value: "esquema" },
    { name: "CamposGerenciados[]", title: "Status", value: "status" },
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
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      let parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch + "&id_culture=" + cultureId;
      await quadraService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter)
        setQuadra(response.response);
        setTotalItems(response.total)
        setCurrentPage(0)
      })
    },
  });

  async function handleStatus(idQuadra: number, data: IQuadra): Promise<void> {

    let parametersFilter = "filterStatus=" + 1 + "&cod_quadra=" + data.cod_quadra;

    await quadraService.getAll(parametersFilter).then((response) => {
      if (response.total > 0) {
        Swal.fire('Quadra não pode ser atualizada pois já existe uma quadra com esse código local ativo!');
        return;
      } else {
        quadraService.update({
          id,
          status
        });
      }
    })

    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }

    const index = quadra.findIndex((quadra) => quadra.id === idQuadra);

    if (index === -1) {
      return;
    }

    setQuadra((oldSafra) => {
      const copy = [...oldSafra];
      copy[index].status = data.status;
      return copy;
    });

    const {
      id,
      status
    } = quadra[index];

  };

  function columnsOrder(camposGerenciados: any): any {
    let ObjetCampos: any = camposGerenciados.split(',');
    var arrOb: any = [];

    Object.keys(ObjetCampos).forEach((_, index) => {
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
      if (ObjetCampos[index] === 'cod_quadra') {
        arrOb.push({
          title: 'Código Quadra',
          field: "cod_quadra",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'comp_p') {
        arrOb.push({
          title: 'Comp P',
          field: "comp_p",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'linha_p') {
        arrOb.push({
          title: 'Linha P',
          field: "linha_p",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'esquema') {
        arrOb.push({
          title: 'Esquema',
          field: "esquema",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'divisor') {
        arrOb.push({
          title: 'Divisor',
          field: "divisor",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'local_plantio') {
        arrOb.push({
          title: 'Local Plantio',
          field: "local_plantio",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'local_preparo') {
        arrOb.push({
          title: 'Local Preparo',
          field: "local_preparo",
          sorting: false
        });
      }


      if (ObjetCampos[index] === 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: IQuadra) => (
            <div className='h-10 flex'>
              <div className="h-10">
                <Button
                  icon={<BiEdit size={16} />}
                  bgColor="bg-blue-600"
                  textColor="white"
                  title={`Editar`}
                  onClick={() => { router.push(`/config/quadra/atualizar?id=${rowData.id}`) }}
                />
              </div>
              {rowData.status === 1 ? (
                <div className="h-10">
                  <Button
                    icon={<FaRegThumbsUp size={16} />}
                    onClick={async () => await handleStatus(
                      rowData.id, {
                      status: rowData.status,
                      ...rowData,
                    }
                    )}
                    title={`Ativo`}
                    bgColor="bg-green-600"
                    textColor="white"
                  />
                </div>
              ) : (
                <div className="h-10">
                  <Button
                    icon={<FaRegThumbsDown size={16} />}
                    onClick={async () => await handleStatus(
                      rowData.id, {
                      status: rowData.status,
                      ...rowData,
                    }
                    )}
                    title={`Inativo`}
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
    var els: any = document.querySelectorAll("input[type='checkbox']");
    var selecionados = '';
    for (var i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += els[i].value + ',';
      }
    }
    var totalString = selecionados.length;
    let campos = selecionados.substr(0, totalString - 1)
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 17 }).then((response) => {
        userLogado.preferences.quadras = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.quadras = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  };

  function handleOnDragEnd(result: DropResult): void {
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
      filterAplication += `&paramSelect=${camposGerenciados}`;
    }

    await quadraService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = quadra.map((row) => {
          if (row.status === 0) {
            row.status = "Inativo" as any;
          } else {
            row.status = "Ativo" as any;
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "quadra");

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
        XLSX.writeFile(workBook, "Genótipos.xlsx");
      } else {
        alert(response);
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
      parametersFilter = parametersFilter + "&" + filter + "&" + cultureId;
    }
    await quadraService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setQuadra(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head><title>Listagem de genótipos</title></Head>

      <Content contentHeader={tabsDropDowns}>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar genótipos">
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
                    <Select name="filterStatus" onChange={formik.handleChange} values={filtersStatusItem.map(id => id)} selected={'1'} />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Pesquisar
                    </label>
                    <Input
                      type="text"
                      placeholder="código quadra"
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

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={quadra}
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
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="quadra/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
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
                                      <div className="h-8 mb-3">
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
                                                  defaultChecked={camposGerenciados.includes(String(genarate.value))}
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
                        {/* <Button title="Importação de planilha" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {router.push('portfolio/importacao')}} /> */}
                        <Button title="Download lista de quadras" icon={<BsDownload size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
                      </div>
                      <div className='h-12 flex items-center justify-center w-full'>
                        <Button icon={<RiSettingsFill size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { }} href="quadra/importar-planilha/config-planilha" />
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0].itens_per_page ?? 15;

  const token = req.cookies.token;
  const cultureId: number = Number(req.cookies.cultureId);

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
  let filterAplication = "filterStatus=1&id_culture=" + cultureId;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const api = await fetch(`${baseUrl}?id_culture=${cultureId}`, requestOptions);
  const data = await api.json();

  const allquadra = data.response;
  const totalItems = data.total;

  return {
    props: {
      allquadra,
      totalItems,
      itensPerPage,
      filterAplication,
      cultureId
    },
  }
}
