/* eslint-disable camelcase */
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
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
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
import { experimentGenotipeService } from 'src/services/experiment-genotipe.service';
import { ExperimentGenotipeController } from 'src/controllers/experiment-genotipe.controller';
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
  SelectMultiple,
  FieldItemsPerPage,
  SelectAutoComplete, ManageFields,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  genotypeTreatmentService,
  importService,
  userPreferencesService,
} from '../../../../services';
import * as ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';
import { functionsUtils } from '../../../../shared/utils/functionsUtils';
import { perm_can_do } from '../../../../shared/utils/perm_can_do';

export default function Listagem({
  // assaySelect,
  genotypeSelect,
  itensPerPage,
  filterApplication,
  idSafra,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
  filterSelectStatusParcel,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);
  const { TabsDropDowns } = ITabs.default;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (tab.titleTab === 'EXPERIMENTOS'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const router = useRouter();

  // const userLogado = JSON.parse(localStorage.getItem('user') as string);
  // const preferences = userLogado.preferences.parcelas || {
  //   id: 0,
  //   table_preferences:
  //     'id,foco,type_assay,tecnologia,gli,experiment,culture,status_t,rep,status,nt,npe,genotipo,nca',
  // };

  const [userLogado, setUserLogado] = useState<any>(JSON.parse(localStorage.getItem('user') as string));
  const table = 'experiment_genotipe';
  const module_name = 'parcelas';
  const module_id = 30;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,foco,type_assay,tecnologia,gli,experiment,culture,status_t,rep,status,nt,npe,genotipo,nca,grp';
  const preferencesDefault = {
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  };

  const [preferences, setPreferences] = useState<any>(userLogado.preferences[identifier_preference] || preferencesDefault);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [treatments, setTreatments] = useState<ITreatment[] | any>([]);
  const [tableMessage, setMessage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'CheckBox ',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
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
      title: 'GLI',
      value: 'gli',
      defaultChecked: () => camposGerenciados.includes('gli'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Experimento',
      value: 'experiment',
      defaultChecked: () => camposGerenciados.includes('experiment'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Lugar plantio',
      value: 'culture',
      defaultChecked: () => camposGerenciados.includes('culture'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'GRP',
      value: 'grp',
      defaultChecked: () => camposGerenciados.includes('grp'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'StatusT',
      value: 'status_t',
      defaultChecked: () => camposGerenciados.includes('status_t'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'REP EXP',
      value: 'rep',
      defaultChecked: () => camposGerenciados.includes('rep'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status da parcela',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NT',
      value: 'nt',
      defaultChecked: () => camposGerenciados.includes('nt'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NPE',
      value: 'npe',
      defaultChecked: () => camposGerenciados.includes('npe'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome genótipo',
      value: 'genotipo',
      defaultChecked: () => camposGerenciados.includes('genotipo'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NCA',
      value: 'nca',
      defaultChecked: () => camposGerenciados.includes('nca'),
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    // {
    //   name: "StatusCheckbox",
    //   title: "IMPORTADO ",
    //   value: "importado",
    //   defaultChecked: () => camposGerenciados.includes("importado"),
    // },
    {
      name: 'StatusCheckbox',
      title: 'SORTEADO',
      value: 'sorteado',
      defaultChecked: () => camposGerenciados.includes('sorteado'),
    },
    {
      name: 'StatusCheckbox',
      title: 'EM ETIQUETAGEM',
      value: 'EM ETIQUETAGEM',
      defaultChecked: () => camposGerenciados.includes('EM ETIQUETAGEM'),
    },
    {
      name: 'StatusCheckbox',
      title: 'IMPRESSO',
      value: 'IMPRESSO',
      defaultChecked: () => camposGerenciados.includes('IMPRESSO'),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>(
    filterSelectStatusParcel,
  );

  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  // const take: number = itensPerPage;
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  // const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
  //   orderBy == "tecnologia" ? "genotipo.tecnologia.cod_tec" : orderBy
  // }&typeOrder=${typeOrder}`; // RR

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const [nccIsValid, setNccIsValid] = useState<boolean>(false);
  const [genotypeIsValid, setGenotypeIsValid] = useState<boolean>(false);
  const [rowsSelected, setRowsSelected] = useState([]);

  const formik = useFormik<any>({
    initialValues: {
      filterFoco: '',
      filterTypeAssay: '',
      filterTechnology: '',
      filterGli: '',
      filterBgm: '',
      filterTreatmentsNumber: '',
      filterStatus: '',
      filterStatusAssay: '',
      filterGenotypeName: '',
      filterNcaTo: '',
      filterNcaFrom: '',
      orderBy: '',
      typeOrder: '',
      filterBgmTo: '',
      filterBgmFrom: '',
      filterNtTo: '',
      filterNtFrom: '',
      filterNpeTo: '',
      filterNpeFrom: '',
      filterRepTo: '',
      filterRepFrom: '',
      filterStatusT: '',
      filterCodTec: '',
      filterExperimentName: '',
      filterPlacingPlace: '',
      filterGrpTo: '',
      filterGrpFrom: '',
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
      filterNcaTo,
      filterNcaFrom,
      filterBgmTo,
      filterBgmFrom,
      filterNtTo,
      filterNtFrom,
      filterNpeTo,
      filterNpeFrom,
      filterRepTo,
      filterRepFrom,
      filterStatusT,
      filterCodTec,
      filterExperimentName,
      filterPlacingPlace,
      filterGrpTo,
      filterGrpFrom,
    }) => {
      if (!functionsUtils?.isNumeric(filterRepFrom)) {
        return Swal.fire('O campo REP EXP não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterRepTo)) {
        return Swal.fire('O campo REP EXP não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNtFrom)) {
        return Swal.fire('O campo NT não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNtTo)) {
        return Swal.fire('O campo NT não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNpeFrom)) {
        return Swal.fire('O campo NPE não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNpeTo)) {
        return Swal.fire('O campo NPE não pode ter ponto ou vírgula.');
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
      const filterStatus = statusFilterSelected?.join(',');

      const parametersFilter = `&filterStatusT=${filterStatusT}&filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterTechnology=${filterTechnology}&filterGli=${filterGli}&filterBgm=${filterBgm}&filterTreatmentsNumber=${filterTreatmentsNumber}&filterStatus=${filterStatus}&filterStatusAssay=${filterStatusAssay}&filterGenotypeName=${filterGenotypeName}&filterNcaTo=${filterNcaTo}&filterNcaFrom=${filterNcaFrom}&id_safra=${idSafra}&filterBgmTo=${filterBgmTo}&filterBgmFrom=${filterBgmFrom}&filterNtTo=${filterNtTo}&filterNtFrom=${filterNtFrom}&filterCodTec=${filterCodTec}&filterExperimentName=${filterExperimentName}&filterRepTo=${filterRepTo}&filterRepFrom=${filterRepFrom}&filterNpeTo=${filterNpeTo}&filterNpeFrom=${filterNpeFrom}&filterPlacingPlace=${filterPlacingPlace}&filterGrpTo=${filterGrpTo}&filterGrpFrom=${filterGrpFrom}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
      // await genotypeTreatmentService
      //     .getAll(`${parametersFilter}`)
      //     .then(({ response, total: allTotal }) => {
      //         setFilter(parametersFilter);
      //         setTreatments(response);
      //         setTotalItems(allTotal);
      //         setAfterFilter(true);
      //         setCurrentPage(0);
      //         setMessage(true);
      //         tableRef.current.dataManager.changePageSize(allTotal >= take ? take : allTotal);
      //     });

      setLoading(true);
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
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    setLoading(true);

    try {
      await experimentGenotipeService
        .getAll(parametersFilter)
        .then((response) => {
          if (response.status === 200 || response.status === 400) {
            setTreatments(response.response);
            setTotalItems(response.total);
            tableRef.current.dataManager.changePageSize(
              response.total >= take ? take : response.total,
            );
            setLoading(false);
          }
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: 'Falha ao buscar parcelas',
        html: `Ocorreu um erro ao buscar parcelas. Tente novamente mais tarde.`,
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

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item: any) => {
      if (columnOrder[item] === 'foco') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Foco',
            title: 'foco.name',
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
            title: 'type_assay.name',
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
            title: 'tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.experiment.assay_list.tecnologia.cod_tec} ${rowData.experiment.assay_list.tecnologia.name}`}
              </div>
            ),
          }),
        );
      }
      if (columnOrder[item] === 'gli') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GLI',
            title: 'gli',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'experiment') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Experimento',
            title: 'experiment.experimentName',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'culture') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Lugar plantio',
            title: 'experiment.local.name_local_culture',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'status_t') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'StatusT',
            title: 'status_t',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'rep') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'REP EXP',
            title: 'rep',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status da parcela',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'nt') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NT',
            title: 'nt',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'npe') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NPE',
            title: 'npe',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'grp') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GRP',
            title: 'group.group',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'genotipo') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome genótipo',
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
            title: 'nca',
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
          module_id: 30,
        })
        .then((response) => {
          userLogado.preferences.parcelas = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.parcelas = {
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
    status;
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

    await experimentGenotipeService
      .getAll(filterParam)
      .then(({ status, response }) => {
        if (!response.A1) {
          Swal.fire('Nenhum dado para extrair');
          return;
        }
        if (status === 200) {
          const workBook = XLSX.utils.book_new();
          // workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
          XLSX.utils.book_append_sheet(workBook, response, 'Parcelas');
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
          XLSX.writeFile(workBook, 'Parcelas.xlsx');
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
    await experimentGenotipeService
      .getAll(filter)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((item: any) => {
            const newItem: any = {};
            newItem.SAFRA = item.safra.safraName;
            newItem.FOCO = item.foco.name;
            newItem.ENSAIO = item.type_assay.name;
            newItem.TECNOLOGIA = item.tecnologia.cod_tec;
            newItem.GLI = item.gli;
            newItem.EXPERIMENTO = item.experiment.experimentName;
            newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
            newItem.DELINEAMENTO = item.experiment.delineamento.name;
            newItem.REP = item.rep;
            newItem.NT = item.nt;
            newItem.NPE = item.npe;
            newItem.STATUS_T = item.status_t;
            newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
            newItem.NCA = item.nca;
            newItem.NOVO_GENOTIPO = '';
            newItem.NOVO_STATUS = '';
            newItem.NOVO_NCA = '';

            delete newItem.id;
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
          XLSX.writeFile(workBook, 'Substituição-parcelas.xlsx');
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
    //   parametersFilter = `skip=${skip}&take=${take}`;
    // } else {
    //   parametersFilter = `skip=${skip}&take=${take}`;
    // }

    // if (filter) {
    //   parametersFilter = `${parametersFilter}&${filter}`;
    // }
    // // await genotypeTreatmentService
    // //     .getAll(parametersFilter)
    // //     .then(({ status, response }) => {
    // //         if (status === 200) {
    // //             setTreatments(response);
    // //         }
    // //     });
    // await experimentGenotipeService.getAll(parametersFilter).then(({ response, total: allTotal }) => {
    //   setTreatments(response);
    //   setTotalItems(allTotal);
    // });

    await callingApi(filter, page); // handle pagination globly
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

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams,
    );
    return parameter;
  }

  function selectableFilter(rowData: any) {
    if (isOpenModal || rowData?.status === 'IMPRESSO') {
      return false;
    }

    return true;
  }

  async function readExcel(value: any) {
    readXlsxFile(value[0]).then((rows) => {
      importService
        .validate({
          table: 'REPLACEMENT_GENOTYPE ',
          spreadSheet: rows,
          moduleId: 27,
          idSafra: userLogado.safras.safra_selecionada,
          created_by: userLogado.id,
        })
        .then(({ status, message }: any) => {
          Swal.fire({
            html: message,
            width: '800',
          });
          if (status != 400 && status == 200) {
            handlePagination(currentPage);
          }
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
        idGenotipo: item.idGenotipo,
        idLote: item.idLote,
      }));
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
        '/listas/ensaios/genotipos-ensaio/substituicao?value=experiment',
      );
    } else if (ncaButton) {
      const checkedTreatments: any = rowsSelected.map((item: any) => ({
        id: item.id,
        genotipo: item.name_genotipo,
        idGenotipo: item.idGenotipo,
        idLote: item.idLote,
      }));

      setCookies('pageBeforeEdit', currentPage?.toString());
      setCookies('filterBeforeEdit', filter);
      setCookies('filterBeforeEditTypeOrder', typeOrder);
      setCookies('filterBeforeEditOrderBy', orderBy);
      setCookies('filtersParams', filtersParams);
      setCookies('lastPage', 'atualizar');
      setCookies('takeBeforeEdit', take);
      setCookies('itensPage', itensPerPage);

      const checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
      localStorage.setItem('checkedTreatments', checkedTreatmentsLocal);
      localStorage.setItem('treatmentsOptionSelected', JSON.stringify('nca'));

      router.push(
        '/listas/ensaios/genotipos-ensaio/substituicao?value=experiment',
      );
    } else if (inputFile?.files.length !== 0) {
      const value = await readExcel(inputFile.files);
    } else {
      Swal.fire('Selecione alguma opção ou import');
    }
  }

  async function setRadioStatus() {
    const selectedGenotype: any = {};

    rowsSelected.forEach((item: any) => {
      selectedGenotype[item?.genotipo?.name_genotipo] = true;
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

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  function removeSameItems(data: any) {
    const newList: any = [];

    data?.map((i: any) => {
      const item = newList?.filter((x: any) => x.name == i.name);
      if (item?.length <= 0) newList.push({ id: i.id, name: i.name });
    });

    const sortList = newList?.sort((a: any, b: any) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    return sortList;
  }

  return (
    <>
      {loading && <ComponentLoading text="" />}

      <Head>
        <title>Listagem de parcelas dos experimentos</title>
      </Head>

      <Modal
        isOpen={isOpenModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => {
          setIsOpenModal(!isOpenModal);
        }}
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
                  onClick={() => window.open(
                    '/listas/rd?importar=subs_experimento',
                    '_black',
                  )}
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
            title="Filtrar parcelas dos experimentos"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
            <div className="w-full flex gap-2">
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

                  pb-8
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
                        type="number"
                        placeholder="Cod Tec"
                        id="filterCodTec"
                        name="filterCodTec"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterCodTec')}
                      />
                    </div>
                  </div>

                  {filterFieldFactory('filterTechnology', 'Nome Tec')}
                  {filterFieldFactory('filterGli', 'GLI')}
                  {filterFieldFactory('filterExperimentName', 'Experimento')}
                  {filterFieldFactory('filterPlacingPlace', 'Lugar plantio')}
                  {filterFieldFactory('filterStatusT', 'StatusT')}
                </div>
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pt-0
                  pb-0
                  "
                >
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      REP EXP
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterRepFrom"
                        name="filterRepFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterRepFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterRepTo"
                        name="filterRepTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterRepTo')}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status da parcela
                    </label>
                    <SelectMultiple
                      data={statusFilter.map((i: any) => i.title)}
                      values={statusFilterSelected}
                      onChange={(e: any) => setStatusFilterSelected(e)}
                    />
                  </div>

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
                      NPE
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterNpeFrom"
                        name="filterNpeFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNpeFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNpeTo"
                        name="filterNpeTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNpeTo')}
                      />
                    </div>
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
                        type="text"
                        placeholder="De"
                        id="filterNcaFrom"
                        name="filterNcaFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNcaFrom')}
                      />
                      <Input
                        type="text"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNcaTo"
                        name="filterNcaTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNcaTo')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      GRP
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterGrpFrom"
                        name="filterGrpFrom"
                        defaultValue={checkValue('filterGrpFrom')}
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterGrpTo"
                        name="filterGrpTo"
                        defaultValue={checkValue('filterGrpTo')}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage
                    selected={take}
                    onChange={setTake}
                    widthClass="w-1/2"
                  />

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
                // selectionProps: (rowData: any) => isOpenModal && { disabled: rowData },
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
              localization={{
                body: {
                  emptyDataSourceMessage: tableMessage
                    ? 'Nenhum Trat. Genótipo encontrado!'
                    : '',
                },
              }}
              onChangeRowsPerPage={(e: any) => {}}
              onSelectionChange={setRowsSelected}
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
                        style={{ display: !perm_can_do('/listas/experimentos/parcelas-experimento', 'change') ? 'none' : '' }}
                        onClick={() => {
                          setRadioStatus();
                          setIsOpenModal(!isOpenModal);
                          setCookies(
                            'filterSelectStatusParcel',
                            statusFilterSelected,
                          );
                          setCookies(
                            'urlPage',
                            'parcelas',
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

                    <div className="h-full flex items-center gap-2">

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
                        OnSetStatusAccordion={(e: any) => { setStatusAccordion(e); }}
                        OnSetGeneratesProps={(e: any) => { setGeneratesProps(e); }}
                        OnSetCamposGerenciados={(e: any) => { setCamposGerenciados(e); }}
                        OnColumnsOrder={(e: any) => { orderColumns(e); }}
                        OnSetUserLogado={(e: any) => { setUserLogado(e); }}
                        OnSetPreferences={(e: any) => { setPreferences(e); }}
                      />

                      {/* <div className="border-solid border-2 border-blue-600 rounded"> */}
                      {/*  <div className="w-64"> */}
                      {/*    <AccordionFilter */}
                      {/*      title="Gerenciar Campos" */}
                      {/*      grid={statusAccordion} */}
                      {/*    > */}
                      {/*      <DragDropContext onDragEnd={handleOnDragEnd}> */}
                      {/*        <Droppable droppableId="characters"> */}
                      {/*          {(provided) => ( */}
                      {/*            <ul */}
                      {/*              className="w-full h-full characters" */}
                      {/*              {...provided.droppableProps} */}
                      {/*              ref={provided.innerRef} */}
                      {/*            > */}
                      {/*              <div className="h-8 mb-3"> */}
                      {/*                <Button */}
                      {/*                  value="Atualizar" */}
                      {/*                  bgColor="bg-blue-600" */}
                      {/*                  textColor="white" */}
                      {/*                  onClick={getValuesColumns} */}
                      {/*                  icon={<IoReloadSharp size={20} />} */}
                      {/*                /> */}
                      {/*              </div> */}
                      {/*              {generatesProps.map((generate, index) => ( */}
                      {/*                <Draggable */}
                      {/*                  key={index} */}
                      {/*                  draggableId={String(generate.title)} */}
                      {/*                  index={index} */}
                      {/*                > */}
                      {/*                  {(providers) => ( */}
                      {/*                    <li */}
                      {/*                      ref={providers.innerRef} */}
                      {/*                      {...providers.draggableProps} */}
                      {/*                      {...providers.dragHandleProps} */}
                      {/*                    > */}
                      {/*                      <CheckBox */}
                      {/*                        name={generate.name} */}
                      {/*                        title={generate.title?.toString()} */}
                      {/*                        value={generate.value} */}
                      {/*                        defaultChecked={camposGerenciados.includes( */}
                      {/*                          generate.value, */}
                      {/*                        )} */}
                      {/*                      /> */}
                      {/*                    </li> */}
                      {/*                  )} */}
                      {/*                </Draggable> */}
                      {/*              ))} */}
                      {/*              {provided.placeholder} */}
                      {/*            </ul> */}
                      {/*          )} */}
                      {/*        </Droppable> */}
                      {/*      </DragDropContext> */}
                      {/*    </AccordionFilter> */}
                      {/*  </div> */}
                      {/* </div> */}

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

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'parcelas') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('urlPage', { req, res });
    removeCookies('filterSelectStatusParcel', { req, res });
  }

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlTreatment = `${publicRuntimeConfig.apiUrl}/experiment-genotipe`;
  const baseUrlAssay = `${publicRuntimeConfig.apiUrl}/experiment`;

  const filterApplication = req.cookies.filterBeforeEdit
    || `&id_culture=${idCulture}&id_safra=${idSafra}`;

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'asc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'npe';

  const filterSelectStatusParcel = req.cookies.filterSelectStatusParcel
    ? JSON?.parse(req.cookies.filterSelectStatusParcel)
    : [];

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });
  removeCookies('filterSelectStatusParcel', { req, res });

  const param = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}`;

  const urlParametersAssay: any = new URL(baseUrlAssay);
  const urlParametersTreatment: any = new URL(baseUrlTreatment);
  urlParametersTreatment.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allExpTreatments = [], total: totalItems = 0 } = await fetch(urlParametersTreatment.toString(), requestOptions).then(
    (response) => response.json(),
  );

  const genotypeSelect = allExpTreatments?.map((item: any) => {
    const newItem: any = {};
    newItem.id = item.genotipo.name_genotipo;
    newItem.name = item.genotipo.name_genotipo;
    return newItem;
  });
  return {
    props: {
      allExpTreatments,
      // assaySelect,
      genotypeSelect,
      totalItems,
      itensPerPage,
      filterApplication,
      idCulture,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
      filterSelectStatusParcel,
    },
  };
};
