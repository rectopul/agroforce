/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
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
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { unidadeCulturaService, userPreferencesService } from 'src/services';
import * as XLSX from 'xlsx';
import { BsTrashFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useRouter } from 'next/router';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ManageFields,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';
import { perm_can_do } from '../../../../shared/utils/perm_can_do';

interface IUnityCultureProps {
  id: number;
  name_unity_culture: string;
  year: number;
  name_local_culture: string;
  label: string;
  mloc: string;
  adress: string;
  label_country: string;
  label_region: string;
  name_locality: string;
}

interface IFilter {
  filterNameUnityCulture: string | any;
  filterYearFrom: string | number;
  filterYearTo: string | number;
  filterNameLocalCulture: string | any;
  filterLabel: string | any;
  filterMloc: string | any;
  filterAdress: string | any;
  filterLabelCountry: string | any;
  filterLabelRegion: string | any;
  filterNameLocality: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allCultureUnity: IUnityCultureProps[];
  totalItems: number;
  idSafra: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
  cultureId: any | number;
}

export default function Listagem({
  allCultureUnity,
  totalItems,
  idSafra,
  itensPerPage,
  filterApplication,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
  cultureId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const tabsDropDowns = TabsDropDowns('config');
  tabsDropDowns.map((tab) => (tab.titleTab === 'LOCAL' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'cultureUnity';
  const module_name = 'unidadeCultura';
  const module_id = 21;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,name_unity_culture,year,name_local_culture,label,mloc,adress,label_country,label_region,name_locality';
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
  const [unidadeCultura, setUnidadeCultura] = useState<IUnityCultureProps[]>(
    () => allCultureUnity,
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
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
      title: 'Unidade de cultura',
      value: 'name_unity_culture',
      defaultChecked: () => camposGerenciados.includes('name_unity_culture'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ano',
      value: 'year',
      defaultChecked: () => camposGerenciados.includes('year'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Lugar de cultura',
      value: 'name_local_culture',
      defaultChecked: () => camposGerenciados.includes('name_local_culture'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Rótulo',
      value: 'label',
      defaultChecked: () => camposGerenciados.includes('label'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'MLOC',
      value: 'mloc',
      defaultChecked: () => camposGerenciados.includes('mloc'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Endereço',
      value: 'adress',
      defaultChecked: () => camposGerenciados.includes('adress'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'País',
      value: 'label_country',
      defaultChecked: () => camposGerenciados.includes('label_country'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Região',
      value: 'label_region',
      defaultChecked: () => camposGerenciados.includes('label_region'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Localidade',
      value: 'name_locality',
      defaultChecked: () => camposGerenciados.includes('name_locality'),
    },
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Ação',
    //   value: 'action',
    //   defaultChecked: () => camposGerenciados.includes('action'),
    // },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [selectedRowById, setSelectedRowById] = useState<number>();
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const formik = useFormik<IFilter>({
    initialValues: {
      filterNameUnityCulture: checkValue('filterNameUnityCulture'),
      filterYearTo: checkValue('filterYearTo'),
      filterYearFrom: checkValue('filterYearFrom'),
      filterNameLocalCulture: checkValue('filterNameLocalCulture'),
      filterLabel: checkValue('filterLabel'),
      filterMloc: checkValue('filterMloc'),
      filterAdress: checkValue('filterAdress'),
      filterLabelCountry: checkValue('filterLabelCountry'),
      filterLabelRegion: checkValue('filterLabelRegion'),
      filterNameLocality: checkValue('filterNameLocality'),
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterNameUnityCulture,
      filterYearTo,
      filterYearFrom,
      filterNameLocalCulture,
      filterLabel,
      filterMloc,
      filterAdress,
      filterLabelCountry,
      filterLabelRegion,
      filterNameLocality,
    }) => {
      const parametersFilter = `&filterNameUnityCulture=${filterNameUnityCulture}&filterNameLocalCulture=${filterNameLocalCulture}&filterLabel=${filterLabel}&filterMloc=${filterMloc}&filterAdress=${filterAdress}&filterLabelCountry=${filterLabelCountry}&filterLabelRegion=${filterLabelRegion}&filterNameLocality=${filterNameLocality}&filterYearTo=${filterYearTo}&filterYearFrom=${filterYearFrom}&id_safra=${idSafra}`;

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

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

    await unidadeCulturaService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setUnidadeCultura(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao buscar unidade de cultura',
          html: 'Ocorreu um erro ao buscar unidade de cultura. Tente novamente mais tarde.',
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
    setLoading(true);
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(columnG);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    typeOrderG !== '' ? (typeOrderG == 'desc' ? setOrder(1) : setOrder(2)) : '';
    setArrowOrder(arrowOrder);
  }

  function columnsOrder(columnOrder: any): any {
    const columnCampos: any = columnOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item: any) => {
      if (columnCampos[item] === 'name_unity_culture') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Unidade de cultura',
            title: 'name_unity_culture',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'year') {
        tableFields.push(
          headerTableFactoryGlobal({
            type: 'int',
            name: 'Ano',
            title: 'year',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'name_local_culture') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Lugar de cultura',
            title: 'local.name_local_culture',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'label') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Rótulo',
            title: 'local.label',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'adress') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Endereço',
            title: 'local.adress',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'mloc') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'MLOC',
            title: 'local.mloc',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'label_country') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'País',
            title: 'local.label_country',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'label_region') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Região',
            title: 'local.label_region',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'name_locality') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Localidade',
            title: 'local.name_locality',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      // if (columnCampos[item] === 'action') {
      //   tableFields.push(statusHeaderFactory());
      // }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  const downloadExcel = async (): Promise<void> => {
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await unidadeCulturaService.getAll(filterParam).then(({ status, response }) => {
      if (!response.A1) {
        Swal.fire('Nenhum dado para extrair');
        return;
      }
      if (status === 200) {
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, 'unidade-cultura');

        // buffer
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
        XLSX.writeFile(workBook, 'Unidade-cultura.xlsx');
      } else {
        Swal.fire('Não existem registros para serem exportados, favor checar.');
      }
    });
    setLoading(false);
  };

  async function handlePagination(page: any): Promise<void> {
    await callingApi(filter, page); // handle pagination globly
  }

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-4 w-1/2 ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          id={title}
          name={title}
          defaultValue={checkValue(title)}
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

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem das unidades de culturas</title>
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
            title="Filtrar unidades de culturas"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-2
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-8
                "
                >
                  {filterFieldFactory(
                    'filterNameUnityCulture',
                    'Unidade de cultura',
                  )}

                  {/* <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Ano
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterYearFrom"
                        name="filterYearFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        placeholder="Até"
                        id="filterYearTo"
                        name="filterYearTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div> */}

                  {filterFieldFactory(
                    'filterNameLocalCulture',
                    'Lugar de cultura',
                  )}

                  {filterFieldFactory('filterLabel', 'Rótulo')}

                  {filterFieldFactory('filterMloc', 'MLOC')}
                </div>

                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pt-2
                  pb-0
                  "
                >
                  {filterFieldFactory('filterAdress', 'Endereço')}

                  {filterFieldFactory('filterLabelCountry', 'País')}

                  {filterFieldFactory('filterLabelRegion', 'Região')}

                  {filterFieldFactory('filterNameLocality', 'Localidade')}

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 20 }} />
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
              columns={columns}
              data={unidadeCultura}
              onRowClick={(evt?, selectedRow?: IUnityCultureProps) => {
                setSelectedRowById(selectedRow?.id);
              }}
              options={{
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 460 : 320
                }px)`,
                search: false,
                filtering: false,
                pageSize: Number(take),
                rowStyle: (rowData: IUnityCultureProps) => ({
                  backgroundColor:
                    selectedRowById === rowData.id ? '#c7e3f5' : '#fff',
                  height: 35,
                }),
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
                    {/* <div className="h-12" /> */}
                    <div className="h-12">
                      <Button
                        title="Importar"
                        value="Importar"
                        bgColor="bg-blue-600"
                        textColor="white"
                        style={{ display: !perm_can_do('/config/local/lugar-local', 'import') ? 'none' : '' }}
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
                          columnsOrder(e);
                        }}
                        OnSetUserLogado={(e: any) => {
                          setUserLogado(e);
                        }}
                        OnSetPreferences={(e: any) => {
                          setPreferences(e);
                        }}
                      />
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de locais"
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
  const userPreferenceController = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = (await (
    await userPreferenceController.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 10;

  const { token } = req.cookies;
  const idSafra = Number(req.cookies.safraId);
  const { cultureId } = req.cookies;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `id_safra=${idSafra}`;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'unidadeCultura') {
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
    : 'desc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'name_unity_culture';

  const filterApplication = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `id_safra=${idSafra}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/unidade-cultura`;
  const param = `skip=0&take=${itensPerPage}&id_safra=${idSafra}`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allCultureUnity, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allCultureUnity,
      totalItems,
      idSafra,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
      cultureId,
    },
  };
};
