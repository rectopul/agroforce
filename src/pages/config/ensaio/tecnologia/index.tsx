/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { useRouter } from 'next/router';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  tecnologiaService,
  userPreferencesService,
} from '../../../../services';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  FieldItemsPerPage,
  ManageFields,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';
import { perm_can_do } from '../../../../shared/utils/perm_can_do';

interface ITecnologiaProps {
  id: number | any;
  name: string | any;
  created_by: number;
}

interface IFilter {
  filterName: string;
  filterDescription: string;
  filterCode: string;
  orderBy: string;
  typeOrder: string;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  allItems: ITecnologiaProps[];
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  idCulture: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string;
  orderByserver: any | string;
  safraId: any | string;
}

export default function Listagem({
  allItems,
  itensPerPage,
  filterApplication,
  totalItems,
  idCulture,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
  safraId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);
  const { TabsDropDowns } = ITabs.default;

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns('config');

  // eslint-disable-next-line no-return-assign
  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'tecnologia';
  const module_name = 'tecnologia';
  const module_id = 8;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,name,desc,cod_tec';
  const preferencesDefault = {
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  };

  const [preferences, setPreferences] = useState<any>(
    userLogado.preferences[identifier_preference] || preferencesDefault,
  );

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [tecnologias, setTecnologias] = useState<ITecnologiaProps[]>(
    () => allItems,
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito ',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome',
      value: 'name',
      defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Descrição ',
      value: 'desc',
      defaultChecked: () => camposGerenciados.includes('desc'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Cod Tec',
      value: 'cod_tec',
      defaultChecked: () => camposGerenciados.includes('cod_tec'),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const formik = useFormik<IFilter>({
    initialValues: {
      filterName: checkValue('filterName'),
      filterDescription: checkValue('filterName'),
      filterCode: checkValue('filterName'),
      orderBy: '',
      typeOrder: '',
    },

    onSubmit: async ({ filterName, filterDescription, filterCode }) => {
      const parametersFilter = `&filterName=${filterName}&filterDescription=${filterDescription}&filterCode=${filterCode}&id_culture=${idCulture}&id_safra=${safraId}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
      // await tecnologiaService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setTecnologias(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);

    // parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await tecnologiaService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setTecnologias(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao buscar tecnologia',
          html: `Ocorreu um erro ao buscar tecnologia. Tente novamente mais tarde.`,
          width: '800',
        });
      });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
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
    // if (filter && typeof (filter) !== 'undefined') {
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

    // await tecnologiaService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setTecnologias(response.response);
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

    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(columnG);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    typeOrderG !== '' ? (typeOrderG == 'desc' ? setOrder(1) : setOrder(2)) : '';
    setArrowOrder(arrowOrder);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }

  // function headerTableFactory(name: any, title: string) {
  //   return {
  //     title: (
  //       <div className="flex items-center">
  //         <button
  //           type="button"
  //           className="font-medium text-gray-900"
  //           onClick={() => handleOrder(title, orderList)}
  //         >
  //           {name}
  //         </button>
  //       </div>
  //     ),
  //     field: title,
  //     sorting: true,
  //   };
  // }

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

  function colums(columnOrder: any): any {
    const columnCampos: any = columnOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item: any) => {
      // if (columnCampos[item] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[item] === 'name') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome',
            title: 'name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'desc') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Descrição',
            title: 'desc',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'cod_tec') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Cod Tec',
            title: 'cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
    });
    return tableFields;
  }

  const columns = colums(camposGerenciados);

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
          module_id: 8,
        })
        .then((response) => {
          userLogado.preferences.ogm = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.ogm = {
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
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await tecnologiaService.getAll(filterParam).then(({ status, response }) => {
      if (!response.A1) {
        Swal.fire('Nenhum dado para extrair');
        return;
      }
      if (status === 200) {
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, 'Tecnologias');

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
        XLSX.writeFile(workBook, 'Tecnologias.xlsx');
      } else {
        Swal.fire('Não existem registros para serem exportados, favor checar.');
      }
    });
    setLoading(false);
  };

  // manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(page: any): Promise<void> {
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
    // await tecnologiaService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setTecnologias(response.response);
    //   }
    // });

    await callingApi(filter, page); // handle pagination globly
  }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams,
    );
    return parameter;
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem de Tecnologias</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >
          <AccordionFilter
            title="Filtrar tecnologias"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
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
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome"
                      id="filterName"
                      defaultValue={checkValue('filterName')}
                      name="filterName"
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Descrição
                    </label>
                    <Input
                      type="text"
                      placeholder="Descrição"
                      id="filterDescription"
                      name="filterDescription"
                      defaultValue={checkValue('filterDescription')}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Cod Tec
                    </label>
                    <Input
                      size={7}
                      type="text"
                      placeholder="Cod. tecnologia"
                      id="filterCode"
                      name="filterCode"
                      defaultValue={checkValue('filterCode')}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      onClick={() => {
                        setLoading(true);
                      }}
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

          {/* overflow-y-scroll */}
          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={tecnologias}
              options={{
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 400 : 320
                }px)`,
                headerStyle: {
                  zIndex: 1,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
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
                    {/* <div className="h-12" /> */}
                    <div className="h-12">
                      <Button
                        title="Importar"
                        value="Importar"
                        bgColor="bg-blue-600"
                        textColor="white"
                        style={{ display: !perm_can_do('/listas/rd', 'import') ? 'none' : '' }}
                        onClick={() => {
                          window.open('/listas/rd?importar=rd', '_blank');
                        }}
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div
                      className="h-full flex items-center gap-2
                    "
                    >
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <ManageFields
                          statusAccordionExpanded={false}
                          generatesPropsDefault={generatesProps}
                          camposGerenciadosDefault={camposGerenciadosDefault}
                          preferences={preferences}
                          preferencesDefault={preferencesDefault}
                          userLogado={userLogado}
                          label="Gerenciar Campos"
                          table={table}
                          module_name={module_name}
                          module_id={module_id}
                          identifier_preference={identifier_preference}
                          OnSetStatusAccordion={(e: any) => {
                            setStatusAccordion(e);
                          }}
                          OnSetGeneratesProps={(e: any) => {
                            setGeneratesProps(e);
                          }}
                          OnSetCamposGerenciados={(e: any) => {
                            setCamposGerenciados(e);
                          }}
                          OnColumnsOrder={(e: any) => {
                            colums(e);
                          }}
                          OnSetUserLogado={(e: any) => {
                            setUserLogado(e);
                          }}
                          OnSetPreferences={(e: any) => {
                            setPreferences(e);
                          }}
                        />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de tecnologias"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                        {/* <Button
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            router.push('tecnologia/importar-planilha/config-planilha');
                          }}
                        /> */}
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
                      onClick={() => handlePagination(0)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage < 1}
                    />
                    <Button
                      onClick={() => handlePagination(currentPage - 1)}
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
                          onClick={() => handlePagination(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))}
                    <Button
                      onClick={() => handlePagination(currentPage + 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiRightArrow size={15} />}
                      disabled={currentPage + 1 >= pages}
                    />
                    <Button
                      onClick={() => handlePagination(pages - 1)}
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';
  const idCulture = req.cookies.cultureId;
  const { token } = req.cookies;
  const { safraId } = req.cookies;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'tecnologia') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('urlPage', { req, res });
  }

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'asc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'cod_tec';

  const param = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${safraId}`;
  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `&id_culture=${idCulture}&id_safra=${safraId}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  // RR
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/tecnologia`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const response = await fetch(urlParameters.toString(), requestOptions);
  const { response: allItems, total: totalItems } = await response.json();

  return {
    props: {
      allItems,
      totalItems,
      itensPerPage,
      filterApplication,
      idCulture,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
      safraId,
    },
  };
};
