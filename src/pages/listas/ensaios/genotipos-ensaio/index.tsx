/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef, useState, useEffect } from 'react';
import { removeCookies, setCookies } from 'cookies-next';
import { replace, useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { BsDownload } from 'react-icons/bs';
import {
  RiArrowUpDownLine,
  RiCloseCircleFill,
  RiFileExcel2Line,
} from 'react-icons/ri';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import readXlsxFile from 'read-excel-file';
import {
  ITreatment,
  ITreatmentFilter,
  ITreatmentGrid,
} from '../../../../interfaces/listas/ensaio/genotype-treatment.interface';
import { IGenerateProps } from '../../../../interfaces/shared/generate-props.interface';

import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  SelectAutoComplete,
  SelectAutoCompleteMaterial,
  SelectMultiple,
  MultiSelect,
  SelectMultipleMaterial,
  ManageFields,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  genotypeTreatmentService,
  importService,
  userPreferencesService,
} from '../../../../services';
import * as ITabs from '../../../../shared/utils/dropdown';
import { functionsUtils } from '../../../../shared/utils/functionsUtils';
import { tableGlobalFunctions } from '../../../../helpers';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';
import { perm_can_do } from '../../../../shared/utils/perm_can_do';


interface TableRow {
  assay_list: {
    gli: any;
  };
  tableData?: {
    checked: boolean;
  };
}

