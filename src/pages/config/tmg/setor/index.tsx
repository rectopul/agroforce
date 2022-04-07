import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { AccordionFilter, Button, CheckBox, Content, Input, Select } from "src/components";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { departmentService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import ITabs from "../../../../shared/utils/dropdown";

interface IFilter{
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

interface IDepartment {
  id: number;
  name: string;
  status?: number;
}

interface IGenarateProps {
  name: string | undefined;
  title:  string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allDepartments: IDepartment[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
}

export default function Listagem({allDepartments, totalItems, itensPerPage, filterAplication}: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));
  
  const router = useRouter();
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.department ||{id:0, table_preferences: "id,name,status"};
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [items, setItems] = useState<IDepartment[]>(() => allDepartments);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number>(totalItems);
  const [orderName, setOrderName] = useState<number>(0);
  const [arrowName, setArrowName] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Código", value: "id"},
    { name: "CamposGerenciados[]", title: "Nome", value: "name"},
    { name: "CamposGerenciados[]", title: "Status", value: "status" }
  ]);
  const [filter, setFilter] = useState<any>(filterAplication);

  const filtersStatusItem = [
    { id: 2, name: 'Todos'},
    { id: 1, name: 'Ativos'},
    { id: 0, name: 'Inativos'},
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
      const parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch;
      await departmentService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
        setTotaItems(response.total);
        setFilter(parametersFilter);
        setItems(response.response);
      })
    },
  });

  async function handleStatusItem(idItem: number, data: IDepartment): Promise<void> {
    if (data.status === 1) {
      data.status = 0;
    } else {
      data.status = 1;
    }

    const index = items.findIndex((item) => item.id === idItem);

    if (index === -1) {
      return;
    }
    
    setItems((oldItem) => {
      const copy = [...oldItem];
      copy[index].status = data.status;
      return copy;
    });

    const { id, status, name } = items[index];

    await departmentService.update({ id, name, status });
  };

  function columnsOrder(camposGerenciados: string) {
    let ObjetCampos: string[] = camposGerenciados.split(',');
    var arrOb: any = [];

    Object.keys(ObjetCampos).forEach((item, index) => {
      if (ObjetCampos[index] == 'id') {
        arrOb.push({ 
          title: "Código", 
          field: "id", 
          sorting: false 
        })
      }
      if (ObjetCampos[index] == 'name') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowName }
              <button className='font-medium text-gray-900' onClick={() => handleOrderName('name', item)}>
                Nome
              </button>
            </div>
          ),
          field: "name",
          sorting: false
        },);
      }
      if (ObjetCampos[index] == 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: IDepartment) => (
            <div className='h-10 flex'>
              <div className="h-10">
                <Button 
                  icon={<BiEdit size={16} />}
                  bgColor="bg-blue-600"
                  textColor="white"
                  onClick={() =>{router.push(`/config/tmg/setor/atualizar?id=${rowData.id}`)}}

                />
              </div>
              {rowData.status === 1 ? (
                <div className="h-10">
                  <Button 
                    icon={<FaRegThumbsUp size={16} />}
                    onClick={async () => await handleStatusItem(
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
                    onClick={async () => await handleStatusItem(
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
    var els:any = document.querySelectorAll("input[type='checkbox'");
    var selecionados = '';
    for (var i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += els[i].value + ',';
      }
    } 
    var totalString = selecionados.length;
    let campos = selecionados.substr(0, totalString- 1)
    if (preferences.id === 0) {
      await userPreferencesService.create({table_preferences: campos,  userId: userLogado.id, module_id: 11 }).then((response) => {
        userLogado.preferences.department = {id: response.response.id, userId: preferences.userId, table_preferences: campos};
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.department = {id: preferences.id, userId: preferences.userId, table_preferences: campos};
      await userPreferencesService.update({table_preferences: campos, id: preferences.id});
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

    if (filter && typeof(filter) != undefined) {
      if (typeOrder != '') {
        parametersFilter = filter + "&orderBy=" + column + "&typeOrder=" + typeOrder;
      } else {
        parametersFilter = filter;
      }
    } else {
      if (typeOrder != '') {
        parametersFilter = "orderBy=" + column + "&typeOrder=" + typeOrder;
      } else {
        parametersFilter = filter;
      }
    }

    await departmentService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status == 200) {
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

  function handleOnDragEnd(result: DropResult) {
    setStatusAccordion(true);
    if (!result)  return;
    
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
    
    await departmentService.getAll(filterAplication).then((response) => {
      if (response.status == 200) {
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
        XLSX.utils.book_append_sheet(workBook, workSheet, "setores");
    
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
        XLSX.writeFile(workBook, "Setores.xlsx");
      }
    });
  };
  
  return (
    <>
      <Head><title>Listagem de setores</title></Head>

      <Content contentHeader={tabsDropDowns}>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar setores">
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
                        placeholder="setor"
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
                      onClick={() => {}}
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
                data={items}
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
                          title="Cadastrar setor"
                          value="Cadastrar setor"
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {router.push('setor/cadastro')}}
                          icon={<HiOutlineOfficeBuilding size={20} />}
                        />
                      </div>

                      <strong className='text-blue-600'>Total registrado: { itemsTotal }</strong>

                      <div className='h-full flex items-center gap-2'>
                        <div className="border-solid border-2 border-blue-600 rounded">
                          <div className="w-72">
                            <AccordionFilter title='Gerenciar Campos' grid={statusAccordion}>
                              <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId='characters'>
                                  {
                                    (provided) => (
                                      <ul className="w-full h-full characters" { ...provided.droppableProps } ref={provided.innerRef}>
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
                                        { provided.placeholder }
                                      </ul>
                                    )
                                  }
                                </Droppable>
                              </DragDropContext>
                            </AccordionFilter>
                          </div>
                        </div>

                        <div className='h-12 flex items-center justify-center w-full'>
                        <Button icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {downloadExcel()}} />
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
                        disabled={currentPage + 1>= pages}
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

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0].itens_per_page;

  const  token  =  req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/department`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = "filterStatus=1";
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const departments = await fetch(urlParameters.toString(), requestOptions);
  let Response = await departments.json();
  
  let allDepartments = Response.response;
  let totalItems = Response.total;

  return {
    props: {
      allDepartments,
      totalItems,
      itensPerPage,
      filterAplication
    },
  }
}