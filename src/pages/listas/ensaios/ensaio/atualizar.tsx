/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFormik } from "formik";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState, useRef } from "react";
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
} from "../../../../components";
import headerTableFactoryGlobal from "../../../../shared/utils/headerTableFactory";

type IAssayListUpdate = Omit<IAssayList, 'id_safra' | 'period'>;

export default function AtualizarTipoEnsaio({
  allGenotypeTreatment,
  totalItens,
  itensPerPage,
  filterApplication,
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

  const tableRef = useRef();

  const tabsDropDowns = TabsDropDowns("listas");


  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.genotypeTreatment || {
    id: 0,
    table_preferences:
      'safra,fase,cod_tec,treatments_number,genotipoName,genotipoGmr,genotipoBgm,status,nca,cod_lote,comments',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const tableRef = useRef<any>(null);

  const preferencesExperiments = userLogado.preferences.experimento || {
    id: 0,
    table_preferences:
      'id,gli,experimentName,local,delineamento,repetitionsNumber,nlp,clp,eel,density,status',
  };
  const [experimentsCamposGerenciados, setExperimentsCamposGerenciados] = useState<any>(preferencesExperiments.table_preferences);

  const [itemsTotal, setItemsTotal] = useState<any>(totalItens);
  const [experimentsTotal, setExperimentsTotal] = useState<any>(totalExperiments);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);

  const [table, setTable] = useState<string>('genotipo');
  const [genotypeTreatments, setGenotypeTreatments] = useState<any>(
    () => allGenotypeTreatment,
  );
  const [experiments, setExperiments] = useState<any>(() => allExperiments);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [fieldOrder, setFieldOrder] = useState<any>(null);
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
    { name: 'CamposGerenciados[]', title: 'Cód. lote', value: 'cod_lote' },
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
    { name: 'CamposGerenciados[]', title: 'Status EXP.', value: 'status' },
  ]);
  const [colorStar, setColorStar] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
  const [take, setTake] = useState<any>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const router = useRouter();
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
        })
        .then(({ status, message }) => {
          if (status === 200) {
            Swal.fire('Experimento atualizado com sucesso!');
            router.back();
          } else {
            Swal.fire(message);
          }
        });
    },
  });

  // async function handleOrder(
  //   column: string,
  //   order: string | any,
  //   name: any,
  // ): Promise<void> {
  //   if (table !== 'genotipo') {
  //     handleOrderExperiments(column, order, name);
  //     return;
  //   }

  //   let typeOrder: any;
  //   let parametersFilter: any;
  //   if (order === 1) {
  //     typeOrder = 'asc';
  //   } else if (order === 2) {
  //     typeOrder = 'desc';
  //   } else {
  //     typeOrder = '';
  //   }
  //   setOrderBy(column);
  //   setOrderType(typeOrder);
  //   if (filter && typeof filter !== 'undefined') {
  //     if (typeOrder !== '') {
  //       parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
  //     } else {
  //       parametersFilter = filter;
  //     }
  //   } else if (typeOrder !== '') {
  //     parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_safra=${idSafra}`;
  //   } else {
  //     parametersFilter = filter;
  //   }

  //   await genotypeTreatmentService
  //     .getAll(`${parametersFilter}&skip=0&take=${take}`)
  //     .then(({ status, response }) => {
  //       if (status === 200) {
  //         setGenotypeTreatments(response);
  //       }
  //     });

  //   if (orderList === 2) {
  //     setOrder(0);
  //     setArrowOrder(<AiOutlineArrowDown />);
  //   } else {
  //     setOrder(orderList + 1);
  //     if (orderList === 1) {
  //       setArrowOrder(<AiOutlineArrowUp />);
  //     } else {
  //       setArrowOrder('');
  //     }
  //   }

  //   setFieldOrder(name);
  // }

  async function callingApi(parametersFilter: any) {
    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await genotypeTreatmentService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400) {
        setGenotypeTreatments(response.response);
        setItemsTotal(response.total);
        tableRef.current.dataManager.changePageSize(
          response.total >= take ? take : response.total,
        );
      }
    });
  }

  async function handleOrder(
    column: string,
    order: number,
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
    // console.log('parametersFilter');
    // console.log(parametersFilter);
    // await genotypeTreatmentService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then(({ status, response }) => {
    //     if (status === 200) {
    //       setGenotypeTreatments(response);
    //     }
    //   });

    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(name);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
  }

  async function handleOrderExperiments(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }

    if (filter && typeof filter !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_safra=${idSafra}`;
    } else {
      parametersFilter = filter;
    }

    await experimentService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then(({ status, response }) => {
        if (status === 200) {
          setExperiments(response);
        }
      });

    if (orderList === 2) {
      setOrder(0);
      setArrowOrder(<AiOutlineArrowDown />);
    } else {
      setOrder(orderList + 1);
      if (orderList === 1) {
        setArrowOrder(<AiOutlineArrowUp />);
      } else {
        setArrowOrder('');
      }
    }

    setFieldOrder(name);
  }

  function formatDecimal(num: number) {
    return Number(num).toFixed(1);
  }

  function columnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      // if (columnOrder[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
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
            handleOrder,
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
            handleOrder,
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
            handleOrder,
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
            handleOrder,
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
            handleOrder,
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
            handleOrder,
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
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status EXP.',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
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

  async function getValuesColumns() {
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
          module_id: 27,
        })
        .then((response) => {
          userLogado.preferences.genotypeTreatment = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.genotypeTreatment = {
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

  async function getValuesColumnsExperiments(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox']");
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
          module_id: 22,
        })
        .then((response) => {
          userLogado.preferences.experimento = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.experimento = {
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
    setExperimentsCamposGerenciados(campos);
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

  function handleOnDragEndExperiments(result: DropResult): void {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesPropsExperiments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesPropsExperiments(items);
  }

  const downloadExcel = async (): Promise<void> => {
    await genotypeTreatmentService
      .getAll(filterApplication)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((row: any) => {
            const newRow = row;
            newRow.SAFRA = row.safra.safraName;
            newRow.FASE = newRow.lote?.fase;
            newRow.COD_TEC = newRow.genotipo?.tecnologia?.cod_tec;
            newRow.NT = newRow.treatments_number;
            newRow.NOME_GENOTIPO = newRow.genotipo?.name_genotipo;
            newRow.GMR_GENOTIPO = newRow.genotipo?.gmr;
            newRow.BGM_GENOTIPO = newRow.genotipo?.bgm;
            newRow.STATUS_T = newRow.status;
            newRow.STATUS_EXPERIMENTO = newRow.status_experiment;
            newRow.NCA = newRow.lote?.ncc;
            newRow.COD_LOTE = newRow.lote?.cod_lote;
            newRow.COMENTÁRIOS = newRow.comments;

            delete row.id_lote;
            delete row.id_genotipo;
            delete row.safra;
            delete row.treatments_number;
            delete row.status;
            delete row.status_experiment;
            delete row.comments;
            delete row.genotipo;
            delete row.lote;
            delete row.id;
            delete row.id_safra;
            delete row.assay_list;
            return newRow;
          });
          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            workBook,
            workSheet,
            'genotypeTreatments',
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
          XLSX.writeFile(workBook, 'Tratamentos-genótipos.xlsx');
        }
      });
  };

  const downloadExcelExperiments = async (): Promise<void> => {
    await experimentService
      .getAll(filterApplication)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((row: any) => {
            const newRow = row;
            newRow.local = newRow.local?.name_local_culture;
            newRow.delineamento = newRow.delineamento?.name;
            delete newRow.id;
            delete newRow.assay_list;
            return newRow;
          });
          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, 'Experimentos');

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
        }
      });
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
    const skip = currentPage * Number(take);
    let parametersFilter;
    if (orderType) {
      parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await genotypeTreatmentService
      .getAll(parametersFilter)
      .then(({ status, response }) => {
        if (status === 200) {
          setGenotypeTreatments(response);
          console.log({ response });
          tableRef?.current?.dataManager?.changePageSize(
            response?.length >= take ? take : response?.length
          );
        }
      });
  }

  async function handlePaginationExperiments(): Promise<void> {
    const skip = currentPage * Number(take);
    let parametersFilter;
    if (orderType) {
      parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await experimentService
      .getAll(parametersFilter)
      .then(({ status, response }) => {
        if (status === 200) {
          setExperiments(response);
        }
      });
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
    table === "genotipo" ? handlePagination() : handlePaginationExperiments();
    table === "genotipo" ? handleTotalPages() : handleTotalPagesExperiments();
  }, [currentPage, take]);

  function getItensPerPage() {
    return (
      <div className="w-1/4">
        <FieldItemsPerPage
          //label="Itens por página"
          selected={take}
          onChange={setTake}
        />
      </div>
    );
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  return (
    <>
      <Head>
        <title>Atualizar Lista de Ensaio</title>
      </Head>

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
                  Observações
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
                  onClick={() => {}}
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
              style={{ background: "#f9fafb" }}
              columns={table === "genotipo" ? columns : experimentColumns}
              data={table === "genotipo" ? genotypeTreatments : experiments}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
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

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {table === 'genotipo' ? itemsTotal : experimentsTotal}
                    </strong>

                    <div className="w-1/4">
                      <FieldItemsPerPage selected={take} onChange={setTake} />
                    </div>

                    <div className="h-full flex items-center gap-2">
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
                          <AccordionFilter
                            title="Gerenciar Campos"
                            grid={statusAccordion}
                          >
                            <DragDropContext
                              onDragEnd={
                                table === 'genotipo'
                                  ? handleOnDragEnd
                                  : handleOnDragEndExperiments
                              }
                            >
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
                                        onClick={
                                          table === 'genotipo'
                                            ? getValuesColumns
                                            : getValuesColumnsExperiments
                                        }
                                        icon={<IoReloadSharp size={20} />}
                                      />
                                    </div>
                                    {table === 'genotipo'
                                      ? generatesProps.map(
                                        (generate, index) => (
                                          <Draggable
                                            key={index}
                                            draggableId={String(
                                              generate.title,
                                            )}
                                            index={index}
                                          >
                                            {(dragProps) => (
                                              <li
                                                ref={dragProps.innerRef}
                                                {...dragProps.draggableProps}
                                                {...dragProps.dragHandleProps}
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
                                        ),
                                      )
                                      : generatesPropsExperiments.map(
                                        (generate, index) => (
                                          <Draggable
                                            key={index}
                                            draggableId={String(
                                              generate.title,
                                            )}
                                            index={index}
                                          >
                                            {(dragProps) => (
                                              <li
                                                ref={dragProps.innerRef}
                                                {...dragProps.draggableProps}
                                                {...dragProps.dragHandleProps}
                                              >
                                                <CheckBox
                                                  name={generate.name}
                                                  title={generate.title?.toString()}
                                                  value={generate.value}
                                                  defaultChecked={experimentsCamposGerenciados.includes(
                                                      generate.value as string,
                                                  )}
                                                />
                                              </li>
                                            )}
                                          </Draggable>
                                        ),
                                      )}
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

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }: any) => {
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

  const { publicRuntimeConfig } = getConfig();
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
  }

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : '';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const filterApplication = `&id_safra=${idSafra}&orderBy=gli&typeOrder=asc&orderBy=treatments_number&typeOrder=asc`;

  // RR
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const idAssayList = Number(query.id);
  const baseUrlExperiment = `${publicRuntimeConfig.apiUrl}/experiment`;
  const { response: allExperiments = [], total: totalExperiments = 0 } = await fetch(
    `${baseUrlExperiment}?${filterApplication}`,
    requestOptions,
  ).then((response) => response.json());

  const baseUrlGenotypeTreatment = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;
  const { response: allGenotypeTreatment = [], total: totalItens = 0 } = await fetch(
    `${baseUrlGenotypeTreatment}?${filterApplication}`,
    requestOptions,
  ).then((response) => response.json());

  const baseUrlAssayList = `${publicRuntimeConfig.apiUrl}/assay-list`;
  const assayList = await fetch(
    `${baseUrlAssayList}/${query.id}`,
    requestOptions,
  ).then((response) => response.json());

  console.log('filterApplication');
  console.log(filterApplication);

  return {
    props: {
      allGenotypeTreatment,
      totalItens,
      itensPerPage,
      filterApplication,
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
