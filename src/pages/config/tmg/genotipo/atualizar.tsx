import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import MaterialTable from "material-table";
import { SiMicrogenetics } from "react-icons/si";
import {
  Button,
  Content,
  Input
} from "src/components";
import { genotipoService } from "src/services";
import Swal from "sweetalert2";
import * as ITabs from '../../../../shared/utils/dropdown';

import { ReactNode, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from "react-icons/ri";
import { AccordionFilter, CheckBox, Select } from "src/components";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { userPreferencesService, loteGenotipoService, loteService, } from "src/services";
import * as XLSX from 'xlsx';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
export interface IUpdateGenotipo {
  id: number;
  id_culture: number;
  genealogy: string;
  genotipo: string;
  cruza: string;
  id_tecnologia: number;
  status: number;
}

export interface LoteGenotipo {
  id: number;
  id_culture: number;
  id_genotipo: number;
  genealogy: string;
  name: string;
  volume: number;
  status?: number;
}

interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allLote: LoteGenotipo[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  id_genotipo: number;
  genotipo: IUpdateGenotipo;
}

export default function Atualizargenotipo({ allLote, totalItems, itensPerPage, filterAplication, id_genotipo, genotipo }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const formik = useFormik<IUpdateGenotipo>({
    initialValues: {
      id: genotipo.id,
      id_culture: genotipo.id_culture,
      genealogy: genotipo.genealogy,
      genotipo: genotipo.genotipo,
      cruza: genotipo.cruza,
      id_tecnologia: genotipo.id_tecnologia,
      status: genotipo.status,
    },
    onSubmit: async (values) => {
      await genotipoService.update({
        id: genotipo.id,
        id_culture: formik.values.id_culture,
        genealogy: capitalize(formik.values.genealogy),
        genotipo: capitalize(formik.values.genotipo),
        cruza: formik.values.cruza,
        status: genotipo.status,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Genótipo atualizado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      });
    },
  });

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.lote || { id: 0, table_preferences: "id,genealogy,name,volume,status" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [lotes, setLotes] = useState<LoteGenotipo[]>(() => allLote);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderName, setOrderName] = useState<number>(0);
  const [arrowName, setArrowName] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito", value: "id" },
    { name: "CamposGerenciados[]", title: "Nome", value: "name" },
    { name: "CamposGerenciados[]", title: "Volume", value: "volume" }
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

  const formikLote = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      const parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch + "&id_genotipo=" + id_genotipo;
      await loteService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response: LoteGenotipo[]) => {
        setLotes(response);
        setTotaItems(response.length);
        setFilter(parametersFilter);
      })
    },
  });

  async function handleStatusLote(idItem: number, data: LoteGenotipo): Promise<void> {
    if (data.status === 1) {
      data.status = 0;
    } else {
      data.status = 1;
    }

    const index = lotes.findIndex((lote) => lote.id === idItem);

    if (index === -1) {
      return;
    }

    setLotes((oldLote) => {
      const copy = [...oldLote];
      copy[index].status = data.status;
      return copy;
    });

    const { id, status } = lotes[index];

    await loteGenotipoService.changeStatus({ id, status });
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
      if (ObjetCampos[index] === 'name') {
        arrOb.push({
          title: "Nome",
          field: "name",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'volume') {
        arrOb.push({
          title: "Volume",
          field: "volume",
          sorting: false
        });
      }
      // if (ObjetCampos[index] === 'status') {
      //   arrOb.push({
      //     title: "Status",
      //     field: "status",
      //     sorting: false,
      //     searchable: false,
      //     filterPlaceholder: "Filtrar por status",
      //     render: (rowData: LoteGenotipo) => (
      //       <div className='h-10 flex'>
      //         <div className="h-10">
      //           <Button 
      //             icon={<BiEdit size={16} />}
      //             onClick={() => {router.push(`lote/atualizar?id=${rowData.id}`)}} 
      //             bgColor="bg-blue-600"
      //             textColor="white"
      //             // href={`/config/npe/lote/atualizar?id=${rowData.id}`}
      //           />
      //         </div>
      //         {rowData.status === 1 ? (
      //           <div className="h-10">
      //             <Button
      //               type="submit"
      //               icon={<FaRegThumbsUp size={16} />}
      //               onClick={async () => await handleStatusLote(
      //                 rowData.id, {
      //                   status: rowData.status,
      //                   ...rowData
      //                 }
      //               )}
      //               bgColor="bg-green-600"
      //               textColor="white"
      //             />
      //           </div>
      //         ) : (
      //           <div className="h-10">
      //             <Button
      //               type="submit"
      //               icon={<FaRegThumbsDown size={16} />}
      //               onClick={async () => await handleStatusLote(
      //                 rowData.id, {
      //                   status: rowData.status,
      //                   ...rowData
      //                 }
      //               )}
      //               bgColor="bg-red-800"
      //               textColor="white"
      //             />
      //           </div>
      //         )}
      //       </div>
      //     ),
      //   })
      // }
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 12 }).then((response) => {
        userLogado.preferences.lote = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.lote = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  };

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
        parametersFilter = filter + "&orderBy=" + column + "&typeOrder=" + typeOrder;
      } else {
        parametersFilter = filter;
      }
    } else {
      if (typeOrder !== '') {
        parametersFilter = "orderBy=" + column + "&typeOrder=" + typeOrder;
      } else {
        parametersFilter = filter;
      }
    }

    await loteService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setOrderName(response.response)
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
    if (!filterAplication.includes("paramSelect")){
      filterAplication += `&paramSelect=${camposGerenciados}&id_genotipo=${id_genotipo}`;
    }

    await loteService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: { status: any }) => {
          if (row.status === 0) {
            row.status = "Inativo";
          } else {
            row.status = "Ativo";
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "lotes");

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
        XLSX.writeFile(workBook, "Lotes.xlsx");
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
    let parametersFilter = "skip=" + skip + "&take=" + take + "&id_genotipo=" + id_genotipo;

    if (filter) {
      parametersFilter = parametersFilter + "&" + filter;
    }
    await loteService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setLotes(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination(); ''
    handleTotalPages();
  }, [currentPage]);
  return (
    <>
      <Head><title>Atualizar genótipo</title></Head>
      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar genótipo</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Genotipo
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder="Ex: Genotipo A1"
                id="genotipo"
                name="genotipo"
                onChange={formik.handleChange}
                value={formik.values.genotipo}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Genealogia
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder="Ex: Genealogia A1"
                id="genealogy"
                name="genealogy"
                onChange={formik.handleChange}
                value={formik.values.genealogy}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Cruza
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder="Ex: HIR + HFR"
                id="cruza"
                name="cruza"
                onChange={formik.handleChange}
                value={formik.values.cruza}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Tecnologia
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                required
                id="id_tecnologia"
                name="id_tecnologia"
                onChange={formik.handleChange}
                value={formik.values.id_tecnologia}
              />
            </div>
          </div>
          <div className="h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          ">
            <div className="w-30">
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => router.back()}
              />
            </div>            
          </div>
        </form>
        <main className="h-4/6 w-full
          flex flex-col
          items-start
          gap-8
        ">

          <div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={lotes}
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
                    {/* <div className='h-12'>
                      <Button
                        title="Cadastrar lote"
                        value="Cadastrar lote"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {router.push(`lote/cadastro/${id_genotipo}`)}}
                        icon={<FaSortAmountUpAlt size={20} />}
                      />
                    </div> */}

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
                        <Button title="Exportar planilha de lotes" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 5;
  const token = context.req.cookies.token;
  const { publicRuntimeConfig } = getConfig();

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const baseUrl = `${publicRuntimeConfig.apiUrl}/genotipo`;
  const apiGenotipo = await fetch(`${baseUrl}/` + context.query.id, requestOptions);
  const genotipo = await apiGenotipo.json();

  const baseTecUrl = `${publicRuntimeConfig.apiUrl}/tecnologia`;
  const apiTecnologia = await fetch(`${baseTecUrl}/` + genotipo.id_tecnologia, requestOptions);
  const tecnologia = await apiTecnologia.json();

  genotipo.id_tecnologia = tecnologia.name

  const baseUrlLote = `${publicRuntimeConfig.apiUrl}/lote`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = "filterStatus=1";
  const urlParameters: any = new URL(baseUrlLote);
  urlParameters.search = new URLSearchParams(param).toString();
  const id_genotipo = Number(context.query.id);

  const api = await fetch(`${baseUrlLote}?id_genotipo=${id_genotipo}`, requestOptions);

  let allLote: any = await api.json();
  const totalItems = allLote.total;
  allLote = allLote.response;

  return {
    props: {
      genotipo,
      allLote,
      totalItems,
      itensPerPage,
      filterAplication,
      id_genotipo
    }
  }
}
