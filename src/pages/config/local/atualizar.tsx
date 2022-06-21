import { capitalize } from "@mui/material";
import { setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { MdDateRange, MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import InputMask from "react-input-mask";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { localService, unidadeCulturaService, userPreferencesService } from "src/services";
import { saveDegreesCelsius } from "src/shared/utils/formatDegreesCelsius";
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import {
  AccordionFilter,
  Button, CheckBox, Content,
  Input,
} from "../../../components";
import * as ITabs from '../../../shared/utils/dropdown';

export interface IData {
  allItens: any;
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  id_local: number;
  local: object | any,
  pageBeforeEdit: string | any
}

interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}


interface IUpdateLocal {
  id: Number | any;
  name_local_culture: String | any;
  mloc: String | any;
  label: String | any;
  label_country: String | any;
  label_region: String | any;
  name_locality: String | any;
  adress: String | any;
  status: Number;
};

export default function AtualizarLocal({ local, allItens, totalItems, itensPerPage, filterAplication, id_local, pageBeforeEdit }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'LOCAL'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));


  const router = useRouter();

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.unidadeCultura || { id: 0, table_preferences: "id,culture_unity_name,year" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [unidadeCultura, setUnidadeCultura] = useState<any>(() => allItens);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderName, setOrderName] = useState<number>(0);
  const [arrowName, setArrowName] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(filterAplication);
  const [colorStar, setColorStar] = useState<string>('');
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito", value: "id" },
    { name: "CamposGerenciados[]", title: "Nome de Unidade de Cultura", value: "culture_unity_name" },
    { name: "CamposGerenciados[]", title: "Ano", value: "year" },
  ]);

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);
  const columns = columnsOrder(camposGerenciados);


  const formik = useFormik<IUpdateLocal>({
    initialValues: {
      id: local.id,
      name_local_culture: local.name_local_culture,
      label: local.label,
      mloc: local.mloc,
      adress: local.adress,
      label_country: local.label_country,
      label_region: local.label_region,
      name_locality: local.name_locality,
      status: local.status,
    },
    onSubmit: async (values) => {

      await localService.update({
        id: formik.values.id,
        name_local_culture: formik.values.name_local_culture,
        label: formik.values.label,
        mloc: formik.values.mloc,
        adress: formik.values.adress,
        label_country: formik.values.label_country,
        label_region: formik.values.label_region,
        name_locality: formik.values.name_locality,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('atualizado com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });


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
      if (ObjetCampos[index] === 'culture_unity_name') {
        arrOb.push({
          title: "Nome da Unidade de Cultura",
          field: "culture_unity_name",
          sorting: false
        });
      }
      if (ObjetCampos[index] === 'year') {
        arrOb.push({
          title: "Ano",
          field: "year",
          sorting: false
        });
      }

    });
    return arrOb;
  };

  async function getValuesComluns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = '';
    for (let i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += els[i].value + ',';
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1)
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 21 }).then((response) => {
        userLogado.preferences.unidadeCultura = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.unidadeCultura = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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

    await unidadeCulturaService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
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
    if (!filterAplication.includes("paramSelect")) {
      filterAplication += `&paramSelect=${camposGerenciados},foco&id_local=${id_local}`;
    }
    await unidadeCulturaService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: { status: any }) => {
          if (row.status === 0) {
            row.status = "Inativo";
          } else {
            row.status = "Ativo";
          }

          return row;
        });

        newData.map((item: any) => {
          item.foco = item.foco?.name
          item.safra = item.safra?.safraName
          return item
        })

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "unidade-cultura");

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
        XLSX.writeFile(workBook, "unidade-cultura.xlsx");
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
    let parametersFilter = "skip=" + skip + "&take=" + take + "&id_local=" + id_local;

    if (filter) {
      parametersFilter = parametersFilter + "&" + filter;
    }
    await unidadeCulturaService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setUnidadeCultura(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination(); ''
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head><title>Novo Local</title></Head>

      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Atualizar Local</h1>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome do lugar de cultura
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="name_local_culture"
                name="name_local_culture"
                disabled
                onChange={formik.handleChange}
                value={formik.values.name_local_culture}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Rótulo
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="label"
                name="label"
                disabled
                onChange={formik.handleChange}
                value={formik.values.label}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *MLOC
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="mloc"
                name="mloc"
                disabled
                onChange={formik.handleChange}
                value={formik.values.mloc}
              />
            </div>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome da Fazenda
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="adress"
                name="adress"
                disabled
                onChange={formik.handleChange}
                value={formik.values.adress}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *País
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="label_country"
                name="label_country"
                disabled
                onChange={formik.handleChange}
                value={formik.values.label_country}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Região
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="label_region"
                name="label_region"
                disabled
                onChange={formik.handleChange}
                value={formik.values.label_region}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Localidade
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="name_locality"
                name="name_locality"
                disabled
                onChange={formik.handleChange}
                value={formik.values.name_locality}
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
                onClick={() => { router.back(); }}
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
              data={unidadeCultura}
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
                        <Button title="Exportar planilha de unidade de cultura" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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
  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/local`;
  const token = context.req.cookies.token;
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 5;

  const pageBeforeEdit = context.req.cookies.pageBeforeEdit ? context.req.cookies.pageBeforeEdit : 0;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };
  // removeCookies('filterBeforeEdit', { req, res });

  // removeCookies('pageBeforeEdit', { req, res });

  const baseUrlUnidadeCultura = `${publicRuntimeConfig.apiUrl}/unidade-cultura`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = "filterStatus=1";

  const urlParameters: any = new URL(baseUrlUnidadeCultura);
  urlParameters.search = new URLSearchParams(param).toString();

  const id_local = Number(context.query.id);
  const api = await fetch(`${baseUrlUnidadeCultura}?id_local=${id_local}`, requestOptions);

  let allItens: any = await api.json();
  const totalItems = allItens.total;
  allItens = allItens.response;

  const apiLocal = await fetch(`${baseUrlShow}/` + context.query.id, requestOptions);

  const local = await apiLocal.json();

  return {
    props: {
      allItens,
      totalItems,
      itensPerPage,
      filterAplication,
      id_local,
      local,
      pageBeforeEdit
    }
  }
}