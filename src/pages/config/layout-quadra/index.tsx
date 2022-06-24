import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { layoutQuadraService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select
} from "../../../components";
import * as ITabs from '../../../shared/utils/dropdown';

interface ILayoultProps {
  id: Number | any;
  esquema: String | any;
  semente_metros: Number | any;
  disparos: Number | any;
  divisor: Number | any;
  largura: Number | any;
  comp_fisico: Number | any;
  comp_parcela: Number | any;
  comp_corredor: Number | any;
  t4_inicial: Number | any;
  t4_final: Number | any;
  df_inicial: Number | any;
  df_final: Number | any;
  created_by: Number;
  local: String | any;
  status: Number;
};

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  filterUF: string | any;
  filterCity: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  allItems: ILayoultProps[];
  totalItems: Number;
  filter: string | any;
  itensPerPage: number | any;
  filterAplication: object | any;
  local: object | any;
}

export default function Listagem({ allItems, itensPerPage, filterAplication, totalItems, local }: Idata) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'QUADRAS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.layout_quadra || { id: 0, table_preferences: "id,esquema,local,semente_metros,semente_metros,disparos,divisor,largura,comp_fisico,comp_parcela,comp_corredor,t4_inicial,t4_final,df_inicial,df_final,status" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [quadras, setQuadra] = useState<ILayoultProps[]>(() => allItems);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderName, setOrderName] = useState<number>(0);
  const [orderAddress, setOrderAddress] = useState<number>(0);
  const [arrowName, setArrowName] = useState<any>('');
  const [arrowAddress, setArrowAddress] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterAplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);

  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito ", value: "id", defaultChecked: () => camposGerenciados.includes('id') },
    { name: "CamposGerenciados[]", title: "Esquema ", value: "esquema", defaultChecked: () => camposGerenciados.includes('esquema') },
    { name: "CamposGerenciados[]", title: "Local ", value: "local", defaultChecked: () => camposGerenciados.includes('local') },
    { name: "CamposGerenciados[]", title: "Sementer por Metros", value: "semente_metros", defaultChecked: () => camposGerenciados.includes('semente_metros') },
    { name: "CamposGerenciados[]", title: "Disparos", value: "disparos", defaultChecked: () => camposGerenciados.includes('disparos') },
    { name: "CamposGerenciados[]", title: "Divisor", value: "divisor", defaultChecked: () => camposGerenciados.includes('divisor') },
    { name: "CamposGerenciados[]", title: "Largura", value: "largura", defaultChecked: () => camposGerenciados.includes('largura') },
    { name: "CamposGerenciados[]", title: "Comp. Físico", value: "comp_fisico", defaultChecked: () => camposGerenciados.includes('comp_fisico') },
    { name: "CamposGerenciados[]", title: "Comp. Parcela", value: "comp_parcela", defaultChecked: () => camposGerenciados.includes('comp_parcela') },
    { name: "CamposGerenciados[]", title: "Comp Corredor", value: "comp_corredor", defaultChecked: () => camposGerenciados.includes('comp_corredor') },
    { name: "CamposGerenciados[]", title: "T4 Inicial", value: "t4_inicial", defaultChecked: () => camposGerenciados.includes('t4_inicial') },
    { name: "CamposGerenciados[]", title: "T4 Final", value: "t4_final", defaultChecked: () => camposGerenciados.includes('t4_final') },
    { name: "CamposGerenciados[]", title: "DF Inicial", value: "df_inicial", defaultChecked: () => camposGerenciados.includes('df_inicial') },
    { name: "CamposGerenciados[]", title: "DF Final", value: "df_final", defaultChecked: () => camposGerenciados.includes('df_final') },
    { name: "CamposGerenciados[]", title: "Status", value: "status", defaultChecked: () => camposGerenciados.includes('status') }
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
      filterUF: '',
      filterCity: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      let parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch + "&filterUF=" + values.filterUF + "&filterCity=" + values.filterCity;
      await layoutQuadraService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setQuadra(response.response);
        setTotalItems(response.total);
        setCurrentPage(0);
      })
    },
  });

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  function colums(camposGerenciados: any): any {
    let ObjetCampos: any = camposGerenciados.split(',');
    let arrOb: any = [];
    Object.keys(ObjetCampos).forEach((item) => {
      if (ObjetCampos[item] === 'id') {
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

      if (ObjetCampos[item] === 'id') {
        arrOb.push({ title: "Código", field: "id", sorting: false })
      }
      if (ObjetCampos[item] === 'esquema') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              {arrowName}
              <button className='font-medium text-gray-900' onClick={() => handleOrderName('esquema', orderName)}>
                Esquema
              </button>
            </div>
          ),
          field: "esquema",
          sorting: false
        });
      }

      if (ObjetCampos[item] === 'local') {
        arrOb.push({ title: "Local", field: "local", sorting: false })
      }

      if (ObjetCampos[item] === 'semente_metros') {
        arrOb.push({ title: "Sementes por Metros", field: "semente_metros", sorting: false })
      }

      if (ObjetCampos[item] === 'disparos') {
        arrOb.push({ title: "Disparos", field: "disparos", sorting: false })
      }

      if (ObjetCampos[item] === 'divisor') {
        arrOb.push({ title: "Divisor", field: "divisor", sorting: false })
      }

      // if (ObjetCampos[item] === 'largura') {
      //   arrOb.push({ title: "Largura", field: "largura", sorting: false })
      // }

      if (ObjetCampos[item] === 'comp_fisico') {
        arrOb.push({ title: "Comp. Fisico", field: "comp_fisico", sorting: false })
      }

      if (ObjetCampos[item] === 'comp_parcela') {
        arrOb.push({ title: "Comp. Parcel", field: "comp_parcela", sorting: false })
      }

      if (ObjetCampos[item] === 'comp_corredor') {
        arrOb.push({ title: "Comp. Corretor", field: "comp_corredor", sorting: false })
      }

      if (ObjetCampos[item] === 't4_inicial') {
        arrOb.push({ title: "T4 Inicial", field: "t4_inicial", sorting: false })
      }

      if (ObjetCampos[item] === 't4_final') {
        arrOb.push({ title: "T4 Final", field: "t4_final", sorting: false })
      }

      if (ObjetCampos[item] === 'df_inicial') {
        arrOb.push({ title: "DF Inicial", field: "df_inicial", sorting: false })
      }

      if (ObjetCampos[item] === 'df_final') {
        arrOb.push({ title: "DF Final", field: "df_final", sorting: false })
      }
      if (ObjetCampos[item] === 'largura') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              {arrowAddress}
              <button className='font-medium text-gray-900' onClick={() => handleOrderAddress('largura', orderAddress)}>
                Largura
              </button>
            </div>
          ),
          field: "largura",
          sorting: false
        });
      }

      if (ObjetCampos[item] === 'latitude') {
        arrOb.push({ title: "Latitude", field: "latitude", sorting: false })
      }

      if (ObjetCampos[item] === 'longitude') {
        arrOb.push({ title: "Longitude", field: "longitude", sorting: false })
      }

      if (ObjetCampos[item] === 'altitude') {
        arrOb.push({ title: "Altitude", field: "altitude", sorting: false })
      }

      if (ObjetCampos[item] === 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: ILayoultProps) => (
            rowData.status ? (
              <div className='h-10 flex'>
                <div className="
                  h-10
                ">
                  <Button
                    icon={<BiEdit size={16} />}
                    onClick={() => { }}
                    bgColor="bg-blue-600"
                    textColor="white"
                    href={`/config/layout-quadra/atualizar?id=${rowData.id}`}
                  />
                </div>
                <div>
                  <Button
                    icon={<FaRegThumbsUp size={16} />}
                    onClick={() => handleStatus(rowData.id, !rowData.status)}
                    bgColor="bg-green-600"
                    textColor="white"
                  />
                </div>
              </div>
            ) : (
              <div className='h-10 flex'>
                <div className="
                  h-10
                ">
                  <Button
                    icon={<BiEdit size={16} />}
                    onClick={() => { }}
                    bgColor="bg-blue-600"
                    textColor="white"
                    href={`/config/layout-quadra/atualizar?id=${rowData.id}`}
                  />
                </div>
                <div>
                  <Button
                    icon={<FaRegThumbsDown size={16} />}
                    onClick={() => handleStatus(
                      rowData.id, !rowData.status
                    )}
                    bgColor="bg-red-800"
                    textColor="white"
                  />
                </div>
              </div>
            )
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 5 }).then((response) => {
        userLogado.preferences.layout_quadra = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.layout_quadra = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  };

  async function handleStatus(id: number, status: any): Promise<void> {
    if (status) {
      status = 1;
    } else {
      status = 0;
    }
    await layoutQuadraService.update({ id: id, status: status });
    const index = quadras.findIndex((quadras) => quadras.id === id);

    if (index === -1) {
      return;
    }

    setQuadra((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = status;
      return copy;
    });
  };

  async function handleOrderAddress(column: string, order: string | any): Promise<void> {
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

    await layoutQuadraService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setQuadra(response.response)
      }
    })
    if (orderAddress === 2) {
      setOrderAddress(0);
      setArrowAddress(<AiOutlineArrowDown />);
    } else {
      setOrderAddress(orderAddress + 1);
      if (orderAddress === 1) {
        setArrowAddress(<AiOutlineArrowUp />);
      } else {
        setArrowAddress('');
      }
    }
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

    await layoutQuadraService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setQuadra(response.response)
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
    if (!filterAplication.includes("paramSelect")) {
      filterAplication += `&paramSelect=${camposGerenciados}`;
    }

    await layoutQuadraService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = quadras.map((row) => {
          if (row.status === 0) {
            row.status = "Inativo" as any;
          } else {
            row.status = "Ativo" as any;
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "quadras");

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
        XLSX.writeFile(workBook, "Layout_Quadra.xlsx");
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
    await layoutQuadraService.getAll(parametersFilter).then((response) => {
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
      <Head>
        <title>Listagem dos Layout</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive={'config'}>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar layouts de quadra">
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
                    <Select name="filterStatus" onChange={formik.handleChange} values={filters.map(id => id)} selected={'1'} />
                  </div>

                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Pesquisar
                    </label>
                    <Input
                      type="text"
                      placeholder="esquema"
                      max="40"
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="h-16 w-32 mt-3">
                  <Button
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
              data={quadras}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20
                },
                rowStyle: { background: '#f9fafb' },
                search: false,
                filtering: false,
                pageSize: itensPerPage
              }}
              components={{
                Toolbar: () => (
                  <div
                    className='w-full max-h-max		
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
                        title="Cadastrar Layout"
                        value="Cadastrar Layout"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="layout-quadra/cadastro"
                        icon={<FiUserPlus size={20} />}
                      />
                    </div>

                    <strong className='text-blue-600'>Total registrado: {itemsTotal}</strong>

                    <div className='h-full flex items-center gap-2
                    '>
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-64">
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
                                                  defaultChecked={camposGerenciados.includes(genarate.value)}
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
                        <Button title="Importação de planilha" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { router.push('layout-quadra/importacao') }} />
                      </div>
                      <div className='h-12 flex items-center justify-center w-full'>
                        <Button title="Exportar planilha de layout quadra" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 10;
  const token = req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/layout-quadra`;
  const baseUrlLocal = `${publicRuntimeConfig.apiUrl}/local`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const filterAplication = "filterStatus=1";
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const local = await fetch(urlParameters.toString(), requestOptions);
  const apiUF = await fetch(`${baseUrlLocal}/uf`, requestOptions);
  const uf = await apiUF.json();
  const Response = await local.json();
  const allItems = Response.response;
  const totalItems = Response.total;
  return {
    props: {
      allItems,
      totalItems,
      itensPerPage,
      filterAplication,
      uf
    },
  }
}
