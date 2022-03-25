import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useFormik } from "formik";
import getConfig from 'next/config';
import MaterialTable from "material-table";
import * as XLSX from 'xlsx';
import { useRouter } from "next/router";

import { userPreferencesService, userService } from "src/services";
import { UserPreferenceController } from "src/controllers/user-preference.controller";

import { 
  Button, 
  Content, 
  Select, 
  Input,
  TabHeader,
  AccordionFilter,
  CheckBox
} from "../../../../components";

import  * as ITabs from '../../../../shared/utils/dropdown';

import { FiUserPlus } from "react-icons/fi";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from "react-icons/fa";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { IoReloadSharp } from "react-icons/io5";
import { handleFormatTel } from "src/shared/utils/tel";

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string,
  status: boolean,
}
interface IFilter{
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenarateProps {
  name: string | undefined;
  title:  string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  alItems: IUsers[];
  totalItems: Number;
  filter: string | any;
  itensPerPage: number | any;
  filterAplication: object | any;
}

export default function Listagem({ alItems, itensPerPage, filterAplication, totalItems}: Idata) {
  const { tmgDropDown, tabs } = ITabs.default;

  tabs.map((tab) => (
    tab.title === 'TMG'
    ? tab.status = true
    : tab.status = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.usuario ||{id:0, table_preferences: "id,avatar,name,tel,email,status"};
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const router = useRouter();
  const [users, setData] = useState<IUsers[]>(() => alItems);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderName, setOrderName] = useState<number>(0);
  const [orderEmail, setOrderEmail] = useState<number>(0);
  const [arrowName, setArrowName] = useState<any>('');
  const [arrowEmail, setArrowEmail] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterAplication);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Código", value: "id", defaultChecked: () => camposGerenciados.includes('id')},
    { name: "CamposGerenciados[]", title: "Avatar", value: "avatar", defaultChecked: () => camposGerenciados.includes('avatar')},
    { name: "CamposGerenciados[]", title: "Nome", value: "name", defaultChecked: () => camposGerenciados.includes('name') },
    { name: "CamposGerenciados[]", title: "E-mail", value: "email", defaultChecked: () => camposGerenciados.includes('email') },
    { name: "CamposGerenciados[]", title: "Telefone", value: "tel", defaultChecked: () => camposGerenciados.includes('tel') },
    { name: "CamposGerenciados[]", title: "Status", value: "status", defaultChecked: () => camposGerenciados.includes('status') }
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  
  const take: number = itensPerPage;
  const total: number = itemsTotal;
  const pages = Math.ceil(total / take);

  const columns = colums(camposGerenciados);
  
  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      let parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch;
      await userService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
        if (response.status == 200) {
          if (response.total > 0) {
            setTotaItems(response.total);
          }
          setFilter(parametersFilter);
          setData(response.response);
        }
      })
    },
  });

  const filters = [
    { id: 2, name: 'Todos'},
    { id: 1, name: 'Ativos'},
    { id: 0, name: 'Inativos'},
  ];

  function colums(camposGerenciados: any): any {
    let ObjetCampos: any = camposGerenciados.split(',');
    var arrOb: any = [];

    Object.keys(ObjetCampos).forEach((item) => {
      if (ObjetCampos[item] == 'id') {
        arrOb.push({ title: "Código", field: "id", sorting: false })
      }
      if (ObjetCampos[item] == 'avatar') {
        arrOb.push({
          title: "Avatar", 
          field: "avatar",
          sorting: false, 
          width: 0,
          exports: false,
          render: (rowData: IUsers) => (
            !rowData.avatar || rowData.avatar === '' ? (
              <FaRegUserCircle size={32} />
              ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={rowData.avatar} alt={rowData.name} style={{ width: 45, height: 43, borderRadius: 99999 }} />
            )
          )
        });
      } 
      if (ObjetCampos[item] == 'name') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowName }
              <button className='font-medium text-gray-900' onClick={() => handleOrderName('name', orderName)}>
                Nome
              </button>
            </div>
          ),
          field: "name",
          sorting: false
        },);
      }
      
      if (ObjetCampos[item] == 'email') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowEmail }
              <button className='font-medium text-gray-900' onClick={() => handleOrderEmail('email', orderEmail)}>
                E-mail
              </button>
            </div>
          ), 
          field: "email",
          sorting: false
        },);
      }
      if (ObjetCampos[item] == 'tel') {
        arrOb.push({ 
          title: "Telefone", 
          field: "tel", 
          sorting: false,
          render: (rowData: IUsers) => (
            handleFormatTel(rowData.tel)
          )
        })
      }
      if (ObjetCampos[item] == 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: IUsers) => (
            rowData.status ? (
              <div className='h-10 flex'>
                <div className="
                  h-10
                ">
                  <Button 
                    icon={<FaRegUserCircle size={16} />}
                    onClick={() =>{}}
                    bgColor="bg-yellow-500"
                    textColor="white"
                    href="perfil"
                  />
                </div>
                <div className="
                  h-10
                ">
                  <Button 
                    icon={<BiEdit size={16} />}
                    onClick={() =>{router.push(`/config/tmg/usuarios/atualizar?id=${rowData.id}`)}}
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
                    icon={<FaRegUserCircle size={16} />}
                    onClick={() =>{}}
                    bgColor="bg-yellow-500"
                    textColor="white"
                    href="perfil"
                  />
                </div>
                <div className="
                  h-10
                ">
                  <Button 
                    icon={<BiEdit size={16} />}
                    onClick={() =>{router.push(`/config/tmg/usuarios/atualizar?id=${rowData.id}`)}}
                    bgColor="bg-blue-600"
                    textColor="white"
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
      await userPreferencesService.create({table_preferences: campos,  userId: userLogado.id, module_id: 1 }).then((response) => {
        userLogado.preferences.usuario = {id: response.response.id, userId: preferences.userId, table_preferences: campos};
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.usuario = {id: preferences.id, userId: preferences.userId, table_preferences: campos};
      await userPreferencesService.update({table_preferences: campos, id: preferences.id});
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

    await userService.update({id: id, status: status});
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return;
    }

    setData((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = status;
      return copy;
    });
  };

  async function handleOrderEmail(column: string, order: string | any): Promise<void> {
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

    await userService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status == 200) {
        setData(response.response)
      }
    })
    if (orderEmail === 2) {
      setOrderEmail(0);
      setArrowEmail(<AiOutlineArrowDown />);
    } else {
      setOrderEmail(orderEmail + 1);
      if (orderEmail === 1) {
        setArrowEmail(<AiOutlineArrowUp />);
      } else {
        setArrowEmail('');
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

    await userService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status == 200) {
        setData(response.response)
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
    if (!result)  return;
    
    const items = Array.from(genaratesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGenaratesProps(items);
  };

  const downloadExcel = async(): Promise<void> => {
    if (filterAplication) {
      filterAplication += `&paramSelect=${camposGerenciados}`;
    }
    
    await userService.getAll(filterAplication).then((response) => {
      if (response.status == 200) {
        const newData = response.response.map((row: { avatar: any; status: any }) => {
          delete row.avatar;

          if (row.status === 0) {
            row.status = "Inativo";
          } else {
            row.status = "Ativo";
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "usuarios");
    
        // Buffer
        let buf = XLSX.write(workBook, {
          bookType: "xlsx", //xlsx || csv
          type: "buffer",
        });
        // Binary
        XLSX.write(workBook, {
          bookType: "xlsx", //xlsx || csv
          type: "binary",
        });
        // Download xlsx || csv
        XLSX.writeFile(workBook, "Usuários.xlsx");
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
    await userService.getAll(parametersFilter).then((response) => {
      if (response.status == 200) {
        setData(response.response);
      }
    });
  };

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage, pages]);

  return (
    <>
      <Head>
        <title>Listagem de usuários</title>
      </Head>
      <Content
        headerCotent={  
          <TabHeader data={tabs} dataDropDowns={tmgDropDown}  />
        }
      >
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar usuários">
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
                      placeholder="name ou email"
                      max="40"
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="h-16 w-32 mt-3">
                  <Button
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

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={users}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20
                },
                rowStyle: { background: '#f9fafb'},
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
                        title="Cadastrar usuário"
                        value="Cadastrar usuário"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {router.push('usuarios/cadastro')}}
                        icon={<FiUserPlus size={20} />}
                      />
                    </div>

                    <strong className='text-blue-600'>Total registrado: { itemsTotal }</strong>

                    <div className='h-full flex items-center gap-2
                    '>
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-64">
                          <AccordionFilter title='Gerenciar Campos' grid={statusAccordion}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId='characters'>
                                {
                                  (provided) => (
                                    <ul className="w-full h-full characters" { ...provided.droppableProps } ref={provided.innerRef}>
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais('')).response[0].itens_per_page;

  const  token  =  req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;

  let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = "filterStatus=1";
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const user = await fetch(urlParameters.toString(), requestOptions);
  let Response = await user.json();
  
  let alItems = Response.response;
  let totalItems = Response.total;

  return {
    props: {
      alItems,
      totalItems,
      itensPerPage,
      filterAplication
    },
  }
}
