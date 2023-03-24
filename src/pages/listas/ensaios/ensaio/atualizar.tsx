/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFormik } from 'formik';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  ReactNode, useEffect, useState, useRef,
} from 'react';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoMdArrowBack } from 'react-icons/io';
import { RiFileExcel2Line, RiOrganizationChart } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import MaterialTable from 'material-table';
import { FaSortAmountUpAlt } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { removeCookies, setCookies } from 'cookies-next';
import moment from 'moment';
import {
  userPreferencesService,
  assayListService,
  genotypeTreatmentService,
  experimentService,
} from '../../../../services';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import * as ITabs from '../../../../shared/utils/dropdown';
import { IGenerateProps } from '../../../../interfaces/shared/generate-props.interface';
import {
  IGenotypeTreatmentGrid,
  IAssayList,
} from '../../../../interfaces/listas/ensaio/assay-list.interface';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  FieldItemsPerPage,
  Select,
  ManageFields,
} from '../../../../components';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import { tableGlobalFunctions } from '../../../../helpers';
import ComponentLoading from '../../../../components/Loading';

type IAssayListUpdate = Omit<IAssayList, 'id_safra' | 'period'>;

export default function AtualizarTipoEnsaio({
  allGenotypeTreatment,
  totalItens,
  itensPerPage,
  treatmentsFilterApplication,
  experimentFilterApplication,
  idAssayList,
  idSafra,
  assayList,
  allExperiments,
  totalExperiments,
  pageBeforeEdit,
  filterBeforeEdit,
  orderByserver,
  typeOrderServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const [table, setTable] = useState<string>('genotipo');
  const [tables, setTables] = useState<string>('genotype_treatment');
  const [module_name, setModuloName] = useState<string>('genotypeTreatment');
  const [module_id, setModuleId] = useState<number>(27);
  const [identifier_preference, setIdentifierPreference] = useState<string>('');
  const [camposGerenciadosDefault, setCamposGerenciadosDefault] = useState<string>('safra,fase,cod_tec,treatments_number,genotipoName,genotipoGmr,genotipoBgm,status,nca,cod_lote,comments,status_experiment');
  const [preferencesDefault, setPreferencesDefault] = useState<any>({
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  });
  const [
    preferences,
    setPreferences,
  ] = useState<any>(userLogado.preferences[identifier_preference] || preferencesDefault);
  const [camposGerenciados, setCamposGerenciados] = useState<any>('safra,fase,cod_tec,treatments_number,genotipoName,genotipoGmr,genotipoBgm,status,nca,cod_lote,comments,status_experiment');
  const [experimentsCamposGerenciados, setExperimentsCamposGerenciados] = useState<any>('id,gli,experimentName,local,delineamento,repetitionsNumber,nlp,clp,eel,density,status');

  useEffect(() => {
    function setPreferencesGenotype() {
      setTables('genotype_treatment');
      setModuloName('genotypeTreatment');
      setModuleId(27);
      setIdentifierPreference(module_name + router.route);
      setCamposGerenciadosDefault('safra,fase,cod_tec,treatments_number,genotipoName,genotipoGmr,genotipoBgm,status,nca,cod_lote,comments,status_experiment');
      setPreferencesDefault({
        id: 0,
        route_usage: router.route,
        table_preferences: camposGerenciadosDefault,

      });
      setPreferences(userLogado.preferences[identifier_preference] || preferencesDefault);
      setCamposGerenciados(preferences.table_preferences);
    }
    function setPreferencesExperiment() {
      setTables('experiment');
      setModuloName('experimento');
      setModuleId(22);
      setIdentifierPreference(module_name + router.route);
      setCamposGerenciadosDefault('id,gli,experimentName,local,delineamento,repetitionsNumber,nlp,clp,eel,density,status');
      setPreferencesDefault({
        id: 0,
        route_usage: router.route,
        table_preferences: camposGerenciadosDefault,

      });
      setPreferences(userLogado.preferences[identifier_preference] || preferencesDefault);
      setExperimentsCamposGerenciados(preferences.table_preferences);
    }

    table === 'genotipo'
      ? setPreferencesGenotype()
      : setPreferencesExperiment();
  }, [table]);

  const tableRef = useRef<any>(null);

  const [itemsTotal, setItemsTotal] = useState<any>(totalItens);
  const [experimentsTotal, setExperimentsTotal] = useState<any>(totalExperiments);
  const [experimentFilter, setExperimentFilter] = useState<any>(
    experimentFilterApplication,
  );
  const [treatmentsFilter, setTreatmentsFilter] = useState<any>(
    treatmentsFilterApplication,
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);

  const [genotypeTreatments, setGenotypeTreatments] = useState<any>(
    () => allGenotypeTreatment,
  );
  const [experiments, setExperiments] = useState<any>(() => allExperiments);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);
  const [take, setTake] = useState<number>(itensPerPage);
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [loading, setLoading] = useState<boolean>(false);
  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
    orderBy == 'tecnologia' ? 'tecnologia.cod_tec' : orderBy
  }&typeOrder=${typeOrder}`;
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: "CamposGerenciados[]", title: "Favorito", value: "id" },
    { name: 'CamposGerenciados[]', title: 'Safra', value: 'safra' },
    { name: 'CamposGerenciados[]', title: 'Fase', value: 'fase' },
    {
      name: 'CamposGerenciados[]',
      title: 'GGEN',
      value: 'cod_tec',
    },
    { name: 'CamposGerenciados[]', title: 'NT', value: 'treatments_number' },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome do genótipo',
      value: 'genotipoName',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'GMR',
      value: 'genotipoGmr',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'BGM',
      value: 'genotipoBgm',
    },
    { name: 'CamposGerenciados[]', title: 'T', value: 'status' },
    { name: 'CamposGerenciados[]', title: 'NCA', value: 'nca' },
    { name: 'CamposGerenciados[]', title: 'Cód lote', value: 'cod_lote' },
    { name: 'CamposGerenciados[]', title: 'OBS', value: 'comments' },
    {
      name: 'CamposGerenciados[]',
      title: 'Status Trat.',
      value: 'status_experiment',
    },
  ]);
  const [generatesPropsExperiments, setGeneratesPropsExperiments] = useState<
    IGenerateProps[]
  >(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    {
      name: 'CamposGerenciados[]',
      title: 'Experimento Planejado',
      value: 'experimentName',
    },
    { name: 'CamposGerenciados[]', title: 'Lugar de Cultura', value: 'local' },
    {
      name: 'CamposGerenciados[]',
      title: 'Delineamento',
      value: 'delineamento',
    },
    { name: 'CamposGerenciados[]', title: 'Rep.', value: 'repetitionsNumber' },
    { name: 'CamposGerenciados[]', title: 'NLP', value: 'nlp' },
    { name: 'CamposGerenciados[]', title: 'CLP', value: 'clp' },
    // { name: "CamposGerenciados[]", title: "EEL", value: "eel" },
    { name: 'CamposGerenciados[]', title: 'Densidade', value: 'density' },
    { name: 'CamposGerenciados[]', title: 'Status Trat.', value: 'status' },
  ]);
  const [colorStar, setColorStar] = useState<string>('');
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const formik = useFormik<IAssayListUpdate | any>({
    initialValues: {
      id: assayList?.id,
      foco: assayList?.foco?.name,
      type_assay: assayList?.type_assay?.name,
      tecnologia: `${assayList?.tecnologia?.cod_tec || ''} ${
        assayList?.tecnologia?.name || ''
      }`,
      gli: assayList?.gli,
      bgm: assayList?.bgm || '',
      status: assayList?.status,
      project: assayList?.project,
      comments: assayList?.comments,
    },
    onSubmit: async (values) => {
      await assayListService
        .update({
          id: values.id,
          project: values.project,
          comments: values.comments,
          userId: userLogado.id,
        })
        .then(({ status, message }) => {
          if (status === 200) {
            Swal.fire('Ensaio atualizado com sucesso!');
            router.back();
          } else {
            Swal.fire(message);
          }
        });
    },
  });

  async function callingApi(parametersFilter: any) {
    // setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    // setCookies('filterBeforeEditOrderBy', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await genotypeTreatmentService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setGenotypeTreatments(response.response);
          setItemsTotal(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  async function callingApiExperiment(parametersFilter: any) {
    // setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    // setCookies('filterBeforeEditOrderBy', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await experimentService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setExperiments(response.response);
          setItemsTotal(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  useEffect(() => {
    table === 'genotipo'
      ? callingApi(treatmentsFilter)
      : callingApiExperiment(experimentFilter);
  }, [typeOrder]);

  async function handleOrder(
    column: string,
    order: number,
    name: any,
  ): Promise<void> {
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

  async function handleOrderExperiments(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
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

  function formatDecimal(num: number) {
    return num ? Number(num).toFixed(1) : '';
  }

  function columnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      if (columnOrder[index] === 'safra') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Safra',
            title: 'safra.safraName',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'fase') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Fase',
            title: 'lote.fase',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'cod_tec') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GGEN',
            title: 'genotipo.tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.genotipo.tecnologia.cod_tec} ${rowData.genotipo.tecnologia.name}`}
              </div>
            ),
          }),
        );
      }
      if (columnOrder[index] === 'treatments_number') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NT',
            title: 'treatments_number',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'genotipoName') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome do genótipo',
            title: 'genotipo.name_genotipo',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'genotipoGmr') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GMR',
            title: 'genotipo.gmr',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => formatDecimal(rowData.genotipo.gmr),
          }),
        );
      }
      if (columnOrder[index] === 'genotipoBgm') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'BGM',
            title: 'genotipo.bgm',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'T',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'nca') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NCA',
            title: 'lote.ncc',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'cod_lote') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Cód lote',
            title: 'lote.cod_lote',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'comments') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'OBS',
            title: 'comments',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div className="flex" title={rowData?.comments}>
                {rowData?.comments?.length > 11
                  ? `${rowData?.comments?.slice(0, 11)}...`
                  : rowData?.comments}
              </div>
            ),
          }),
        );
      }
      if (columnOrder[index] === 'status_experiment') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status Trat.',
            title: 'status_experiment',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
    });
    return tableFields;
  }

  function experimentColumnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      // if (columnOrder[index] === "id") {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnOrder[index] === 'experimentName') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Experimento Planejado',
            title: 'experimentName',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
      if (columnOrder[index] === 'local') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Lugar de cultura',
            title: 'local.name_local_culture',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
      if (columnOrder[index] === 'delineamento') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Delineamento',
            title: 'delineamento.name',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
      if (columnOrder[index] === 'repetitionsNumber') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Rep',
            title: 'repetitionsNumber',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
      if (columnOrder[index] === 'nlp') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NLP',
            title: 'nlp',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
      if (columnOrder[index] === 'clp') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'CLP',
            title: 'clp',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
      // if (columnOrder[index] === "eel") {
      //   tableFields.push(headerTableFactory("EEL", "eel"));
      // }
      if (columnOrder[index] === 'density') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Densidade',
            title: 'density',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status EXP',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder: handleOrderExperiments,
          }),
        );
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);
  const experimentColumns = experimentColumnsOrder(
    experimentsCamposGerenciados,
  );

  const downloadExcel = async (): Promise<void> => {
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${treatmentsFilterApplication}&skip=${skip}&take=${take}&createFile=true`;
    await genotypeTreatmentService
      .getAll(`${filterParam}&excel=true`)
      .then(({ status, response }) => {
        if (!response.A1) {
          Swal.fire('Nenhum dado para extrair');
          return;
        }
        if (status === 200) {
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, response, 'Tratamentos');

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
          XLSX.writeFile(workBook, 'Tratamentos-genótipo.xlsx');
        } else {
          setLoading(false);
          Swal.fire(
            'Não existem registros para serem exportados, favor checar.',
          );
        }
      });
    setLoading(false);
  };

  const downloadExcelExperiments = async (): Promise<void> => {
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${experimentFilterApplication}&skip=${skip}&take=${take}&createFile=true`;
    await experimentService
      .getAll(`${filterParam}&excel=${true}`)
      .then(({ status, response }: any) => {
        if (!response.A1) {
          Swal.fire('Nenhum dado para extrair');
          return;
        }
        if (status === 200) {
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, response, 'experimentos');

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
          XLSX.writeFile(workBook, 'Experimentos.xlsx');
        } else {
          setLoading(false);
          Swal.fire(
            'Não existem registros para serem exportados, favor checar.',
          );
        }
      });
    setLoading(false);
  };

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }

  function handleTotalPagesExperiments(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }

  async function handlePagination(): Promise<void> {
    await callingApi(treatmentsFilter); // handle pagination globly
  }

  async function handlePaginationExperiments(): Promise<void> {
    await callingApiExperiment(experimentFilter); // handle pagination globly
  }

  function updateFieldFactory(name: string, title: any = null) {
    return (
      <div className="w-full h-7">
        <label className="block text-gray-900 text-sm font-bold mb-0">
          {name}
        </label>
        <Input
          style={{ background: '#e5e7eb' }}
          disabled
          required
          id={title}
          name={title}
          value={formik.values[title]}
        />
      </div>
    );
  }

  useEffect(() => {
    table === 'genotipo' ? handlePagination() : handlePaginationExperiments();
    table === 'genotipo' ? handleTotalPages() : handleTotalPagesExperiments();
  }, [currentPage, take, table]);

  return (
    <>
      <Head>
        <title>Atualizar Lista de Ensaio</title>
      </Head>

      {loading && <ComponentLoading text="" />}

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <form
          className="w-full bg-white shadow-md rounded px-4 pt-3 pb-3 mt-0"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-xl">Atualizar Lista de Ensaio</h1>
          </div>

          <div
            className="w-full
            flex
            justify-around
            gap-0
            mt-0
            mb-0
          "
          >
            <div className="w-full flex justify-between items-start gap-5 mt-1">
              {updateFieldFactory('Foco', 'foco')}

              {updateFieldFactory('Ensaio', 'type_assay')}

              {updateFieldFactory('Tecnologia', 'tecnologia')}

              {updateFieldFactory('GLI', 'gli')}

              {updateFieldFactory('BGM', 'bgm')}

              {updateFieldFactory('Status do ensaio', 'status')}
            </div>
          </div>

          <div
            className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-1
          "
          >
            <div className="w-full flex justify-between items-start gap-5 mt-10">
              <div className="w-full h-10">
                <label className="block text-gray-900 text-sm font-bold mb-0">
                  Projeto
                </label>
                <Input
                  id="project"
                  name="project"
                  onChange={formik.handleChange}
                  value={formik.values.project}
                />
              </div>
            </div>

            <div className="w-full flex justify-between items-start gap-5 mt-3">
              <div className="w-full h-10">
                <label className="block text-gray-900 text-sm font-bold mb-0">
                  Comentários
                </label>
                <textarea
                  className="shadow
                              appearance-none
                              bg-white bg-no-repeat
                              border border-solid border-gray-300
                              rounded
                              w-full
                              py-1 px-2
                              text-gray-900
                              text-xs
                              leading-tight
                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  rows={3}
                  id="comments"
                  name="comments"
                  onChange={formik.handleChange}
                  value={formik.values.comments}
                />
                {/* <Input
                  id="comments"
                  name="comments"
                  onChange={formik.handleChange}
                  value={formik.values.comments}
                /> */}
              </div>
            </div>

            <div
              className="
            h-7 w-full
            flex
            gap-3
            justify-end
            mt-16
          "
            >
              <div className="w-40">
                <Button
                  type="button"
                  value="Voltar"
                  bgColor="bg-red-600"
                  textColor="white"
                  icon={<IoMdArrowBack size={18} />}
                  onClick={() => {
                    router.back();
                  }}
                />
              </div>
              <div className="w-40">
                <Button
                  type="submit"
                  value="Atualizar"
                  bgColor="bg-blue-600"
                  textColor="white"
                  icon={<RiOrganizationChart size={18} />}
                  onClick={() => {
                    setLoading(true);
                  }}
                />
              </div>
            </div>
          </div>
        </form>
        <main
          className="h-4/6 w-full
          flex flex-col
          items-start
          gap-8
        "
        >
          <div style={{ marginTop: '1%' }} className="w-full h-auto">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={table === 'genotipo' ? columns : experimentColumns}
              data={table === 'genotipo' ? genotypeTreatments : experiments}
              options={{
                showTitle: false,
                maxBodyHeight: 'calc(100vh - 470px)',
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
                    <div
                      className="flex
                    items-center"
                    >
                      <div className="h-12">
                        <Button
                          title="GENÓTIPOS"
                          value="GENÓTIPOS"
                          bgColor={
                            table === 'genotipo' ? 'bg-blue-600' : 'bg-gray-600'
                          }
                          textColor="white"
                          onClick={() => setTable('genotipo')}
                          // icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>
                      <div style={{ width: 10 }} />
                      <div className="h-12">
                        <Button
                          title="EXPERIMENTOS"
                          value="EXPERIMENTOS"
                          bgColor={
                            table === 'experimentos'
                              ? 'bg-blue-600'
                              : 'bg-gray-600'
                          }
                          textColor="white"
                          onClick={() => setTable('experimentos')}
                          // icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>
                    </div>

                    <div className="flex flex-row items-center w-full">
                      <div className="flex flex-1 justify-center">
                        <strong className="text-blue-600">
                          Total registrado:
                          {table === 'genotipo' ? itemsTotal : experimentsTotal}
                        </strong>
                      </div>
                      <div className="flex flex-1 mb-6 justify-end">
                        <FieldItemsPerPage
                          widthClass="w-1/2"
                          selected={take}
                          onChange={(e: any) => {
                            setLoading(true);
                            setTake(e);
                          }}
                        />
                      </div>
                    </div>

                    <div className="h-full flex items-center gap-2">
                      
                      <ManageFields
                        statusAccordionExpanded={false}
                        generatesPropsDefault={generatesProps}
                        camposGerenciadosDefault={camposGerenciadosDefault}
                        preferences={preferences}
                        preferencesDefault={preferencesDefault}
                        userLogado={userLogado}
                        label="Gerenciar Campos"
                        table={tables}
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
                          title="Exportar planilha de Tratamentos do genótipo"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            table === 'genotipo'
                              ? downloadExcel()
                              : downloadExcelExperiments();
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
                      onClick={() => setCurrentPage(pages)}
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
  query,
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 5;

  const { token } = req.cookies;
  const idSafra = req.cookies.safraId;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';

  const idAssay = query.id;

  const { publicRuntimeConfig } = getConfig();
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'assayList') {
    console.log('🚀 ~ file: atualizar.tsx:1254 ~ req.cookies.urlPage:', req.cookies.urlPage);
    // removeCookies('filterBeforeEdit', { req, res });
    // removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    // removeCookies('lastPage', { req, res });
  }

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : '';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const treatmentsFilterApplication = `&id_safra=${idSafra}&id_assay_list=${idAssay}&orderBy=gli&typeOrder=asc&orderBy=treatments_number&typeOrder=asc`;
  const experimentFilterApplication = `&id_safra=${idSafra}&id_assay_list=${idAssay}`;

  // RR
  // removeCookies('filterBeforeEditTypeOrder', { req, res });
  // removeCookies('filterBeforeEditOrderBy', { req, res });
  // removeCookies('lastPage', { req, res });

  const idAssayList = Number(query.id);
  const baseUrlExperiment = `${publicRuntimeConfig.apiUrl}/experiment`;
  const { response: allExperiments = [], total: totalExperiments = 0 } = await fetch(
    `${baseUrlExperiment}?${experimentFilterApplication}`,
    requestOptions,
  ).then((response) => response.json());

  const baseUrlGenotypeTreatment = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;
  const { response: allGenotypeTreatment = [], total: totalItens = 0 } = await fetch(
    `${baseUrlGenotypeTreatment}?${treatmentsFilterApplication}`,
    requestOptions,
  ).then((response) => response.json());

  const baseUrlAssayList = `${publicRuntimeConfig.apiUrl}/assay-list`;
  const assayList = await fetch(
    `${baseUrlAssayList}/${query.id}`,
    requestOptions,
  ).then((response) => response.json());
  return {
    props: {
      allGenotypeTreatment,
      totalItens,
      itensPerPage,
      treatmentsFilterApplication,
      experimentFilterApplication,
      idAssayList,
      idSafra,
      assayList,
      allExperiments,
      totalExperiments,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
