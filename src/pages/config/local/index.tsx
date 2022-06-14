import { removeCookies, setCookies } from "cookies-next";
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
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiSettingsFill } from "react-icons/ri";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { localService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select
} from "../../../components";
import * as ITabs from '../../../shared/utils/dropdown';
import { getDegreesCelsius } from "../../../shared/utils/formatDegreesCelsius";



interface ILocalProps {
  id: Number | any;
  name_local_culture: String | any;
  cod_red_local: String | any;
  label_country: String | any;
  label_region: String | any;
  name_locality: String | any;
  adress: String | any;
  latitude: string;
  longitude: string;
  altitude: String | any;
  created_by: Number;
  status: Number;
};
interface IFilter {
  filterStatus: object | any;
  filterName_local_culture: string | any;
  filterLabel: string | any;
  filterAdress: string | any;
  filterLabel_country: string | any;
  filterLabel_region: string | any;
  filterName_locality: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenarateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  allItems: ILocalProps[];
  totalItems: Number;
  filter: string | any;
  itensPerPage: number | any;
  filterAplication: object | any;
  pageBeforeEdit: string | any
  filterBeforeEdit: string | any
}

export default function Listagem({ allItems, itensPerPage, filterAplication, totalItems, pageBeforeEdit, filterBeforeEdit }: Idata) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'LOCAL'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.local || { id: 0, table_preferences: "id, name_local_culture, label, mloc, adress, label_country, label_region, name_locality, status" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const label_regions: object | any = [];
  const [name_locality, setname_locality] = useState<object | any>([{ id: '0', name: 'selecione' }]);
  const [local, setLocal] = useState<ILocalProps[]>(() => allItems);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit)

  const [orderName, setOrderName] = useState<number>(0);
  const [orderAddress, setOrderAddress] = useState<number>(0);
  const [arrowName, setArrowName] = useState<any>('');
  const [arrowAddress, setArrowAddress] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterAplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito ", value: "id", defaultChecked: () => camposGerenciados.includes('id') },
    { name: "CamposGerenciados[]", title: "Nome do L. de Cult.", value: "name_local_culture", defaultChecked: () => camposGerenciados.includes('name_local_culture') },
    { name: "CamposGerenciados[]", title: "Rótulo", value: "label", defaultChecked: () => camposGerenciados.includes('label') },
    { name: "CamposGerenciados[]", title: "MLOC", value: "mloc", defaultChecked: () => camposGerenciados.includes('mloc') },
    { name: "CamposGerenciados[]", title: "Nome Fazenda", value: "adress", defaultChecked: () => camposGerenciados.includes('adress') },
    { name: "CamposGerenciados[]", title: "País", value: "label_country", defaultChecked: () => camposGerenciados.includes('label_country') },
    { name: "CamposGerenciados[]", title: "Região", value: "label_region", defaultChecked: () => camposGerenciados.includes('label_region') },
    { name: "CamposGerenciados[]", title: "Localidade", value: "name_locality", defaultChecked: () => camposGerenciados.includes('name_locality') },
    { name: "CamposGerenciados[]", title: "Status", value: "status", defaultChecked: () => camposGerenciados.includes('status') },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [selectedRowById, setSelectedRowById] = useState<number>();
  const [colorStar, setColorStar] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const columns = colums(camposGerenciados);


  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterName_local_culture: '',
      filterLabel: '',
      filterAdress: '',
      filterLabel_country: '',
      filterLabel_region: '',
      filterName_locality: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterName_local_culture,
      filterLabel,
      filterAdress,
      filterLabel_country,
      filterLabel_region,
      filterName_locality
    }) => {
      const parametersFilter = `filterStatus=${filterStatus ? filterStatus : 1}&filterName_local_culture=${filterName_local_culture}&filterLabel=${filterLabel}&filterAdress=${filterAdress}&filterLabel_country=${filterLabel_country}&filterLabel_region=${filterLabel_region}&filterName_locality=${filterName_locality}`

      setFiltersParams(parametersFilter)
      setCookies("filterBeforeEdit", filtersParams)
      await localService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setTotalItems(response.total)
        setLocal(response.response);
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

      if (ObjetCampos[item] === 'name_local_culture') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              {arrowName}
              <button className='font-medium text-gray-900' onClick={() => handleOrderName('name_local_culture', orderName)}>
                Nome do L. de Cult.
              </button>
            </div>
          ),
          field: "name_local_culture",
          sorting: false,
        });
      }

      if (ObjetCampos[item] === 'label') {
        arrOb.push({ title: "Rótulo", field: "label", sorting: false })
      }

      if (ObjetCampos[item] === 'adress') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              {arrowAddress}
              <button className='font-medium text-gray-900' onClick={() => handleOrderAddress('adress', orderAddress)}>
                Nome Fazenda
              </button>
            </div>
          ),
          field: "adress",
          sorting: false
        });
      }


      if (ObjetCampos[item] === 'mloc') {
        arrOb.push({ title: "MLOC", field: "mloc", sorting: false })
      }

      if (ObjetCampos[item] === 'label_country') {
        arrOb.push({ title: "País", field: "label_country", sorting: false })
      }

      if (ObjetCampos[item] === 'label_region') {
        arrOb.push({ title: "Região", field: "label_region", sorting: false })
      }

      if (ObjetCampos[item] === 'name_locality') {
        arrOb.push({ title: "Localidade", field: "name_locality", sorting: false })
      }

      if (ObjetCampos[item] === 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: ILocalProps) => (
            rowData.status ? (
              <div className='h-10 flex'>
                <div className="
                  h-10
                ">
                  <Button
                    icon={<BiEdit size={16} />}
                    title={`Atualizar ${rowData.adress}`}
                    onClick={() => {
                      setCookies("filterBeforeEdit", filtersParams)
                      setCookies("pageBeforeEdit", currentPage?.toString())
                      router.push(`/config/local/atualizar?id=${rowData.id}`)
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
                    title={`Atualizar ${rowData.adress}`}
                    onClick={() => {
                      setCookies("filterBeforeEdit", filtersParams)
                      setCookies("pageBeforeEdit", currentPage?.toString())
                      router.push(`/config/local/atualizar?id=${rowData.id}`)
                    }}
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 4 }).then((response) => {
        userLogado.preferences.local = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.local = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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

    await localService.update({ id: id, status: status });

    const index = local.findIndex((local) => local.id === id);

    if (index === -1) {
      return;
    }

    setLocal((oldUser) => {
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

    await localService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setLocal(response.response)
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

    await localService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setLocal(response.response)
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

    await localService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = local.map((row) => {
          if (row.status === 0) {
            row.status = "Inativo" as any;
          } else {
            row.status = "Ativo" as any;
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "locais");

        // buffer
        let blabel_region = XLSX.write(workBook, {
          bookType: "xlsx", //xlsx
          type: "buffer",
        });
        // Binary
        XLSX.write(workBook, {
          bookType: "xlsx", //xlsx
          type: "binary",
        });
        // Download
        XLSX.writeFile(workBook, "Locais.xlsx");
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
    const skip = currentPage * Number(take);
    let parametersFilter = "skip=" + skip + "&take=" + take;

    if (filter) {
      parametersFilter = parametersFilter + "&" + filter;
    }
    await localService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setLocal(response.response);
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
        <title>Listagem dos Locais</title>
      </Head>
      <Content contentHeader={tabsDropDowns}>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar locais">
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
                      Nome do L. de Cult.
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome"
                      id="filterName_local_culture"
                      name="filterName_local_culture"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Rótulo
                    </label>
                    <Input
                      type="text"
                      placeholder="Rótulo"
                      id="filterLabel"
                      name="filterLabel"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome da Fazenda
                    </label>
                    <Input
                      type="text"
                      placeholder="Fazenda"
                      id="filterAdress"
                      name="filterAdress"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      País
                    </label>
                    <Input
                      type="text"
                      placeholder="País"
                      id="filterLabel_country"
                      name="filterLabel_country"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Região
                    </label>
                    <Input
                      type="text"
                      placeholder="Região"
                      id="filterLabel_region"
                      name="filterLabel_region"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Localidade
                    </label>
                    <Input
                      type="text"
                      placeholder="Localidade"
                      id="filterName_locality"
                      name="filterName_locality"
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
              columns={columns}
              data={local}
              onRowClick={((evt?, selectedRow?: ILocalProps) => {
                setSelectedRowById(selectedRow?.id)
              })}
              options={{
                showTitle: false,
                search: false,
                filtering: false,
                pageSize: itensPerPage,
                rowStyle: (rowData: ILocalProps) => ({
                  backgroundColor: (selectedRowById === rowData.id ? '#c7e3f5' : '#fff')
                }),
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
                    {/* <div className='h-12'>
                      <Button 
                        title="Cadastrar Local"
                        value="Cadastrar Local"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {}}
                        href="local/cadastro"
                        icon={<FiUserPlus size={20} />}
                      />
                    </div> */}
                    <div className='h-12'>
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="local/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
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
                        <Button title="Exportar planilha de locais" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
                      </div>
                      <div className='h-12 flex items-center justify-center w-full'>
                        <Button icon={<RiSettingsFill size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { }} href="local/importar-planilha/config-planilha" />
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 15;

  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : "filterStatus=1";

  const token = req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/local`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  let filterAplication = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : "filterStatus=1"

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
  const response = await local.json();
  const allItems = response.response;
  const totalItems = response.total;

  return {
    props: {
      allItems,
      totalItems,
      itensPerPage,
      filterAplication,
      pageBeforeEdit,
      filterBeforeEdit
    },
  }
}