export default function Listagem({
  allTreatments,
  assaySelect, // não está mais carregando todas as listas de ensaio, possivelmente era pra ser usado em um select que carregava todos os registros
  genotypeSelect, // não está mais carregando todos os genotipos, possivelmente era pra ser usado em um select que carregava todos os registros
  itensPerPage,
  filterApplication,
  idSafra,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
  filterSelectStatusEssay,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'genotype_treatment';
  const module_name = 'genotypeTreatment';
  const module_id = 27;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,foco,type_assay,tecnologia,ggen,gli,bgm,bgmGenotype,gmr,treatments_number,status,statusAssay,status_experiment,genotipoName,nca';
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
  const [treatments, setTreatments] = useState<ITreatment[] | any>(
    allTreatments,
  );
  const [tableMessage, setMessage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(0);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]',
      title: 'Foco',
      value: 'foco',
      defaultChecked: () => camposGerenciados.includes('foco'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ensaio',
      value: 'type_assay',
      defaultChecked: () => camposGerenciados.includes('type_assay'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Tecnologia',
      value: 'tecnologia',
      defaultChecked: () => camposGerenciados.includes('tecnologia'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'GGEN',
      value: 'ggen',
      defaultChecked: () => camposGerenciados.includes('ggen'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'GLI',
      value: 'gli',
      defaultChecked: () => camposGerenciados.includes('gli'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'BGM_ENS',
      value: 'bgm',
      defaultChecked: () => camposGerenciados.includes('bgm'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'BGM_GEN',
      value: 'bgmGenotype',
      defaultChecked: () => camposGerenciados.includes('bgmGenotype'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'GMR_GEN',
      value: 'gmr',
      defaultChecked: () => camposGerenciados.includes('gmr'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NT',
      value: 'treatments_number',
      defaultChecked: () => camposGerenciados.includes('treatments_number'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status T',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status do Ensaio',
      value: 'statusAssay',
      defaultChecked: () => camposGerenciados.includes('statusAssay'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status Trat.',
      value: 'status_experiment',
      defaultChecked: () => camposGerenciados.includes('status_experiment'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome do genótipo',
      value: 'genotipoName',
      defaultChecked: () => camposGerenciados.includes('genotipoName'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NCA',
      value: 'nca',
      defaultChecked: () => camposGerenciados.includes('nca'),
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    {
      name: 'StatusCheckbox',
      title: 'IMPORTADO',
      value: 'importado',
      defaultChecked: () => camposGerenciados.includes('importado'),
    },
    {
      name: 'StatusCheckbox',
      title: 'EXP IMP.',
      value: 'EXP IMP.',
      defaultChecked: () => camposGerenciados.includes('EXP IMP.'),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>(
    filterSelectStatusEssay,
  );

  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  // const take: number = itensPerPage;
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [nccIsValid, setNccIsValid] = useState<boolean>(false);
  const [genotypeIsValid, setGenotypeIsValid] = useState<boolean>(false);
  const [rowsSelected, setRowsSelected] = useState<TableRow[]>([]);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);

  // const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
  //   orderBy == "tecnologia" ? "genotipo.tecnologia.cod_tec" : orderBy
  // }&typeOrder=${typeOrder}`;

  const formik = useFormik<ITreatmentFilter>({
    initialValues: {
      filterFoco: checkValue('filterFoco'),
      filterTypeAssay: checkValue('filterTypeAssay'),
      filterTechnology: checkValue('filterTechnology'),
      filterCodTec: checkValue('filterCodTec'),
      filterGgenCod: checkValue('filterGgenCod'),
      filterGgenName: checkValue('filterGgenName'),
      filterGli: checkValue('filterGli'),
      filterBgm: checkValue('filterBgm'),
      filterTreatmentsNumber: checkValue('filterTreatmentsNumber'),
      filterStatus: checkValue('filterStatus'),
      filterStatusAssay: checkValue('filterStatusAssay'),
      filterStatusExperiment: checkValue('filterStatusExperiment'),
      filterGenotypeName: checkValue('filterGenotypeName'),
      filterNcaTo: checkValue('filterNcaTo'),
      filterNcaFrom: checkValue('filterNcaFrom'),
      orderBy: '',
      typeOrder: '',
      filterBgmTo: checkValue('filterBgmTo'),
      filterBgmFrom: checkValue('filterBgmFrom'),
      filterBgmGenotypeTo: checkValue('filterBgmGenotypeTo'),
      filterBgmGenotypeFrom: checkValue('filterBgmGenotypeFrom'),
      filterGmrTo: checkValue('filterGmrTo'),
      filterGmrFrom: checkValue('filterGmrFrom'),
      filterNtTo: checkValue('filterNtTo'),
      filterNtFrom: checkValue('filterNtFrom'),
      filterStatusT: checkValue('filterStatusT'),
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterTechnology,
      filterGli,
      filterBgm,
      filterTreatmentsNumber,
      filterStatusAssay,
      filterGenotypeName,
      filterNcaFrom,
      filterNcaTo,
      filterBgmTo,
      filterBgmFrom,
      filterGgenCod,
      filterGgenName,
      filterBgmGenotypeTo,
      filterBgmGenotypeFrom,
      filterGmrTo,
      filterGmrFrom,
      filterNtTo,
      filterNtFrom,
      filterStatusT,
      filterStatusExperiment,
      filterCodTec,
    }) => {
      if (!functionsUtils?.isNumeric(filterBgmFrom)) {
        return Swal.fire('O campo BGM_ENS não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterBgmTo)) {
        return Swal.fire('O campo BGM_ENS não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNtFrom)) {
        return Swal.fire('O campo NT não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNtTo)) {
        return Swal.fire('O campo NT não pode ter ponto ou vírgula.');
      }

      const allCheckBox: any = document.querySelectorAll(
        "input[name='StatusCheckbox']",
      );
      let selecionados = '';
      for (let i = 0; i < allCheckBox.length; i += 1) {
        if (allCheckBox[i].checked) {
          selecionados += `${allCheckBox[i].value},`;
        }
      }

      // const filterStatus = selecionados.substr(0, selecionados.length - 1);
      const filterStatus = statusFilterSelected?.join(',')?.toLowerCase();
      const parametersFilter = `filterGmrTo=${filterGmrTo}&filterGmrFrom=${filterGmrFrom}&filterBgmGenotypeTo=${filterBgmGenotypeTo}&filterBgmGenotypeFrom=${filterBgmGenotypeFrom}&filterGgenCod=${filterGgenCod}&filterGgenName=${filterGgenName}&filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterTechnology=${filterTechnology}&filterGli=${filterGli}&filterBgm=${filterBgm}&filterTreatmentsNumber=${filterTreatmentsNumber}&filterStatus=${filterStatus}&filterStatusAssay=${filterStatusAssay}&filterGenotypeName=${filterGenotypeName}&filterNcaFrom=${filterNcaFrom}&filterNcaTo=${filterNcaTo}&id_safra=${idSafra}&filterBgmTo=${filterBgmTo}&filterBgmFrom=${filterBgmFrom}&filterNtTo=${filterNtTo}&filterNtFrom=${filterNtFrom}&filterStatusT=${filterStatusT}&filterCodTec=${filterCodTec}&status_experiment=${filterStatusExperiment}`;

      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
      // await genotypeTreatmentService
      //   .getAll(`${parametersFilter}`)
      //   .then(({ response, total: allTotal }) => {
      //     setFilter(parametersFilter);
      //     setTreatments(response);
      //     setTotalItems(allTotal);
      //     setAfterFilter(true);
      //     setCurrentPage(0);
      //     setMessage(true);
      //     tableRef.current.dataManager.changePageSize(allTotal >= take ? take : allTotal);
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
    }&take=${take}&orderBy=${
      orderBy == 'tecnologia' ? 'genotipo.tecnologia.cod_tec' : orderBy
    }&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    setLoading(true);

    try {
      await genotypeTreatmentService
        .getAll(parametersFilter)
        .then((response) => {
          if (response.status === 200 || response.status === 400) {
            setTreatments(response.response);
            setTotalItems(response.total);
            // setAfterFilter(true);
            setMessage(true);
            tableRef.current.dataManager.changePageSize(
              response.total >= take ? take : response.total,
            );
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: 'Falha ao buscar genotipos do ensaio',
        html: `Ocorreu um erro ao buscar genotipos do ensaio. Tente novamente mais tarde.`,
        width: '800',
      });
    }

    setLoading(false);
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleOrder(
    column: string,
    order: number,
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

  // function headerTableFactory(
  //   name: string,
  //   title: string,
  //   style: boolean = false
  // ) {
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
  //     cellStyle: style ? { color: "#039be5", fontWeight: "bold" } : {},
  //   };
  // }

  // function tecnologiaHeaderFactory(name: string, title: string) {
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
  //     field: "tecnologia",
  //     width: 0,
  //     sorting: true,
  //     render: (rowData: any) => (
  //       <div className="h-10 flex">
  //         <div>
  //           {`${rowData.assay_list.tecnologia.cod_tec} ${rowData.assay_list.tecnologia.name}`}
  //         </div>
  //       </div>
  //     ),
  //   };
  // }

  // function ggenHeaderFactory(name: string, title: string) {
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
  //     field: "ggen",
  //     width: 0,
  //     sorting: true,
  //     render: (rowData: any) => (
  //       <div className="h-10 flex">
  //         <div>
  //           {`${rowData.genotipo.tecnologia.cod_tec} ${rowData.genotipo.tecnologia.name}`}
  //         </div>
  //       </div>
  //     ),
  //   };
  // }

  function formatDecimal(num: number) {
    return num ? Number(num).toFixed(1) : '';
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item: any) => {
      if (columnOrder[item] === 'foco') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Foco',
            title: 'assay_list.foco.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'type_assay') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Ensaio',
            title: 'assay_list.type_assay.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'tecnologia') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tecnologia',
            title: 'assay_list.tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.assay_list.tecnologia.cod_tec} ${rowData.assay_list.tecnologia.name}`}
              </div>
            ),
          }),
        );
      }
      if (columnOrder[item] === 'ggen') {
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
      if (columnOrder[item] === 'gli') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GLI',
            title: 'assay_list.gli',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'bgm') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'BGM_ENS',
            title: 'assay_list.bgm',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'bgmGenotype') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'BGM_GEN',
            title: 'genotipo.bgm',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'gmr') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GMR_GEN',
            title: 'genotipo.gmr',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => formatDecimal(rowData.genotipo.gmr),
          }),
        );
      }
      if (columnOrder[item] === 'treatments_number') {
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
      if (columnOrder[item] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status T',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'statusAssay') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status Ensaio',
            title: 'assay_list.status',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'status_experiment') {
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
      if (columnOrder[item] === 'genotipoName') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome do genótipo',
            title: 'genotipo.name_genotipo',
            orderList,
            fieldOrder,
            handleOrder,
            cellStyle: { color: '#039be5', fontWeight: 'bold' },
          }),
        );
      }
      if (columnOrder[item] === 'nca') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NCA',
            title: 'lote.ncc',
            orderList,
            fieldOrder,
            handleOrder,
            cellStyle: { color: '#039be5', fontWeight: 'bold' },
          }),
        );
      }
    });

    return tableFields;
  }

  const columns = orderColumns(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
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

  const replacementExcel = async (): Promise<void> => {
    setLoading(true);
    await genotypeTreatmentService
      .getAll(`${filter}&excel=true`)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((item: any) => {
            const newItem: any = {};
            newItem.SAFRA = item.safra.safraName;
            newItem.FOCO = item.assay_list?.foco.name;
            newItem.ENSAIO = item.assay_list?.type_assay.name;
            newItem.TECNOLOGIA = item.assay_list?.tecnologia.cod_tec;
            newItem.GLI = item.assay_list?.gli;
            newItem.BGM_ENS = item.assay_list?.bgm === null ? '' : Number(item.assay_list?.bgm);
            newItem.NT = item.treatments_number;
            newItem.STATUS_T = item.status;
            newItem.GENOTIPO = item.genotipo.name_genotipo;
            newItem.NCA = item.lote?.ncc;
            newItem.NOVO_GENOTIPO = '';
            newItem.NOVO_STATUS = '';
            newItem.NOVO_NCA = '';
            return newItem;
          });
          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, 'Tratamentos');

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
          XLSX.writeFile(workBook, 'Substituição-genótipos.xlsx');
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

  // async function handlePagination(): Promise<void> {
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
  // await genotypeTreatmentService
  //   .getAll(parametersFilter)
  //   .then(({ status, response, total }) => {
  //     if (status === 200) {
  //       setTreatments(response);
  //       setTotalItems(total);
  //       setAfterFilter(true);
  //       setCurrentPage(0);
  //     }
  //   });

  // await callingApi(filter); // handle pagination globly
  // }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions
      .getValuesForFilter(value, filtersParams)
      .trim();

    return parameter;
  }

  function filterFieldFactory(title: string, name: string) {
    return (
      <div className="h-7 w-1/2 ml-2">
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

  function readExcel(value: any) {
    readXlsxFile(value[0]).then((rows) => {
      importService
        .validate({
          table: 'REPLACEMENT_GENOTYPE ',
          spreadSheet: rows,
          moduleId: 27,
          idSafra: userLogado.safras.safra_selecionada,
          created_by: userLogado.id,
        })
        .then(({ message }: any) => {
          Swal.fire({
            html: message,
            width: '800',
          });
        });
    });
  }

  async function handleSubmit(event: any) {
    const genotypeButton = document.querySelector(
      "input[id='genotipo']:checked",
    );
    const ncaButton = document.querySelector("input[id='nca']:checked");
    const inputFile: any = document.getElementById('import');
    event.preventDefault();

    if (genotypeButton) {
      const checkedTreatments: any = rowsSelected.map((item: any) => ({
        id: item.id,
        idGenotipo: item.id_genotipo,
        idLote: item.id_lote,
      }));

      let error = false;
      let message = '';

      // iterate checkedTreatments
      for (const item of checkedTreatments) {
        try {
          const { status, response } = await genotypeTreatmentService.getOne({
            id: item.id,
          });
          if (status == 200) {
            if (response.status_experiment == 'EXP. SORTEADO') {
              error = true;
              message
                += `Não é possível alterar genótipo de tratamentos com status EXP. SORTEADO: ID: ${
                  item.id
                }\n`;
            }
          }
        } catch (e) {
          console.log('error', e);
        }
      }

      if (error) {
        Swal.fire(message);
        setIsOpenModal(false);
        return;
      }

      const checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
      localStorage.setItem('checkedTreatments', checkedTreatmentsLocal);
      localStorage.setItem(
        'treatmentsOptionSelected',
        JSON.stringify('genotipo'),
      );

      setCookies('pageBeforeEdit', currentPage?.toString());
      setCookies('filterBeforeEdit', filter);
      setCookies('filterBeforeEditTypeOrder', typeOrder);
      setCookies('filterBeforeEditOrderBy', orderBy);
      setCookies('filtersParams', filtersParams);
      setCookies('lastPage', 'atualizar');
      setCookies('takeBeforeEdit', take);
      setCookies('itensPage', itensPerPage);

      router.push(
        '/listas/ensaios/genotipos-ensaio/substituicao?value=ensaios',
      );
    } else if (ncaButton) {
      const checkedTreatments: any = rowsSelected.map((item: any) => ({
        id: item.id,
        idGenotipo: item.id_genotipo,
        idLote: item.id_lote,
      }));
      const checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
      localStorage.setItem('checkedTreatments', checkedTreatmentsLocal);
      localStorage.setItem('treatmentsOptionSelected', JSON.stringify('nca'));

      setCookies('pageBeforeEdit', currentPage?.toString());
      setCookies('filterBeforeEdit', filter);
      setCookies('filterBeforeEditTypeOrder', typeOrder);
      setCookies('filterBeforeEditOrderBy', orderBy);
      setCookies('filtersParams', filtersParams);
      setCookies('lastPage', 'substituicao');
      router.push(
        '/listas/ensaios/genotipos-ensaio/substituicao?value=ensaios',
      );
    } else if (inputFile?.files.length !== 0 && inputFile !== null) {
      readExcel(inputFile?.files);
    } else {
      Swal.fire('Selecione alguma opção ou import');
    }
  }

  async function setRadioStatus() {
    const selectedGenotype: any = {};
    rowsSelected.forEach((item: any) => {
      selectedGenotype[item.genotipo.name_genotipo] = true;
    });
    const checkedLength = Object.getOwnPropertyNames(selectedGenotype);
    if (checkedLength.length > 1) {
      setNccIsValid(true);
    }
    if (rowsSelected.length <= 0) {
      setNccIsValid(true);
      setGenotypeIsValid(true);
    }
  }

  // Extrai a lógica de detecção de duplicatas para uma função separada
  const detectDuplicates = (selectedRows: TableRow[]) => {
    let selectedGliList: string[] = [];
    for (let i = 0; i < selectedRows.length; i++) {
      selectedGliList.push(selectedRows[i].assay_list.gli);
    }

    const gliSet = new Set(selectedGliList);
    return gliSet.size < selectedGliList.length;
  }
  

  useEffect(() => {
    console.log('rowsSelected', rowsSelected);

    // verifica registros se tem algum gli repetido na lista
    let gliList: string[] = [];
    for (let i = 0; i < rowsSelected.length; i++) {
      gliList.push(rowsSelected[i].assay_list.gli);
    }
    
    console.log('gliList', gliList);

    // verifica se há duplicatas na gliList
    const gliSet = new Set(gliList);
    const hasDuplicates = gliSet.size < (gliList?.length || 0);
    console.log(hasDuplicates); // This will log 'true' if there are duplicates, 'false' otherwise

    // encontrar o índice do primeiro item duplicado
    if (hasDuplicates) {
      const firstDuplicateIndex = gliList.findIndex((gli, index) => {
        return gliList.indexOf(gli) !== index;
      });
      
      for (const item of rowsSelected) {

        console.log('item', item);
        // index of the item
        const index = rowsSelected.indexOf(item);
        console.log('index', index);
        if (index == firstDuplicateIndex) {
          // clone item para alterar o checked
          const itemClone: TableRow = { ...item };

          if (itemClone.tableData) {
            // altera o checked para false
            itemClone.tableData.checked = false;
          }
          
          // troca o item na lista
          rowsSelected[index] = itemClone;
          
        }
      }
      
      Swal.fire({
        html: "Não é possivel selecionar mais que um registro com mesmo GLI",
        width: '900',
      });
      
    }


  }, [rowsSelected]);
  
  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  async function handlePagination(page: any) {
    await callingApi(filter, page); // handle pagination globly
  }

  function removeSameItems(data: any) {
    const newList: any = [];

    data?.map((i: any) => {
      const item = newList?.filter((x: any) => x.name == i.name);
      if (item?.length <= 0) newList.push({ id: i.id, name: i.name });
    });

    const sortList = newList?.sort((a: any, b: any) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    return sortList;
  }

  function selectableFilter(rowData: any) {
    if (isOpenModal || rowData?.status_experiment == 'EXP. SORTEADO') {
      return false;
    }

    return true;
  }

  function handleSelectionRow(data: any) {
    const selectedRow = data?.map((e: any) => ({
      ...e,
      tableData: { id: e.tableData.id, checked: false },
    }));
    console.log('handleSelectionRow', selectedRow);
    setRowsSelected(selectedRow);
  }

  const handleRowSelection = (rowData: any) => {
    console.log('handleRowSelection', rowData);
    if (rowsSelected?.includes(rowData)) {
      rowData.tableData.checked = false;
      setRowsSelected(rowsSelected.filter((item: any) => item != rowData));
    } else {
      rowData.tableData.checked = true;
      setRowsSelected([...rowsSelected, rowData]);
    }
  };

  return (
    <>
      <Head>
        <title>Listagem de genótipos do ensaio</title>
      </Head>

      {loading && <ComponentLoading text="" />}

      <Modal
        isOpen={isOpenModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => setIsOpenModal(!isOpenModal)}
        style={{ overlay: { zIndex: 1000 } }}
        overlayClassName="fixed inset-0 flex bg-transparent justify-center items-center bg-white/75"
        className="flex
          flex-col
          w-full
          h-64
          max-w-xl
          bg-gray-50
          rounded-tl-2xl
          rounded-tr-2xl
          rounded-br-2xl
          rounded-bl-2xl
          pt-2
          pb-4
          px-8
          relative
          shadow-lg
          shadow-gray-900/50"
      >
        <form className="flex flex-col">
          <button
            type="button"
            className="flex absolute top-4 right-3 justify-end"
            onClick={() => {
              setIsOpenModal(!isOpenModal);
              setNccIsValid(false);
              setGenotypeIsValid(false);
            }}
          >
            <RiCloseCircleFill
              size={35}
              className="fill-red-600 hover:fill-red-800"
            />
          </button>

          <div className="flex px-4 justify-between">
            <div className="flex w-1/3 flex-col mt-2">
              <h2 className="mb-2 text-blue-600 text-xl font-medium">Ação</h2>
              <div>
                <div className="border-l-8 border-l-blue-600 mt-4">
                  <h2 className="mb-2 font-normal text-xl ml-2 text-gray-900">
                    Substituir
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="substituir"
                    id="genotipo"
                    disabled={genotypeIsValid}
                  />
                  <label htmlFor="genotipo" className="font-normal text-base">
                    Nome do genótipo
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="substituir"
                  id="nca"
                  disabled={nccIsValid}
                />
                <label htmlFor="nca" className="font-normal text-base">
                  NCA
                </label>
              </div>
            </div>
            <div className="flex flex-1 flex-col ml-8">
              <h2 className="mb-2 text-blue-600 text-xl mt-2 font-medium">
                Total selecionados:
                {' '}
                {rowsSelected?.length}
              </h2>

              <div>
                <div className="border-l-8 border-l-blue-600">
                  <h2 className="mb-2 font-normal text-xl ml-2 text-gray-900 mt-4">
                    Importar Arquivo:
                  </h2>
                </div>

                <h2>Excel</h2>
                <button
                  type="button"
                  className="w-full h-8 ml-auto mt-0 bg-green-600 text-white px-8 rounded-lg text-sm hover:bg-green-800"
                  onClick={() => window.open('/listas/rd?importar=subs_ensaio', '_blank')}
                >
                  Importar arquivo
                </button>
                {/* <Input
                id="import"
                type="file"
                className="
              shadow
              appearance-none
              bg-white bg-no-repeat
              border border-solid border-gray-300
              rounded
              w-full
              py-1 px-1
              text-gray-900
              leading-tight
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
              /> */}
              </div>
            </div>
          </div>
          <div className="flex justify-end py-0">
            <div className="h-10 w-40">
              <button
                type="submit"
                value="Cadastrar"
                className="w-full h-full ml-auto mt-6 bg-green-600 text-white px-8 rounded-lg text-sm hover:bg-green-800"
                onClick={(e) => handleSubmit(e)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >
          <AccordionFilter
            title="Filtrar Genótipo/NCA"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
            <div className="w-full flex gap-2 z-1">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-1
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-6
                "
                >
                  {filterFieldFactory('filterFoco', 'Foco')}
                  {filterFieldFactory('filterTypeAssay', 'Ensaio')}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Cod Tec
                    </label>
                    <div className="flex">
                      <Input
                        size={7}
                        placeholder="Cód. Tecnologia"
                        id="filterCodTec"
                        name="filterCodTec"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterCodTec')}
                      />
                    </div>
                  </div>

                  {filterFieldFactory('filterTechnology', 'Nome Tec')}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Cod GGEN
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="Cód. GGEN"
                        id="filterGgenCod"
                        name="filterGgenCod"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterGgenCod')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome GGEN
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="Nome GGEN"
                        id="filterGgenName"
                        name="filterGgenName"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterGgenName')}
                      />
                    </div>
                  </div>

                  {filterFieldFactory('filterGli', 'GLI')}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      BGM_ENS
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterBgmFrom"
                        name="filterBgmFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterBgmFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterBgmTo"
                        name="filterBgmTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterBgmTo')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      BGM_GEN
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterBgmGenotypeFrom"
                        name="filterBgmGenotypeFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterBgmGenotypeFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterBgmGenotypeTo"
                        name="filterBgmGenotypeTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterBgmGenotypeTo')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      GMR_GEN
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterGmrFrom"
                        name="filterGmrFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterGmrFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterGmrTo"
                        name="filterGmrTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterGmrTo')}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pt-2
                  pb-0
                  "
                >
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NT
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterNtFrom"
                        name="filterNtFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNtFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNtTo"
                        name="filterNtTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNtTo')}
                      />
                    </div>
                  </div>
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status T
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="Status T"
                        id="filterStatusT"
                        name="filterStatusT"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterStatusT')}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status do Ensaio
                    </label>
                    <SelectMultiple
                      data={statusFilter.map((i: any) => i.title)}
                      values={statusFilterSelected}
                      onChange={(e: any) => setStatusFilterSelected(e)}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome do genótipo
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="Nome do genótipo"
                        id="filterGenotypeName"
                        name="filterGenotypeName"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterGenotypeName')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NCA
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterNcaFrom"
                        name="filterNcaFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNcaFrom')}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNcaTo"
                        name="filterNcaTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNcaTo')}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      onClick={() => {}}
                      value="Filtrar"
                      type="submit"
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
              // data={afterFilter ? treatments : []}
              data={treatments}
              options={{
                selection: true,
                selectionProps: (rowData: any) => {
                  const selectable = selectableFilter(rowData);
                  rowData.tableData.disabled = !selectable;
                  return {
                    disabled: !selectable,
                  };
                },
                // selectionProps: (rowData: any) =>
                //   isOpenModal
                //     ? { disabled: rowData }
                //     : { disabled: rowData?.status_experiment == "SORTEADO" },
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 460 : 320
                }px)`,
                headerStyle: {
                  zIndex: 1,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                // pageSize: itensPerPage,
                pageSize: Number(take),
              }}
              // localization={{
              //   body: {
              //     emptyDataSourceMessage: tableMessage
              //       ? "Nenhum Trat. Genótipo encontrado!"
              //       : "ATENÇÃO, VOCÊ PRECISA APLICAR O FILTRO PARA VER OS REGISTROS.",
              //   },
              // }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'Nenhum Trat. Genótipo encontrado!',
                },
              }}
              
              onSelectionChange={handleSelectionRow}
              onRowClick={(evt, selectedRow: any) => {
                handleRowSelection(selectedRow);
              }}
              onChangeRowsPerPage={(e: any) => {}}
              
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
                    <div className="h-12 w-32 ml-0">
                      <Button
                        title="Substituir"
                        value="Substituir"
                        textColor="white"
                        style={{ display: !perm_can_do('/listas/ensaios/genotipos-ensaio', 'change') ? 'none' : '' }}
                        onClick={() => {
                          setRadioStatus();
                          setIsOpenModal(!isOpenModal);
                          setCookies(
                            'filterSelectStatusEssay',
                            statusFilterSelected,
                          );
                          setCookies(
                            'urlPage',
                            'genotypeTreatment',
                          );
                        }}
                        bgColor="bg-blue-600"
                        icon={<RiArrowUpDownLine size={20} />}
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
                          orderColumns(e);
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
                          title="Exportar planilha para substituição"
                          icon={<BsDownload size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            replacementExcel();
                          }}
                        />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de tratamentos"
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
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'genotypeTreatment') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('urlPage', { req, res });
    removeCookies('filterSelectStatusEssay', { req, res });
  }

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';

  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  // RR

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'asc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const filterSelectStatusEssay = req.cookies.filterSelectStatusEssay
    ? JSON?.parse(req.cookies.filterSelectStatusEssay)
    : [];

  const { publicRuntimeConfig } = getConfig();
  const baseUrlTreatment = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;
  const baseUrlAssay = `${publicRuntimeConfig.apiUrl}/assay-list`;

  let filterApplication: any = '';
  if (req.cookies.ncaEmpty) {
    filterApplication = `${req.cookies.filterBeforeEdit}&filterNcaFrom=VAZIO&filterNcaTo=VAZIO`
      || `&id_culture=${idCulture}&id_safra=${idSafra}&filterNcaFrom=VAZIO&filterNcaTo=VAZIO&orderBy=gli&typeOrder=asc&orderBy=treatments_number&typeOrder=asc`;
  } else {
    filterApplication = req.cookies.filterBeforeEdit
      || `&id_culture=${idCulture}&id_safra=${idSafra}&orderBy=gli&typeOrder=asc&orderBy=treatments_number&typeOrder=asc`;
  }

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  // RR
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });
  removeCookies('filterSelectStatusEssay', { req, res });
  removeCookies('ncaEmpty', { req, res });
  removeCookies('urlPage', { req, res });

  const param = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}`;

  const paramAssay = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}`;

  //skip=0&take=${itensPerPage}

  
  const urlParametersTreatment: any = new URL(baseUrlTreatment);
  urlParametersTreatment.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allTreatments = [], total: totalItems = 0 } = await fetch(
    urlParametersTreatment.toString(),
    requestOptions,
  ).then((response) => response.json());

  const urlParametersAssay: any = new URL(baseUrlAssay);
  urlParametersAssay.search = new URLSearchParams(paramAssay).toString();
  
  const { response: allAssay = [] } = await fetch(
    urlParametersAssay.toString(),
    requestOptions,
  ).then((response) => response.json());
  
  const assaySelect = allAssay?.map((item: any) => {
    const newItem: any = {};
    newItem.id = item.gli;
    newItem.name = item.gli;
    return newItem;
  });

  const genotypeSelect = allTreatments?.map((item: any) => {
    const newItem: any = {};
    newItem.id = item.genotipo.name_genotipo;
    newItem.name = item.genotipo.name_genotipo;
    return newItem;
  });

  return {
    props: {
      allTreatments,
      assaySelect,
      genotypeSelect,
      totalItems,
      itensPerPage,
      filterApplication,
      idCulture,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
      filterSelectStatusEssay,
    },
  };
};
