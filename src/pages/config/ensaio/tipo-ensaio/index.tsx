import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiOrganizationChart } from "react-icons/ri";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { typeAssayService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

interface ITypeAssayProps {
  id: Number | any;
  name: String | any;
  type_assay_children?: []
  created_by: Number;
  status: Number;
};

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
interface Idata {
  allItems: ITypeAssayProps[];
  totalItems: Number;
  filter: string | any;
  itensPerPage: number | any;
  filterAplication: object | any;
  cultureId: number;
  id_safra: string;
  pageBeforeEdit: string | any
  filterBeforeEdit: string | any;
}

export default function Listagem({ allItems, itensPerPage, filterAplication, totalItems, cultureId, id_safra, pageBeforeEdit, filterBeforeEdit }: Idata) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.tipo_ensaio || { id: 0, table_preferences: "id,name,seeds,status" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);


  const [typeAssay, setTypeAssay] = useState<ITypeAssayProps[]>(() => allItems);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [orderName, setOrderName] = useState<number>(1);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit)
  const [arrowName, setArrowName] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterAplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito ", value: "id", defaultChecked: () => camposGerenciados.includes('id') },
    { name: "CamposGerenciados[]", title: "Nome", value: "name", defaultChecked: () => camposGerenciados.includes('name') },
    { name: "CamposGerenciados[]", title: "Quant. de sementes por envelope", value: "seeds", defaultChecked: () => camposGerenciados.includes('seeds') },
    { name: "CamposGerenciados[]", title: "Status", value: "status", defaultChecked: () => camposGerenciados.includes('status') }
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');
  const router = useRouter();
  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const columns = colums(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({ filterStatus, filterSearch }) => {
      const parametersFilter = `filterStatus=${filterStatus ? filterStatus : 1}&filterSearch=${filterSearch}&id_culture=${cultureId}&id_safra=${id_safra}`;
      setFiltersParams(parametersFilter)
      setCookies("filterBeforeEdit", filtersParams)
      await typeAssayService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setTypeAssay(response.response);
        setTotalItems(response.total)
        setCurrentPage(0)
      })
    },
  });

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatus = filterBeforeEdit.split('')

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
      if (ObjetCampos[item] === 'name') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              {arrowName}
              <button className='font-medium text-gray-900' onClick={() => handleOrderName('name', orderName)}>
                Nome
              </button>
            </div>
          ),
          field: "name",
          sorting: false
        });
      }
      if (ObjetCampos[item] === 'seeds') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              <button className='font-medium text-gray-900'>
                Quant. de sementes por envelope
              </button>
            </div>
          ),
          field: "seeds",
          sorting: false
        });
      }

      if (ObjetCampos[item] === 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: ITypeAssayProps) => (
            rowData.status ? (
              <div className='h-10 flex'>
                <div className="
                  h-10
                ">
                  <Button
                    icon={<BiEdit size={16} />}
                    title={`Atualizar ${rowData.name}`}
                    onClick={() => {
                      setCookies("pageBeforeEdit", currentPage?.toString())
                      setCookies("filterBeforeEdit", filtersParams)
                      router.push(`/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`)
                    }}
                    bgColor="bg-blue-600"
                    textColor="white"
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
                    href={`/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`}
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 9 }).then((response) => {
        userLogado.preferences.tipo_ensaio = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.tipo_ensaio = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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

    const response = await typeAssayService.update({ id: id, status: status });

    console.log('response');
    console.log(response);

    const index = typeAssay.findIndex((typeAssay) => typeAssay.id === id);

    if (index === -1) {
      return;
    }

    setTypeAssay((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = status;
      return copy;
    });
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

    await typeAssayService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setTypeAssay(response.response)
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
      filterAplication += `&paramSelect=${camposGerenciados}&id_culture=${cultureId}`;
    }

    await typeAssayService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = typeAssay.map((row) => {
          if (row.status === 0) {
            row.status = "Inativo" as any;
          } else {
            row.status = "Ativo" as any;
          }

          return row;
        });

        newData.map(item => {
          delete item.type_assay_children
          return item
        })

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Tipo_Ensaio");

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
        XLSX.writeFile(workBook, "Tipo_Ensaio.xlsx");
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
    await typeAssayService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setTypeAssay(response.response);
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
        <title>Listagem Tipos de Ensaio</title>
      </Head>
      <Content contentHeader={tabsDropDowns}>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar tipos de ensaio">
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
                    <Select name="filterStatus" onChange={formik.handleChange} defaultValue={filterStatus[13]} values={filters.map(id => id)} selected={'1'} />
                  </div>

                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Pesquisar
                    </label>
                    <Input
                      type="text"
                      placeholder="nome"
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
              data={typeAssay}
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
                        title="Cadastrar Tipo Ensaio"
                        value="Cadastrar Tipo Ensaio"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="/config/ensaio/tipo-ensaio/cadastro"
                        icon={<RiOrganizationChart size={20} />}
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
                        <Button title="Exportar planilha de ensaios" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : "filterStatus=1";
  const token = req.cookies.token;
  const cultureId = req.cookies.cultureId;
  const id_safra = req.cookies.safraId;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/type-assay`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}&id_safra=${id_safra}`;
  const filterAplication = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit + "&id_culture=" + cultureId + "&id_safra=" + id_safra : "filterStatus=1&id_culture=" + cultureId + "&id_safra=" + id_safra;

  removeCookies('filterBeforeEdit', { req, res });

  removeCookies('pageBeforeEdit', { req, res });
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const local = await fetch(urlParameters.toString(), requestOptions);
  const Response = await local.json();
  const allItems = Response.response;
  const totalItems = Response.total;

  console.log('allItems')
  console.log(allItems)

  return {
    props: {
      allItems,
      totalItems,
      itensPerPage,
      filterAplication,
      cultureId,
      id_safra,
      pageBeforeEdit,
      filterBeforeEdit
    },
  }
}
