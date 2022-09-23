/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import router from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp, FaSearchPlus } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { userPreferencesService } from '../../../../services';
import { focoService } from '../../../../services/foco.service';
import ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
  filterGroupFrom: string | number;
  filterGroupTo: string | number;
}

export interface IFocos {
  id: number;
  name: string;
  group?: [];
  tableData?: [];
  status?: any;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allFocos: IFocos[];
  totalItems: number;
  itensPerPage: number;
  cultureId: number;
  safraId: number;
  filterApplication: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer :any| string,
  orderByserver : any |string
}

export default function Listagem({
  allFocos,
  totalItems,
  itensPerPage,
  cultureId,
  safraId,
  filterApplication,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer, 
  orderByserver 
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.foco || {
    id: 0,
    table_preferences: 'id,name,group,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [focos, setFocos] = useState<IFocos[]>(() => allFocos);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Nome', value: 'name' },
    { name: 'CamposGerenciados[]', title: 'Grupo', value: 'group' },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');

  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy,setOrderBy]=useState<string>(orderByserver); //RR
  const [typeOrder,setTypeOrder]=useState<string>(typeOrderServer); //RR
  const pathExtra=`skip=${currentPage * Number(take)}&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;  //RR

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterSearch: checkValue('filterSearch'),
      orderBy: '',
      typeOrder: '',
      filterGroupTo:  checkValue('filterGroupTo'),
      filterGroupFrom:  checkValue('filterGroupFrom'),
    },
    onSubmit: async ({
      filterStatus, filterSearch, filterGroupTo, filterGroupFrom,
    }) => {
      // const parametersFilter = `filterStatus=${filterStatus || 1
      // }&filterSearch=${filterSearch}&filterGroupTo=${filterGroupTo}&filterGroupFrom=${filterGroupFrom}&id_culture=${cultureId}&id_safra=${safraId}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
      // await focoService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setFocos(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });

      const parametersFilter = `filterStatus=${filterStatus || 1
      }&filterSearch=${filterSearch}&filterGroupTo=${filterGroupTo}&filterGroupFrom=${filterGroupFrom}&id_culture=${cultureId}`;
      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter); 
    },
  });


  //Calling common API 
  async function callingApi(parametersFilter : any ){

    setCookies("filterBeforeEdit", parametersFilter);
    setCookies("filterBeforeEditTypeOrder", typeOrder);
    setCookies("filterBeforeEditOrderBy", orderBy);  
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies("filtersParams", parametersFilter);

    await focoService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400 ) {
        setFocos(response.response);
        setTotalItems(response.total);
      }
    });
  } 

  //Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleStatus(idFoco: number, data: any): Promise<void> {
    const parametersFilter = `filterStatus=${1}&id_culture=${cultureId}&filterSearch=${data.name}`;
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }
    await focoService.getAll(parametersFilter).then(async ({ status }) => {
      if (status === 200 && data.status === 1) {
        Swal.fire('Já existe um registro ativo com esse nome na tabela foco. \n Favor inativar o registro antes de executar a ação.');
        return;
      }
      await focoService.update({ id: idFoco, status: data.status });
      const index = focos.findIndex((foco) => foco.id === idFoco);

      if (index === -1) {
        return;
      }

      setFocos((oldFocos) => {
        const copy = [...oldFocos];
        copy[index].status = data.status;
        return copy;
      });
    });
  }

  async function handleOrder(
    column: string,
    order: string | any,
  ): Promise<void> {
    // let typeOrder: any;
    // let parametersFilter: any;
    // if (order === 1) {
    //   typeOrder = 'asc';
    // } else if (order === 2) {
    //   typeOrder = 'desc';
    // } else {
    //   typeOrder = '';
    // }
    // setOrderBy(column);
    // setOrderType(typeOrder);
    // if (filter && typeof filter !== 'undefined') {
    //   if (typeOrder !== '') {
    //     parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
    //   } else {
    //     parametersFilter = filter;
    //   }
    // } else if (typeOrder !== '') {
    //   parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    // } else {
    //   parametersFilter = filter;
    // }

    // await focoService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setFocos(response.response);
    //     }
    //   });
    // if (orderList === 2) {
    //   setOrder(0);
    //   setArrowOrder(<AiOutlineArrowDown />);
    // } else {
    //   setOrder(orderList + 1);
    //   if (orderList === 1) {
    //     setArrowOrder(<AiOutlineArrowUp />);
    //   } else {
    //     setArrowOrder('');
    //   }
    // }

      //Gobal manage orders
      const {typeOrderG, columnG, orderByG, arrowOrder} = await tableGlobalFunctions.handleOrderG(column, order , orderList);

      setTypeOrder(typeOrderG);
      setOrderBy(columnG);
      setOrder(orderByG);
      setArrowOrder(arrowOrder);

  }

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button
            type="button"
            className="font-medium text-gray-900"
            onClick={() => handleOrder(title, orderList)}
          >
            {name}
          </button>
        </div>
      ),
      field: title,
      sorting: true,
    };
  }

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (colorStar === '#eba417' ? (
        <div className="h-9 flex">

          <div>
            <button
              type="button"
              className="w-full h-full flex items-center justify-center border-0"
              onClick={() => setColorStar('')}
            >
              <AiTwotoneStar size={20} color="#eba417" />

            </button>
          </div>
        </div>
      ) : (
        <div className="h-9 flex">
          <div>
            <button
              type="button"
              className="w-full h-full flex items-center justify-center border-0"
              onClick={() => setColorStar('#eba417')}
            >
              <AiTwotoneStar size={20} />

            </button>
          </div>
        </div>
      )),
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Status',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: any) => (rowData.status ? (
        <div className="h-7 flex">
          <div className="h-7" />
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.name}`}
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                setCookies("filterBeforeEditTypeOrder", typeOrder);
                setCookies("filterBeforeEditOrderBy", orderBy);
                setCookies("filtersParams", filtersParams);
                setCookies("lastPage", "atualizar");
                router.push(
                  `/config/ensaio/foco/atualizar?id=${rowData.id}`,
                );
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div style={{ width: 5 }} />
          <div>
            <Button
              icon={<FaRegThumbsUp size={14} />}
              title="Ativo"
              onClick={async () => handleStatus(rowData.id, {
                status: rowData.status,
                ...rowData,
              })}
              bgColor="bg-green-600"
              textColor="white"
            />
          </div>
        </div>
      ) : (
        <div className="h-7 flex">
          <div
            className="h-7"
          />
          <div className="h-7">

            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.name}`}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filtersParams);
                router.push(
                  `/config/ensaio/foco/atualizar?id=${rowData.id}`,
                );
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div style={{ width: 5 }} />
          <div>
            <Button
              icon={<FaRegThumbsDown size={14} />}
              title="Inativo"
              onClick={async () => handleStatus(rowData.id, {
                status: rowData.status,
                ...rowData,
              })}
              bgColor="bg-red-800"
              textColor="white"
            />
          </div>
        </div>
      )),
    };
  }

  function columnsOrder(columnsCampos: string) {
    const columnOrder: string[] = columnsCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      // if (columnOrder[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnOrder[index] === 'name') {
        tableFields.push(headerTableFactory('Nome', 'name'));
      }
      if (columnOrder[index] === 'group') {
        tableFields.push(headerTableFactory('Grupo', 'group.group'));
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("type='checkbox'");
    let selecionados = '';
    for (let i = 0; i < els.length; i += 1) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0) {
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id: 6,
        })
        .then((response) => {
          userLogado.preferences.foco = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.foco = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
      };
      await userPreferencesService.update({
        table_preferences: campos,
        id: preferences.id,
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    setStatusAccordion(false);
    setCamposGerenciados(campos);
  }

  function handleOnDragEnd(result: DropResult) {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    await focoService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((row: any) => {
          if (row.status === 0) {
            row.status = 'Inativo' as any;
          } else {
            row.status = 'Ativo' as any;
          }
          console.log(row);
          row.NOME = row?.name;
          row.GRUPO = row?.group.group;
          row.STATUS = row?.status;

          delete row.name;
          delete row.group;
          delete row.status;
          delete row.id_culture;
          delete row.tableData;
          delete row.id;

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'focos');

        // Buffer
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'buffer',
        });
        // Binary
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'binary',
        });
        // Download
        XLSX.writeFile(workBook, 'Focos.xlsx');
      }
    });
  };

  //manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(): Promise<void> {
    // const skip = currentPage * Number(take);
    // let parametersFilter;
    // if (orderType) {
    //   parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    // } else {
    //   parametersFilter = `skip=${skip}&take=${take}`;
    // }

    // if (filter) {
    //   parametersFilter = `${parametersFilter}&${filter}`;
    // }

    // await focoService.getAll(parametersFilter).then(({ status, response }) => {
    //   if (status === 200) {
    //     setFocos(response);
    //   }
    // });

    await callingApi(filter); //handle pagination globly
  }


  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(value , filtersParams);
    return parameter;
  }

  function filterFieldFactoryGroup(name: any) {
    return (
      <div className="h-6 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <div className="flex gap-2">
          <div className="w-full">
            <Input
              type="text"
              placeholder="De"
              max="40"
              id="filterGroupFrom"
              name="filterGroupFrom"
              defaultValue={checkValue('filterGroupFrom')}
              onChange={formik.handleChange}
            />
          </div>
          <div className="w-full">
            <Input
              type="text"
              placeholder="Até"
              max="40"
              id="filterGroupTo"
              name="filterGroupTo"
              defaultValue={checkValue('filterGroupTo')}
              onChange={formik.handleChange}
            />
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de focos</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar focos">
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-4
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-2
                "
                >
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      // defaultValue={filterStatusBeforeEdit[13]}
                      values={filtersStatusItem.map((id) => id)}
                      defaultValue={checkValue('filterStatus')}
                      selected="1"
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome"
                      max="40"
                      id="filterSearch"
                      name="filterSearch"
                      defaultValue={checkValue('filterSearch')}
                      onChange={formik.handleChange}
                    />
                  </div>

                  {filterFieldFactoryGroup('Faixa de grupos')}

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
                    <Button
                      onClick={() => { }}
                      value="Filtrar"
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiFilterAlt size={20} />}
                    />
                  </div>
                </div>

              </form>
            </div>
          </AccordionFilter>

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={focos}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
              }}
              components={{
                Toolbar: () => (
                  <div
                    className="w-full max-h-96
                    flex
                    items-center
                    justify-between
                    gap-4
                    bg-gray-50
                    py-2
                    px-5
                    border-solid border-b
                    border-gray-200
                  "
                  >
                    <div className="h-12">
                      <Button
                        title="Cadastrar Foco"
                        value="Cadastrar Foco"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="foco/cadastro"
                        icon={<FaSearchPlus size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
                          <AccordionFilter
                            title="Gerenciar Campos"
                            grid={statusAccordion}
                          >
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {(provided) => (
                                  <ul
                                    className="w-full h-full characters"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    <div className="h-8 mb-3">
                                      <Button
                                        value="Atualizar"
                                        bgColor="bg-blue-600"
                                        textColor="white"
                                        onClick={getValuesColumns}
                                        icon={<IoReloadSharp size={20} />}
                                      />
                                    </div>
                                    {generatesProps.map((generate, index) => (
                                      <Draggable
                                        key={index}
                                        draggableId={String(generate.title)}
                                        index={index}
                                      >
                                        {(provider) => (
                                          <li
                                            ref={provider.innerRef}
                                            {...provider.draggableProps}
                                            {...provider.dragHandleProps}
                                          >
                                            <CheckBox
                                              name={generate.name}
                                              title={generate.title?.toString()}
                                              value={generate.value}
                                              defaultChecked={camposGerenciados.includes(
                                                generate.value as string,
                                              )}
                                            />
                                          </li>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </ul>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </AccordionFilter>
                        </div>
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de focos"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ),
                Pagination: (props) => (
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
                      onClick={() => setCurrentPage(0)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage < 1}
                    />
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiLeftArrow size={15} />}
                      disabled={currentPage <= 0}
                    />
                    {Array(1)
                      .fill('')
                      .map((value, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))}
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiRightArrow size={15} />}
                      disabled={currentPage + 1 >= pages}
                    />
                    <Button
                      onClick={() => setCurrentPage(pages-1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdLastPage size={18} />}
                      disabled={currentPage + 1 >= pages}
                    />
                  </div>
                  ) as any,
              }}
            />
          </div>
        </main>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  const { token } = req.cookies;
  const { safraId } = req.cookies;
  const { cultureId } = req.cookies;

  //Last page
  const lastPageServer = req.cookies.lastPage
  ? req.cookies.lastPage
  : "No";

  if(lastPageServer == undefined || lastPageServer == "No"){
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("lastPage", { req, res });  
  }

  
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    :`filterStatus=1&id_culture=${cultureId}`;



  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/foco`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1&id_culture=${cultureId}`;

  //RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
  ? req.cookies.filterBeforeEditTypeOrder
  : "desc";
       
  //RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
  ? req.cookies.filterBeforeEditOrderBy
  : "name";


  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("lastPage", { req, res });  

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allFocos, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allFocos,
      totalItems,
      itensPerPage,
      cultureId,
      safraId,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver, 
      typeOrderServer,  
    },
  };
};
