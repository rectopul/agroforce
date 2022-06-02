import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { RiFileExcel2Line } from "react-icons/ri";
import { focoService } from 'src/services/foco.service';
import MaterialTable from "material-table";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { AccordionFilter, CheckBox } from "src/components";
import { userPreferencesService, grupoService, } from "src/services";
import { FaRegThumbsDown, FaRegThumbsUp, FaSortAmountUpAlt } from "react-icons/fa";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar } from "react-icons/ai";
import { ReactNode, useEffect } from "react";
import * as XLSX from 'xlsx';
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import Swal from 'sweetalert2';
import {
  Button,
  Content,
  Input,
  Select
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';




export interface IUpdateFoco {
  id: number;
  name: string;
  status: number;
  created_by: number;
}

interface IData {
  allItens: any;
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  id_foco: number;
  genotipo: any;
  foco: IUpdateFoco,
}

interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}


export default function Atualizar({ foco, allItens, totalItems, itensPerPage, filterAplication, id_foco, genotipo }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<IUpdateFoco>({
    initialValues: {
      id: foco.id,
      name: foco.name,
      status: foco.status,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await focoService.update({
        id: foco.id,
        name: capitalize(formik.values.name),
        id_culture: parseInt(culture),
        status: foco.status,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Foco atualizado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      });
    },
  });

  const preferences = userLogado.preferences.grupo || { id: 0, table_preferences: "id,,name,grupo,acao" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [grupos, setGrupos] = useState<any>(() => allItens);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderName, setOrderName] = useState<number>(0);
  const [arrowName, setArrowName] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito", value: "id" },
    { name: "CamposGerenciados[]", title: "Safra", value: "safra" },
    { name: "CamposGerenciados[]", title: "Grupo", value: "grupo" },
    { name: "CamposGerenciados[]", title: "Ação", value: "acao" }
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

  const formikGrupo = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      const parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch + "&id_foco=" + id_foco;
      await grupoService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response: any) => {
        setGrupos(response);
        setTotaItems(response.length);
        setFilter(parametersFilter);
      })
    },
  });

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
      if (ObjetCampos[index] === 'safra') {
        arrOb.push({
          title: "Safra",
          field: "safra.safraName",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'grupo') {
        arrOb.push({
          title: "Grupo",
          field: "grupo",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'acao') {
        arrOb.push({
          title: "Ação",
          field: "grupo",
          sorting: false,
          render: (rowData: any) => (
            <div className='h-10 flex'>
              <div className="h-10">
                <Button
                  icon={<BiEdit size={16} />}
                  onClick={() => { router.push(`grupo/atualizar?id=${rowData.id}`) }}
                  bgColor="bg-blue-600"
                  textColor="white"
                />
              </div>
            </div>
          ),

        });
      }
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 12 }).then((response) => {
        userLogado.preferences.grupo = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.grupo = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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

    await grupoService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
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
    if (filterAplication) {
      filterAplication += `&paramSelect=${camposGerenciados}&id_foco=${id_foco}`;
    }

    await grupoService.getAll(filterAplication).then((response) => {
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
        XLSX.utils.book_append_sheet(workBook, workSheet, "grupos");

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
        XLSX.writeFile(workBook, "grupos.xlsx");
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
    let parametersFilter = "skip=" + skip + "&take=" + take + "&id_foco=" + id_foco;

    if (filter) {
      parametersFilter = parametersFilter + "&" + filter;
    }
    await grupoService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setGrupos(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination(); ''
    handleTotalPages();
  }, [currentPage, pages]);

  return (
    <>
      <Head>
        <title>Atualizar foco</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar foco</h1>

          <div className="w-1/2
              flex 
              justify-around
              gap-6
              mt-4
              mb-4
          ">

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                max="50"
                placeholder="foco"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
          </div>

          <div className="
              h-10 w-full
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
                type="submit"
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<AiOutlineFileSearch size={20} />}
                onClick={() => { }}
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
              data={grupos}
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
                        title="Cadastrar grupo"
                        value="Cadastrar grupo"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { router.push(`grupo/cadastro?id_foco=${id_foco}`) }}
                        icon={<FaSortAmountUpAlt size={20} />}
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
                        <Button title="Exportar planilha de grupos" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/foco`;
  const token = context.req.cookies.token;
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 5;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const baseUrlGrupo = `${publicRuntimeConfig.apiUrl}/grupo`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = "filterStatus=1";

  const urlParameters: any = new URL(baseUrlGrupo);
  urlParameters.search = new URLSearchParams(param).toString();

  const id_foco = Number(context.query.id);
  const api = await fetch(`${baseUrlGrupo}?id_foco=${id_foco}`, requestOptions);

  let allItens: any = await api.json();
  const totalItems = allItens.total;
  allItens = allItens.response;

  const apiFoco = await fetch(`${baseUrlShow}/` + context.query.id, requestOptions);

  const foco = await apiFoco.json();

  return {
    props: {
      allItens,
      totalItems,
      itensPerPage,
      filterAplication,
      id_foco,
      foco
    }
  }
}
