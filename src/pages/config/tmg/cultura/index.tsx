/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */

import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { removeCookies, setCookies } from "cookies-next";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiPlantLine } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { tableGlobalFunctions } from 'src/helpers';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { cultureService, userPreferencesService } from '../../../../services';
import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface ICulture {
  id: number;
  name: string;
  desc: string;
  status?: number;
  created_by?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allCultures: ICulture[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string, //RR
  orderByserver: any | string //RR
}

export default function Listagem({
      allCultures,
      totalItems,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      typeOrderServer, //RR
      orderByserver //RR
    }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.cultura || {
    id: 0,
    table_preferences: 'id,name,desc,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [cultures, setCultures] = useState<ICulture[]>(() => allCultures);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: 'CamposGerenciados[]',
      title: 'Código Reduzido',
      value: 'name',
      defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome',
      value: 'desc',
      defaultChecked: () => camposGerenciados.includes('desc'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver); //RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); //RR
  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;  //RR


  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterSearch: checkValue('filterSearch'),
      orderBy: '',
      typeOrder: ''
    },
    onSubmit: async ({ filterStatus, filterSearch }) => {

      const parametersFilter = `filterStatus=${filterStatus}&filterSearch=${filterSearch}`;

      setFilter(parametersFilter);
      setCurrentPage(0);

      await callingApi(parametersFilter);
    },
  });

  //Calling common API 
  async function callingApi(parametersFilter: any) {

    setCookies("filterBeforeEdit", parametersFilter);
    setCookies("filterBeforeEditTypeOrder", typeOrder);
    setCookies("filterBeforeEditOrderBy", orderBy);

    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies("filtersParams", parametersFilter);

    await cultureService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400) {
        setCultures(response.response);
        setTotalItems(response.total);
      }
    });
  }


  //Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleStatusCulture(
    idCulture: number,
    data: ICulture,
  ): Promise<void> {
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }

    const index = cultures.findIndex((culture) => culture.id === idCulture);

    if (index === -1) {
      return;
    }

    setCultures((oldCulture) => {
      const copy = [...oldCulture];
      copy[index].status = data.status;
      return copy;
    });

    const {
      id, name, desc, status,
    } = cultures[index];

    await cultureService.updateCulture({
      id,
      name,
      desc,
      status,
      created_by: Number(userLogado.id),
    });
  }

  async function handleOrder(
    column: string,
    order: string | any,
  ): Promise<void> {
    // // Manage orders of colunms
    // const parametersFilter = await tableGlobalFunctions.handleOrderGlobal(column, order, filter, 'safra');

    // const value = await tableGlobalFunctions.skip(currentPage, parametersFilter);

    // await cultureService
    //   .getAll(value)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setCultures(response.response);
    //       setFiltersParams(parametersFilter);
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
    const { typeOrderG, columnG, orderByG, arrowOrder } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

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
      render: (rowData: ICulture) => (
        <div className="h-7 flex">
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
                localStorage.setItem('filterValueEdit', filtersParams);
                localStorage.setItem('pageBeforeEdit', currentPage?.toString());
                router.push(`/config/tmg/cultura/atualizar?id=${rowData.id}`);
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div style={{ width: 5 }} />
          {rowData.status ? (
            <div className="h-7">
              <Button
                title="Ativo"
                icon={<FaRegThumbsUp size={14} />}
                onClick={async () => handleStatusCulture(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
          ) : (
            <div className="h-7">
              <Button
                title="Inativo"
                icon={<FaRegThumbsDown size={14} />}
                onClick={async () => handleStatusCulture(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                bgColor="bg-red-800"
                textColor="white"
              />
            </div>
          )}
        </div>
      ),
    };
  }

  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'name') {
        tableFields.push(headerTableFactory('Código reduzido', 'name'));
      }
      if (columnCampos[index] === 'desc') {
        tableFields.push(headerTableFactory('Nome', 'desc'));
      }
      if (columnCampos[index] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });

    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'");
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
          module_id: 2,
        })
        .then((response) => {
          userLogado.preferences.cultura = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.cultura = {
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

  function handleOnDragEnd(result: DropResult): void {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    await cultureService
      .getAll(filter)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((row: any) => {
            if (row.status === 0) {
              row.status = 'Inativo' as any;
            } else {
              row.status = 'Ativo' as any;
            }
            row.COD_REDUZIDO = row.name;
            row.NOME = row.desc;
            row.STATUS = row.status;

            delete row.desc;
            delete row.status;
            delete row.name;
            delete row.id;
            return row;
          });

          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, 'cultures');

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
          XLSX.writeFile(workBook, 'Culturas.xlsx');
        }
      });
  };

  //manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
    // else if (currentPage >= pages) {
    //   setCurrentPage(pages - 1);
    //   console.log("inside....")
    // }
  }

  async function handlePagination(): Promise<void> {
    // // manage using comman function
    // const { parametersFilter, currentPages } = await tableGlobalFunctions.handlePaginationGlobal(currentPage, take, filtersParams);

    // await cultureService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setCultures(response.response);
    //     setTotalItems(response.total); // Set new total records
    //     setCurrentPage(currentPages); // Set new current page
    //     setTimeout(removestate, 3000); // Remove State
    //   }
    // });

    await callingApi(filter); //handle pagination globly
  }


  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(value, filtersParams);
    return parameter;
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de culturas</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar culturas">
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
                  pb-0
                "
                >
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      // defaultValue={checkValue('filterStatus')}
                      defaultValue={filterStatusBeforeEdit[13]}
                      values={filtersStatusItem.map((id) => id)}
                      selected="1"
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="cultura"
                      max="40"
                      defaultValue={checkValue('filterSearch')}
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
                    <Button
                      type="submit"
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
              data={cultures}
              options={{
                sorting: true,
                showTitle: true,
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
                        title="Cadastrar cultura"
                        value="Cadastrar cultura"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {
                          router.push('cultura/cadastro');
                        }}
                        href="cultura/cadastro"
                        icon={<RiPlantLine size={20} />}
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
                                                generate.value,
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
                          title="Exportar planilha de culturas"
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
                      disabled={currentPage <= 1}
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
                      onClick={() => setCurrentPage(pages - 1)}
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
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 10;

  const { token } = req.cookies;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';

  const filterApplication = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';

  //Last page
  const lastPageServer = req.cookies.lastPage
    ? req.cookies.lastPage
    : "No";

  if(lastPageServer == undefined || lastPageServer == "No"){
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("filtersParams", { req, res });
    removeCookies("lastPage", { req, res });
  }

  //RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "desc";

  //RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "name";

  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('filterBeforeEdit', { req, res });

  //RR
  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("lastPage", { req, res });
  removeCookies("filtersParams", { req, res });


  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const cultures = await fetch(urlParameters.toString(), requestOptions);
  const { response: allCultures, total: totalItems } = await cultures.json();

  return {
    props: {
      allCultures,
      totalItems,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver, //RR
      typeOrderServer,  //RR
    },
  };
};
