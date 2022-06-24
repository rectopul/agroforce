import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import MaterialTable from "material-table";
import {
  Button,
  Content,
  Input
} from "src/components";
import Swal from "sweetalert2";
import * as ITabs from '../../../../shared/utils/dropdown';

import { ReactNode, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from "react-icons/ri";
import { AccordionFilter, CheckBox, Select } from "src/components";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { userPreferencesService, layoutChildrenService, quadraService, } from "src/services";
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
  allChildrens: any[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  id_layout: number;
  layout: any;
}

export default function Atualizarquadra({ allChildrens, totalItems, itensPerPage, filterAplication, id_layout, layout }: IData) {
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
      id: layout.id,
      parcelas: layout.parcelas,
      plantadeira: layout.plantadeira,
      esquema: layout.esquema,
      tiros: layout.tiros,
      disparos: layout.disparos,
    },
    onSubmit: async (values) => {
      await quadraService.update({
        id: layout.id,
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
        tiros: values.tiros,
        disparos: values.larg_.disparos,
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
  const preferences = userLogado.preferences.layout_children || { id: 0, table_preferences: "id,sl,sc,s_aloc,tiro,cj,disparo,dist,st,spc,scolheita,tipo_parcela" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [disparos, setDisparos] = useState<any[]>(() => allChildrens);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderName, setOrderName] = useState<number>(0);
  const [arrowName, setArrowName] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito", value: "id" },
    { name: "CamposGerenciados[]", title: "sl", value: "sl" },
    { name: "CamposGerenciados[]", title: "sc", value: "sc" },
    { name: "CamposGerenciados[]", title: "s_aloc", value: "s_aloc" },
    { name: "CamposGerenciados[]", title: "tiro", value: "tiro" },
    { name: "CamposGerenciados[]", title: "cj", value: "cj" },
    { name: "CamposGerenciados[]", title: "disparo", value: "disparo" },
    { name: "CamposGerenciados[]", title: "dist", value: "dist" },
    { name: "CamposGerenciados[]", title: "st", value: "st" },
    { name: "CamposGerenciados[]", title: "spc", value: "spc" },
    { name: "CamposGerenciados[]", title: "scolheita", value: "scolheita" },
    { name: "CamposGerenciados[]", title: "tipo parcela", value: "tipo_parcela" },
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
      const parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch + "&id_layout=" + id_layout;
      await layoutChildrenService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response: any[]) => {
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

    await layoutChildrenService.update({ id: id, status: status });
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

      if (ObjetCampos[index] === 'sl') {
        arrOb.push({
          title: "sl",
          field: "sl",
          sorting: false
        });
      }


      if (ObjetCampos[index] === 'sc') {
        arrOb.push({
          title: "sc",
          field: "sc",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 's_aloc') {
        arrOb.push({
          title: "saloc",
          field: "s_aloc",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'tiro') {
        arrOb.push({
          title: "tiro",
          field: "tiro",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'cj') {
        arrOb.push({
          title: "cj",
          field: "cj",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'disparo') {
        arrOb.push({
          title: "disparo",
          field: "disparo",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'dist') {
        arrOb.push({
          title: "dist",
          field: "dist",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'st') {
        arrOb.push({
          title: "st",
          field: "st",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'spc') {
        arrOb.push({
          title: "spc",
          field: "spc",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'scolheita') {
        arrOb.push({
          title: "scolheita",
          field: "scolheita",
          sorting: false
        });
      }

      if (ObjetCampos[index] === 'tipo_parcela') {
        arrOb.push({
          title: "tipo parcela",
          field: "tipo_parcela",
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, sle_id: 19 }).then((response) => {
        userLogado.preferences.layout_children = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.layout_children = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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
    if (!filterAplication.includes("paramSelect")) {
      filterAplication += `&paramSelect=${camposGerenciados}&id_layout=${id_layout}`;
    }

    await layoutChildrenService.getAll(filterAplication).then((response) => {
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
    let parametersFilter = "skip=" + skip + "&take=" + take + "&id_layout=" + id_layout;

    if (filter) {
      parametersFilter = parametersFilter + "&" + filter;
    }
    await layoutChildrenService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setDisparos(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination(); ''
    handleTotalPages();
  }, [currentPage]);
  return (
    <>
      <Head><title>Atualizar layout quadra</title></Head>
      <Content contentHeader={tabsDropDowns} moduloActive={'config'}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar layout quadra</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Código esquema:
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                required
                id="esquema"
                name="esquema"
                value={layout.esquema}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Plantadeiras:
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                required
                id="plantadeira"
                name="plantadeira"
                value={layout.plantadeira}
              />
            </div>
          </div>
          <div className="w-full flex justify-between items-start gap-5 mt-10">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Tiros:
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="tiros"
                name="tiros"
                onChange={formik.handleChange}
                value={layout.tiros}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Disparos
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="disparos"
                name="disparos"
                onChange={formik.handleChange}
                value={formik.values.disparos}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Parcelas
              </label>
              <Input
                required
                style={{ background: '#e5e7eb' }}
                disabled
                placeholder=""
                id="parcelas"
                name="parcelas"
                onChange={formik.handleChange}
                value={formik.values.parcelas}
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
        <main className="h-3/5 w-full
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
                        <Button title="Exportar planilha de disparos" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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

  const baseUrl = `${publicRuntimeConfig.apiUrl}/layout-quadra`;
  const apiQuadra = await fetch(`${baseUrl}/` + context.query.id, requestOptions);
  const layout = await apiQuadra.json();

  const baseUrlDisparos = `${publicRuntimeConfig.apiUrl}/layout-children`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = "filterStatus=1";
  const urlParameters: any = new URL(baseUrlDisparos);
  urlParameters.search = new URLSearchParams(param).toString();
  const id_layout = Number(context.query.id);

  const api = await fetch(`${baseUrlDisparos}?id_layout=${id_layout}`, requestOptions);

  let allChildrens: any = await api.json();

  const totalItems = allChildrens.total;
  allChildrens = allChildrens.response;

  return {
    props: {
      layout,
      allChildrens,
      totalItems,
      itensPerPage,
      filterAplication,
      id_layout
    }
  }
}
