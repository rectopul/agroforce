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
import Swal from "sweetalert2";
import * as ITabs from '../../../shared/utils/dropdown';

import { ReactNode, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { FaRegThumbsDown, FaRegThumbsUp, FaSortAmountUpAlt } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from "react-icons/ri";
import { AccordionFilter, CheckBox, Select } from "src/components";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { userPreferencesService, disparosService, quadraService, } from "src/services";
import * as XLSX from 'xlsx';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allDisparos: any[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  id_quadra: number;
  quadra: any;
}

export default function Atualizarquadra({ allDisparos, totalItems, itensPerPage, filterAplication, id_quadra, quadra }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'QUADRAS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const formik = useFormik<any>({
    initialValues: {
      id: quadra.id,
      cod_quadra: quadra.cod_quadra,
      id_culture: quadra.id_culture,
      id_safra: quadra.id_safra,
      local_preparo: quadra.local_preparo,
      local_plantio: quadra.local_plantio,
      larg_q: quadra.larg_q,
      comp_p: quadra.comp_p,
      linha_p: quadra.linha_p,
      comp_c: quadra.comp_c,
      esquema: quadra.esquema,
      tiro_fixo: quadra.tiro_fixo,
      disparo_fixo: quadra.disparo_fixo,
      q: quadra.q,
    },
    onSubmit: async (values) => {
      await quadraService.update({
        id: quadra.id,
        cod_quadra: values.cod_quadra,
        id_culture: values.id_culture,
        id_safra: values.id_safra,
        local_preparo: values.local_preparo,
        local_plantio: values.local_plantio,
        larg_q: values.larg_.larg_q,
        comp_p: values.larg_.comp_p,
        linha_p: values.larg_.linha_p,
        comp_c: values.larg_.comp_c,
        esquema: values.larg_.esquema,
        tiro_fixo: values.larg_.tiro_fixo,
        disparo_fixo: values.larg_.disparo_fixo,
        q: quadra.larg_.q,
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
  const preferences = userLogado.preferences.disparos || { id: 0, table_preferences: "id,divisor,sem_metros,t4_i,t4_f,di,df,status" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [disparos, setDisparos] = useState<any[]>(() => allDisparos);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderName, setOrderName] = useState<number>(0);
  const [arrowName, setArrowName] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Código", value: "id" },
    { name: "CamposGerenciados[]", title: "Divisor", value: "divisor" },
    { name: "CamposGerenciados[]", title: "Sem metro", value: "sem_metros" },
    { name: "CamposGerenciados[]", title: "T4I", value: "t4_i" },
    { name: "CamposGerenciados[]", title: "T4F", value: "t4_f" },
    { name: "CamposGerenciados[]", title: "DI", value: "di" },
    { name: "CamposGerenciados[]", title: "DF", value: "df" },
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

  const formikDisparo = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      const parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch + "&id_quadra=" + id_quadra;
      await disparosService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response: any[]) => {
        setDisparos(response);
        setTotaItems(response.length);
        setFilter(parametersFilter);
      })
    },
  });

  async function handleStatus(idItem: number, data: any): Promise<void> {
    if (data.status === 1) {
      data.status = 0;
    } else {
      data.status = 1;
    }

    const index = disparos.findIndex((disparos) => disparos.id === idItem);

    if (index === -1) {
      return;
    }

    setDisparos((oldDisparos) => {
      const copy = [...oldDisparos];
      copy[index].status = data.status;
      return copy;
    });

    const { id, status } = disparos[index];

    await disparosService.update({ id: id, status: status });
  };

  function columnsOrder(camposGerenciados: string) {
    let ObjetCampos: string[] = camposGerenciados.split(',');
    var arrOb: any = [];

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

      if (ObjetCampos[index] === 'id') {
        arrOb.push({
          title: "Código",
          field: "id",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'divisor') {
        arrOb.push({
          title: "Divisor",
          field: "divisor",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'sem_metros') {
        arrOb.push({
          title: "Sem metro",
          field: "sem_metros",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 't4_i') {
        arrOb.push({
          title: "t4i",
          field: "t4_i",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 't4_f') {
        arrOb.push({
          title: "t4f",
          field: "t4_f",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'di') {
        arrOb.push({
          title: "di",
          field: "di",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'df') {
        arrOb.push({
          title: "df",
          field: "df",
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
      //     render: (rowData: any) => (
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
    var els: any = document.querySelectorAll("input[type='checkbox'");
    var selecionados = '';
    for (var i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += els[i].value + ',';
      }
    }
    var totalString = selecionados.length;
    let campos = selecionados.substr(0, totalString - 1)
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 18 }).then((response) => {
        userLogado.preferences.disparos = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.disparos = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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
      filterAplication += `&paramSelect=${camposGerenciados}&id_quadra=${id_quadra}`;
    }

    await disparosService.getAll(filterAplication).then((response) => {
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
        XLSX.utils.book_append_sheet(workBook, workSheet, "disparos");

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
        XLSX.writeFile(workBook, "disparos.xlsx");
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
    let parametersFilter = "skip=" + skip + "&take=" + take + "&id_quadra=" + id_quadra;

    if (filter) {
      parametersFilter = parametersFilter + "&" + filter;
    }
    await disparosService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setDisparos(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination(); ''
    handleTotalPages();
  }, [currentPage, pages]);
  return (
    <>
      <Head><title>Atualizar quadra</title></Head>
      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar quadra</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Código
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                required
                id="id"
                name="id"
                value={quadra.id}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Código Quadra
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                required
                id="cod_quadra"
                name="cod_quadra"
                value={quadra.cod_quadra}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Local Preparo
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                required
                value={quadra.local_preparo}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Largura Q
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="larg_q"
                name="larg_q"
                onChange={formik.handleChange}
                value={quadra.larg_q}
              />
            </div>
          </div>
          <div className="w-full flex justify-between items-start gap-5 mt-10">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Comp P.
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="comp_p"
                name="comp_p"
                onChange={formik.handleChange}
                value={quadra.comp_p}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Linha P.
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="linha_p"
                name="linha_p"
                onChange={formik.handleChange}
                value={formik.values.linha_p}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Comp C.
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="comp_c"
                name="comp_c"
                onChange={formik.handleChange}
                value={formik.values.comp_c}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Esquema
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="esquema"
                name="esquema"
                onChange={formik.handleChange}
                value={formik.values.esquema}
              />
            </div>
          </div>
          <div className="w-full flex justify-between items-start gap-5 mt-10">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Tiro fixo
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="tiro_fixo"
                name="tiro_fixo"
                onChange={formik.handleChange}
                value={formik.values.tiro_fixo}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Disparo fixo
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="disparo_fixo"
                name="disparo_fixo"
                onChange={formik.handleChange}
                value={formik.values.disparo_fixo}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Local realizado
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="local_plantio"
                name="local_plantio"
                onChange={formik.handleChange}
                value={formik.values.local_plantio}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Q:
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="q"
                name="q"
                onChange={formik.handleChange}
                value={formik.values.q}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Status quadra
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="cruza"
                name="cruza"
                onChange={formik.handleChange}
                value={formik.values.cruza}
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
            <div className="w-40">
              <Button
                // type="submit"
                value="Mapa"
                bgColor="bg-blue-600"
                disabled
                textColor="white"
                icon={<SiMicrogenetics size={18} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">

          <div style={{ marginTop: '1%' }} className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={disparos}
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
                        <Button title="Download lista de disparos" icon={<BsDownload size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 10;
  const token = context.req.cookies.token;
  const { publicRuntimeConfig } = getConfig();

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;
  const apiQuadra = await fetch(`${baseUrl}/` + context.query.id, requestOptions);
  const quadra = await apiQuadra.json();

  const baseUrlDisparos = `${publicRuntimeConfig.apiUrl}/disparos`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = "filterStatus=1";
  const urlParameters: any = new URL(baseUrlDisparos);
  urlParameters.search = new URLSearchParams(param).toString();
  const id_quadra = Number(context.query.id);

  const api = await fetch(`${baseUrlDisparos}?id_quadra=${id_quadra}`, requestOptions);

  let allDisparos: any = await api.json();

  const totalItems = allDisparos.total;
  allDisparos = allDisparos.response;
  console.log(allDisparos)
  return {
    props: {
      quadra,
      allDisparos,
      totalItems,
      itensPerPage,
      filterAplication,
      id_quadra
    }
  }
}
