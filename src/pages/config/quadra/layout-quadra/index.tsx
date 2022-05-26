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
import { BsDownload } from "react-icons/bs";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiSettingsFill } from "react-icons/ri";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { layoutQuadraService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

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

interface IFilter{
  filterStatus: object | any;
  filterCodigo: string | any;
  filterEsquema: string | any;
  filterTiros: string | any;
  filterDisparos: string | any;
  filterPlantadeira: string | any;
  filterParcelas: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenarateProps {
  name: string | undefined;
  title:  string | number | readonly string[] | undefined;
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

export default function Listagem({ allItems, itensPerPage, filterAplication, totalItems, local}: Idata) {
  const { TabsDropDowns } = ITabs.default;
  
  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'QUADRAS'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.layout_quadra ||{id:0, table_preferences: "id,esquema,plantadeira,tiros,disparos,parcelas, status"};
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [quadras, setQuadra] = useState<ILayoultProps[]>(() => allItems);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderName, setOrderName] = useState<number>(0);
  const [orderAddress, setOrderAddress] = useState<number>(0);
  const [arrowName, setArrowName] = useState<any>('');
  const [arrowAddress, setArrowAddress] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterAplication);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);

  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Código ", value: "id", defaultChecked: () => camposGerenciados.includes('id') },
    { name: "CamposGerenciados[]", title: "Esquema ", value: "esquema", defaultChecked: () => camposGerenciados.includes('esquema') },
    { name: "CamposGerenciados[]", title: "Plantadeira ", value: "plantadeira", defaultChecked: () => camposGerenciados.includes('local') },
    { name: "CamposGerenciados[]", title: "Tiros", value: "tiros", defaultChecked: () => camposGerenciados.includes('divisor') },
    { name: "CamposGerenciados[]", title: "Disparos", value: "disparos", defaultChecked: () => camposGerenciados.includes('disparos') },
    { name: "CamposGerenciados[]", title: "Parcelas", value: "parcelas", defaultChecked: () => camposGerenciados.includes('largura') },
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
      filterCodigo: '',
      filterEsquema: '',
      filterDisparos: '',
      filterTiros: '',
      filterPlantadeira: '',
      filterParcelas: '',
      orderBy: '',
      typeOrder: '',
    },  
    onSubmit: async (values) => {
      let parametersFilter = "&filterStatus=" + values.filterStatus + "&filterEsquema=" + values.filterEsquema + "&filterDisparos=" + values.filterDisparos + "&filterTiros=" + values.filterTiros + "&filterPlantadeira=" + values.filterPlantadeira + "&filterParcelas=" + values.filterParcelas;
      await layoutQuadraService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
          setTotaItems(response.total);
          setFilter(parametersFilter);
          setQuadra(response.response);
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
      
      if (ObjetCampos[item] == 'id') {
        arrOb.push({ title: "Código", field: "id", sorting: false })
      }
      if (ObjetCampos[item] == 'esquema') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowName }
              <button className='font-medium text-gray-900' onClick={() => handleOrderName('esquema', orderName)}>
                Esquema
              </button>
            </div>
          ),
          field: "esquema",
          sorting: false
        },);
      }
  
      if (ObjetCampos[item] == 'local') {
        arrOb.push({ title: "Local", field: "local", sorting: false })
      }
      
      if (ObjetCampos[item] == 'plantadeira') {
        arrOb.push({ title: "Plantadeira", field: "plantadeira", sorting: false })
      }

      if (ObjetCampos[item] == 'tiros') {
        arrOb.push({ title: "Tiros", field: "tiros", sorting: false })
      }

      if (ObjetCampos[item] == 'disparos') {
        arrOb.push({ title: "Disparos", field: "disparos", sorting: false })
      }

      if (ObjetCampos[item] == 'parcelas') {
        arrOb.push({ title: "Parcelas", field: "parcelas", sorting: false })
      }

      if (ObjetCampos[item] == 'status') {
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
                    onClick={() =>{}}
                    bgColor="bg-blue-600"
                    textColor="white"
                    href={`layout-quadra/atualizar?id=${rowData.id}`}
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
                    onClick={() =>{}}
                    bgColor="bg-blue-600"
                    textColor="white"
                    href={`layout-quadra/atualizar?id=${rowData.id}`}
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
      await userPreferencesService.create({table_preferences: campos,  userId: userLogado.id, module_id: 5 }).then((response) => {
        userLogado.preferences.layout_quadra = {id: response.response.id, userId: preferences.userId, table_preferences: campos};
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.layout_quadra = {id: preferences.id, userId: preferences.userId, table_preferences: campos};
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
    await layoutQuadraService.update({id: id, status: status});
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

    await layoutQuadraService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status == 200) {
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

    await layoutQuadraService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status == 200) {
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
    
    await layoutQuadraService.getAll(filterAplication).then((response) => {
      if (response.status == 200) {
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
      if (response.status == 200) {
        setQuadra(response.response);
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
        <title>Listagem dos Layout</title>
      </Head>
      <Content contentHeader={tabsDropDowns}>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar">
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
                      Esquema
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Esquema"
                      max="40"
                      id="filterEsquema"
                      name="filterEsquema"
                      onChange={formik.handleChange}
                    />
                  </div>
                  {/* <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Plantadeiras
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Plantadeiras"
                      max="40"
                      id="filterPlantadeira"
                      name="filterPlantadeira"
                      onChange={formik.handleChange}
                    />
                  </div> */}
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Tiros
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Tiros"
                      max="40"
                      id="filterTiros"
                      name="filterTiros"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Disparos
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Disparos"
                      max="40"
                      id="filterDisparos"
                      name="filterDisparos"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Numero Parcelas
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Parcelas"
                      max="40"
                      id="filterParcelas"
                      name="filterParcelas"
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
              data={quadras}
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
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {}}
                        href="layout-quadra/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
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
                        <Button title="Download lista de layout quadra" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {downloadExcel()}} />
                      </div>
                      <div className='h-12 flex items-center justify-center w-full'>
                          <Button icon={<RiSettingsFill size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {}} href="layout-quadra/importar-planilha/config-planilha"  />
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 10;
  const  token  =  req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/layout-quadra`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const filterAplication = "filterStatus=1";
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const layout = await fetch(urlParameters.toString(), requestOptions);
  const Response =  await layout.json();
  const allItems = Response.response;
  const totalItems = Response.total;
  return {
    props: {
      allItems,
      totalItems,
      itensPerPage,
      filterAplication
    },
  }
}