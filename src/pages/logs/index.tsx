import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
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
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { removeCookies, setCookies } from 'cookies-next';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { BsTrashFill } from 'react-icons/bs';
import { reporteService, userPreferencesService } from 'src/services';
import moment from 'moment';
import { UserPreferenceController } from '../../controllers/user-preference.controller';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ButtonDeleteConfirmation,
  SelectMultiple,
} from '../../components';
import * as ITabs from '../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../helpers';
import headerTableFactoryGlobal from '../../shared/utils/headerTableFactory';
import ComponentLoading from '../../components/Loading';
import { functionsUtils } from '../../shared/utils/functionsUtils';

interface IFilter {
  filterMadeBy: object | any;
  filterStartDate: string | any;
  filterEndDate: string | any;
  filterModule: string | any;
  filterOperation: string | any;
  filterValue: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

export default function Listagem({
  allReportes,
  itensPerPage,
  filterApplication,
  filterBeforeEdit,
  totalItems,
  typeOrderServer,
  orderByserver,
  safraId,
  idCulture,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const { tabsReport } = ITabs.default;

  const tabsDropDowns = tabsReport.map((i) => (i.titleTab === 'Logs' ? { ...i, statusTab: true } : i));

  const tableRef = useRef<any>(null);

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.reportes || {
    id: 0,
    table_preferences: 'id,madeIn,module,operation,ip,oldValue',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [npe, setNPE] = useState(allReportes);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>([]);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]',
      title: 'Feito Por',
      value: 'user',
      defaultChecked: () => camposGerenciados.includes('user'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Feito Em',
      value: 'madeIn',
      defaultChecked: () => camposGerenciados.includes('madeIn'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Módulo',
      value: 'module',
      defaultChecked: () => camposGerenciados.includes('module'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Operação',
      value: 'operation',
      defaultChecked: () => camposGerenciados.includes('operation'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Valor',
      value: 'value',
      defaultChecked: () => camposGerenciados.includes('value'),
    },
  ]);
  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    {
      name: 'StatusCheckbox',
      title: 'IMPRESSO',
      value: 'IMPRESSO',
      defaultChecked: () => camposGerenciados.includes('IMPRESSO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'REIMPRESSO',
      value: 'REIMPRESSO',
      defaultChecked: () => camposGerenciados.includes('REIMPRESSO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'BAIXA',
      value: 'BAIXA',
      defaultChecked: () => camposGerenciados.includes('BAIXA'),
    },
    {
      name: 'StatusCheckbox',
      title: 'CRIAÇÃO',
      value: 'CRIAÇÃO',
      defaultChecked: () => camposGerenciados.includes('CRIAÇÃO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'EDIÇÃO',
      value: 'EDIÇÃO',
      defaultChecked: () => camposGerenciados.includes('EDIÇÃO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'EXCLUSÃO',
      value: 'EXCLUSÃO',
      defaultChecked: () => camposGerenciados.includes('EXCLUSÃO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'ATIVAÇÃO',
      value: 'ATIVAÇÃO',
      defaultChecked: () => camposGerenciados.includes('ATIVAÇÃO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'INATIVAÇÃO',
      value: 'INATIVAÇÃO',
      defaultChecked: () => camposGerenciados.includes('INATIVAÇÃO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'SUBSTITUIÇÃO',
      value: 'SUBSTITUIÇÃO',
      defaultChecked: () => camposGerenciados.includes('SUBSTITUIÇÃO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'SORTEIO',
      value: 'SORTEIO',
      defaultChecked: () => camposGerenciados.includes('SORTEIO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'ADIÇÃO DE EXPERIMENTO',
      value: 'ADIÇÃO DE EXPERIMENTO',
      defaultChecked: () => camposGerenciados.includes('ADIÇÃO DE EXPERIMENTO'),
    },
  ]);
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [filtersParams, setFiltersParams] = useState<any>(filterBeforeEdit); // Set filter Parameter
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const filterStatusBeforeEdit = filterApplication.split('');

  const formik = useFormik<IFilter>({
    initialValues: {
      filterMadeBy: '',
      filterStartDate: '',
      filterEndDate: '',
      filterModule: '',
      filterOperation: '',
      filterValue: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterMadeBy,
      filterStartDate,
      filterEndDate,
      filterModule,
      filterValue,
    }) => {
      const filterOperation = statusFilterSelected?.join(',')?.toUpperCase();
      const parametersFilter = `filterMadeBy=${filterMadeBy}&filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}&filterModule=${filterModule}&filterOperation=${filterOperation}&filterValue=${filterValue}`;

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

    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await reporteService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setNPE(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item: any) => {
      if (columnCampos[item] === 'user') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Feito Por',
            title: 'user.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'madeIn') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Feito Em',
            title: 'madeIn',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${
                  rowData.madeIn
                    ? functionsUtils?.formatDate(new Date(rowData.madeIn))
                    : null
                }`}
              </div>
            ),
          }),
        );
      }
      if (columnCampos[item] === 'module') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Módulo',
            title: 'module',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'operation') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Operação',
            title: 'operation',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'value') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Valor',
            title: 'oldValue',
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

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
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
          module_id: 31,
        })
        .then((response) => {
          userLogado.preferences.reportes = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.reportes = {
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
    await reporteService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((row: any) => {
          const newRow = row;

          newRow.madeIn = moment(row.madeIn).format('YYYY-MM-DD HH:MM:SS');

          newRow.FEITO_POR = row.user.name;
          newRow.FEITO_EM = newRow.madeIn;
          newRow.MODULO = row.module;
          newRow.OPERAÇÃO = row.operation;
          newRow.VALOR = row.oldValue;
          newRow.IP = row.ip;

          delete newRow.id;
          delete newRow.value;
          delete newRow.operation;
          delete newRow.userId;
          delete newRow.user;
          delete newRow.madeIn;
          delete newRow.module;
          return newRow;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workBook,
          workSheet,
          'LOGS',
        );

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
        XLSX.writeFile(workBook, 'LOGS.xlsx');
      } else {
        setLoading(false);
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
    await callingApi(filter, page); // handle pagination globly
  }

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-4 w-1/4 ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          defaultValue={checkValue(title)}
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
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
        <title>Listagem do Histórico de Etiquetagem</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="relatorios">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >
          <AccordionFilter
            title="Filtrar Histórico de Etiquetagem"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-0
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div className="w-full h-full flex justify-center pb-0">
                  {filterFieldFactory('filterMadeBy', 'Feito Por')}

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Inicio De:
                    </label>
                    <Input
                      type="date"
                      id="filterStartDate"
                      name="filterStartDate"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Inicio Até:
                    </label>
                    <Input
                      type="date"
                      id="filterEndDate"
                      name="filterEndDate"
                      onChange={formik.handleChange}
                    />
                  </div>

                  {filterFieldFactory('filterModule', 'Módulo')}

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Operação
                    </label>
                    <SelectMultiple
                      data={statusFilter.map((i: any) => i.title)}
                      values={statusFilterSelected}
                      onChange={(e: any) => setStatusFilterSelected(e)}
                    />
                  </div>

                  {filterFieldFactory('filterValue', 'Valor')}

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
              data={npe}
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
                    className="w-full max-h-max
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
                    {/* <div className="h-12">
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="npe/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div> */}

                    <div />
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
                        <div className="w-64">
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
                                        {(provided) => (
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
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
                          title="Exportar planilha de NPE"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                        {/* <div style={{ width: 20 }} /> */}
                        {/* <Button
                          title="Configurar Importação de Planilha"
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {}}
                          href="npe/importar-planilha/config-planilha"
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
  const { safraId } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const { token } = req.cookies;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('itensPage', { req, res });
  }

  const pageBeforeEdit = 0;

  const filterBeforeEdit = '';

  const itensPerPage = 10;

  // RR
  const typeOrderServer = 'desc';

  // RR
  const orderByserver = 'madeIn';

  const filterApplication = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';

  // //RR
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('lastPage', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/reporte`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}&id_safra=${safraId}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allReportes = [], total: totalItems = 0 } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allReportes,
      totalItems,
      itensPerPage,
      filterApplication,
      filterBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
      safraId,
      idCulture,
    },
  };
};
