/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { HtmlHTMLAttributes, useRef } from 'react';
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { RiCloseCircleFill, RiFileExcel2Line } from 'react-icons/ri';
import { IoReloadSharp } from 'react-icons/io5';
import { IoMdArrowBack } from 'react-icons/io';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { functionsUtils } from 'src/shared/utils/functionsUtils';
import moment from 'moment';
import { ITreatment } from '../../../interfaces/listas/ensaio/genotype-treatment.interface';
import { IGenerateProps } from '../../../interfaces/shared/generate-props.interface';

import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  FieldItemsPerPage,
  SelectMultiple,
} from '../../../components';
import InputRef from '../../../components/InputRef';
import LoadingComponent from '../../../components/Loading';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  experimentGenotipeService,
  experimentGroupService,
  userPreferencesService,
} from '../../../services';
import * as ITabs from '../../../shared/utils/dropdown';
import { IReturnObject } from '../../../interfaces/shared/Import.interface';
import { fetchWrapper, tableGlobalFunctions } from '../../../helpers';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';

interface IFilter {
  filterFoco: string;
  filterTypeAssay: string;
  filterNameTec: string;
  filterCodTec: string;
  filterGli: string;
  filterExperimentName: string;
  filterLocal: string;
  filterRepetitionFrom: string | any;
  filterRepetitionTo: string | any;
  filterStatus: string;
  filterNtFrom: string;
  filterNtTo: string;
  filterNpeFrom: string;
  filterNpeTo: string;
  filterGenotypeName: string;
  filterNca: string;
  orderBy: object | any;
  typeOrder: object | any;
}

export default function Listagem({
  allParcelas,
  totalItems,
  itensPerPage,
  experimentGroupId,
  filterApplication,
  idSafra,
  experimentGroup,
  pageBeforeEdit,
  filterBeforeEdit,
  idCulture,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const router = useRouter();
  const inputRef = useRef();
  const Iref = useRef();
  const myRef = useRef(null);

  const tabsEtiquetagemMenu = tabsOperation.map((i: any) => (i.titleTab === 'ETIQUETAGEM'
    ? { ...i, statusTab: true }
    : { ...i, statusTab: false }));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.parcelas || {
    id: 0,
    table_preferences:
      'id,foco,type_assay,tecnologia,gli,experiment,local,repetitionsNumber,status,NT,npe,name_genotipo,nca,action',
  };

  const tableRef = useRef<any>(null);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [parcelas, setParcelas] = useState<ITreatment[] | any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalPrint, setIsOpenModalPrint] = useState(false);
  const [urlPrint, setUrlPrint] = useState('');
  const [stateIframe, setStateIframe] = useState(0);
  const [tableMessage, setMessage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(0);
  const [errorMessage, setErroMessage] = useState<string>('');
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
      title: 'Nome da tecnologia',
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
      title: 'Nome experimento',
      value: 'experiment',
      defaultChecked: () => camposGerenciados.includes('experiment'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Lugar de plantio',
      value: 'local',
      defaultChecked: () => camposGerenciados.includes('local'),
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
      title: 'Nome do genótipo',
      value: 'name_genotipo',
      defaultChecked: () => camposGerenciados.includes('name_genotipo'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NCA',
      value: 'nca',
      defaultChecked: () => camposGerenciados.includes('nca'),
    },
    // {
    //   name: "CamposGerenciados[]",
    //   title: "Ação",
    //   value: "action",
    //   defaultChecked: () => camposGerenciados.includes("action"),
    // },
  ]);

  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    {
      name: 'StatusCheckbox',
      title: 'IMPRESSO',
      value: 'importado',
      defaultChecked: () => camposGerenciados.includes('importado'),
    },
    {
      name: 'StatusCheckbox',
      title: 'EM ETIQUETAGEM',
      value: 'sorteado',
      defaultChecked: () => camposGerenciados.includes('sorteado'),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>([]);

  const [statusImp, setStatusImp] = useState<IGenerateProps[]>(() => [
    {
      name: 'StatusCheckbox',
      title: 'EM ETIQUETAGEM ',
      value: 'etiquetagem',
      defaultChecked: () => camposGerenciados.includes('etiquetagem'),
    },
    {
      name: 'StatusCheckbox',
      title: 'ETIQUETAGEM FINALIZADA',
      value: 'finalizada',
      defaultChecked: () => camposGerenciados.includes('finalizada'),
    },
  ]);
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [validateNcaOne, setValidateNcaOne] = useState<string>('bg-gray-300');
  const [validateNcaTwo, setValidateNcaTwo] = useState<string>('bg-gray-300');
  const [totalMatch, setTotalMatch] = useState<number>(0);
  const [genotypeNameOne, setGenotypeNameOne] = useState<string>('');
  const [genotypeNameTwo, setGenotypeNameTwo] = useState<string>('');
  const [ncaOne, setNcaOne] = useState<string>('');
  const [ncaTwo, setNcaTwo] = useState<string>('');
  const [groupNameOne, setGroupNameOne] = useState<string>('');
  const [groupNameTwo, setGroupNameTwo] = useState<string>('');
  const [doubleVerify, setDoubleVerify] = useState<boolean>(false);
  const [parcelasToPrint, setParcelasToPrint] = useState<any>([]);
  const [dismiss, setDismiss] = useState<boolean>();
  const [writeOffId, setWriteOffId] = useState<number>();
  const [writeOffNca, setWriteOffNca] = useState<number>();
  const [rowsSelected, setRowsSelected] = useState([]);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik<any>({
    initialValues: {
      filterFoco: '',
      filterTypeAssay: '',
      filterNameTec: '',
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
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterNameTec,
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
    }) => {
      const allCheckBox: any = document.querySelectorAll(
        "input[name='StatusCheckbox']",
      );
      let selecionados = '';
      for (let i = 0; i < allCheckBox.length; i += 1) {
        if (allCheckBox[i].checked) {
          selecionados += `${allCheckBox[i].value},`;
        }
      }
      // const filterStatusT = selecionados.substr(0, selecionados.length - 1);
      const filterStatus = statusFilterSelected?.join(',');

      setLoading(true);

      // Call filter with there parameter
      const parametersFilter = `&filterStatusT=${filterStatusT}&filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterNameTec=${filterNameTec}&filterGli=${filterGli}&filterBgm=${filterBgm}&filterTreatmentsNumber=${filterTreatmentsNumber}&filterStatus=${filterStatus}&filterStatusAssay=${filterStatusAssay}&filterGenotypeName=${filterGenotypeName}&filterNcaTo=${filterNcaTo}&filterNcaFrom=${filterNcaFrom}&id_safra=${idSafra}&filterBgmTo=${filterBgmTo}&filterBgmFrom=${filterBgmFrom}&filterNtTo=${filterNtTo}&filterNtFrom=${filterNtFrom}&filterCodTec=${filterCodTec}&filterExperimentName=${filterExperimentName}&filterRepTo=${filterRepTo}&filterRepFrom=${filterRepFrom}&filterNpeTo=${filterNpeTo}&filterNpeFrom=${filterNpeFrom}&filterPlacingPlace=${filterPlacingPlace}`;

      setLoading(true);
      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    setFilter(parametersFilter);
    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);

    // parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await experimentGenotipeService
      .getAll(parametersFilter)
      .then((response: any) => {
        if (response.status === 200 || response.status === 400) {
          setParcelas(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
        setLoading(false);
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
    setLoading(true);
    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(name);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((index: any) => {
      if (columnOrder[index] === 'foco') {
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
      if (columnOrder[index] === 'type_assay') {
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
      if (columnOrder[index] === 'tecnologia') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tecnologia',
            title: 'tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.tecnologia.cod_tec} ${rowData.tecnologia.name}`}
              </div>
            ),
          }),
        );
      }
      if (columnOrder[index] === 'gli') {
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
      if (columnOrder[index] === 'experiment') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome experimento',
            title: 'experiment.experimentName',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'local') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Lugar de plantio',
            title: 'experiment.local.name_local_culture',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'rep') {
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
      if (columnOrder[index] === 'status') {
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
      if (columnOrder[index] === 'nt') {
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
      if (columnOrder[index] === 'npe') {
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
      if (columnOrder[index] === 'name_genotipo') {
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
      if (columnOrder[index] === 'nca') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NCA',
            title: 'nca',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      // if (columnOrder[index] === "action") {
      //   tableFields.push(actionTableFactory());
      // }
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
        .then((response: any) => {
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

    await experimentGenotipeService
      .getAll(filter)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((item: any) => {
            const newItem: any = {};
            newItem.CULTURA = item.safra.culture.name;
            newItem.SAFRA = item.safra.safraName;
            newItem.FOCO = item.foco.name;
            newItem.ENSAIO = item.type_assay.name;
            newItem.TECNOLOGIA = `${item.tecnologia.cod_tec} ${item.tecnologia.name}`;
            newItem.GLI = item.gli;
            newItem.EXPERIMENTO = item.experiment.experimentName;
            newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
            newItem.DELINEAMENTO = item.experiment.delineamento.name;
            newItem.REP_EXP = item.rep;
            newItem.STATUS_PARCELA = item.status;
            newItem.NT = item.nt;
            newItem.NPE = item.npe;
            newItem.STATUS_T = item.status_t;
            newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
            newItem.NCA = item.nca;
            newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

            delete newItem.id;
            return newItem;
          });
          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            workBook,
            workSheet,
            'Parcelas de expe. etiquetagem',
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
          XLSX.writeFile(workBook, 'Parcelas de expe. etiquetagem.xlsx');
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

  async function handlePagination(page: any): Promise<void> {
    setCurrentPage(page);
    await callingApi(filter, page); // handle pagination globly
  }

  function filterFieldFactory(title: string, name: string) {
    return (
      <div className="h-7 w-full ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  async function cleanState() {
    setDoubleVerify(false);
    setNcaOne('');
    setGenotypeNameOne('');
    setNcaTwo('');
    setGenotypeNameTwo('');
    setGroupNameOne('');
    setGroupNameTwo('');
    setTotalMatch(0);
    setDismiss(false);
    setWriteOffNca(0);
    setWriteOffId(0);
    setValidateNcaOne('bg-gray-300');
    setValidateNcaTwo('bg-gray-300');
    setParcelasToPrint([]);
    setErroMessage('');
    // setIsOpenModal(!isOpenModal);
    if (isOpenModal) {
      (document.getElementById('inputCode') as HTMLInputElement).value = '';
    }
    (inputRef?.current as any)?.focus();
  }

  async function handleSubmit(inputCode: any) {
    let countNca = 0;
    parcelas.map((item: any) => {
      if (item.nca == inputCode) {
        if (item.status !== 'IMPRESSO') {
          setParcelasToPrint((current: any) => [...current, item.id]);
          countNca += 1;
          setGenotypeNameOne(item?.genotipo?.name_genotipo);
          setNcaOne(item.nca);
        }
      }
    });
    const { response } = await experimentGroupService.getAll({
      id: experimentGroupId,
    });
    let colorVerify = '';
    if (countNca > 0) {
      colorVerify = 'bg-green-600';
      setGroupNameOne(response[0]?.name);
      setValidateNcaOne('bg-green-600');
      setErroMessage('');
    } else {
      colorVerify = 'bg-red-600';
      setValidateNcaOne('bg-red-600');
      setErroMessage('o NCA não existe dentro do grupo, favor clicar em limpar e tentar novamente');
    }
    setTotalMatch(countNca);
    if (colorVerify === 'bg-green-600') {
      (document.getElementById('inputCode') as HTMLInputElement).value = '';
      setDoubleVerify(true);
    } else {
      setDoubleVerify(false);
    }
  }

  async function verifyAgain(inputCode: any) {
    let countNca = 0;
    let secondNca = '';

    parcelas.map((item: any) => {
      if (item.nca == inputCode) {
        setGenotypeNameTwo(item?.genotipo?.name_genotipo);
        secondNca = item.nca;
        setNcaTwo(item.nca);
        countNca += 1;
      }
    });

    const { response } = await experimentGroupService.getAll({
      id: experimentGroupId,
    });

    let colorVerify = '';

    if (countNca > 0 && secondNca === ncaOne) {
      colorVerify = 'bg-green-600';
      setGroupNameTwo(response[0]?.name);
      setValidateNcaTwo('bg-green-600');
      setErroMessage('');
    } else {
      colorVerify = 'bg-red-600';
      setValidateNcaTwo('bg-red-600');
      setErroMessage('o NCA não existe dentro do grupo, favor clicar em limpar e tentar novamente');
    }
    setTotalMatch(countNca);

    if (colorVerify === 'bg-green-600') {
      setIsLoading(true);

      const parcelsToPrint = parcelas.filter(
        (parcela: any) => parcelasToPrint.includes(parcela.id),
      );
      const validateSeeds: any = [];

      const parcels = parcelsToPrint.map((item: any) => {
        item.type_assay.envelope?.filter(
          (seed: any) => seed.id_safra === idSafra,
        );
        if (item.type_assay.envelope?.length === 0) {
          validateSeeds.push(true);
        } else {
          return item;
        }
      });
      if (validateSeeds.includes(true)) {
        Swal.fire('Sementes não cadastradas no tipo de ensaio');
        setLoading(false);
        setIsLoading(false);
        return;
      }

      await experimentGenotipeService.update({
        idList: parcelasToPrint,
        status: 'IMPRESSO',
        userId: userLogado.id,
        count: 'print',
      });

      parcels.map((parcela: any) => {
        parcela.counter += 1;
        return parcela;
      });
      cleanState();

      if (parcels) {
        localStorage.setItem('parcelasToPrint', JSON.stringify(parcels));

        // setStateIframe(stateIframe + 1);

        resetIframe();

        // -- AQUI
        setIsOpenModalPrint(true);
        setUrlPrint('imprimir');
        cleanState();
        (document.getElementById('inputCode') as HTMLInputElement).value = '';
        setTimeout(() => (inputRef?.current as any)?.focus(), 2000);
        handlePagination(currentPage);
        // router.push("imprimir");
      }
    }

    setIsLoading(false);
  }

  async function reprint() {
    setIsLoading(true);
    const idList = rowsSelected.map((item: any) => item.id);

    const validateSeeds: any = [];
    const parcels = rowsSelected.map((item: any) => {
      item.type_assay.envelope?.filter(
        (seed: any) => seed.id_safra === idSafra,
      );
      if (item.type_assay.envelope?.length === 0) {
        validateSeeds.push(true);
      } else {
        return item;
      }
    });
    if (validateSeeds.includes(true)) {
      Swal.fire('Sementes não cadastradas no tipo de ensaio');
      setLoading(false);
      setIsLoading(false);
      return;
    }
    await experimentGenotipeService.update({
      idList,
      status: 'IMPRESSO',
      userId: userLogado.id,
      count: 'reprint',
    });

    parcels.map((parcela: any) => {
      parcela.counter += 1;
      return parcela;
    });
    cleanState();

    if (parcels) {
      localStorage.setItem('parcelasToPrint', JSON.stringify(parcels));

      // setStateIframe(stateIframe + 1);

      resetIframe();

      // -- AQUI
      setIsOpenModalPrint(true);
      setUrlPrint('imprimir');
      cleanState();
      setTimeout(() => (inputRef?.current as any)?.focus(), 2000);
      handlePagination(currentPage);
      // router.push("imprimir");
    }

    setIsLoading(false);
  }

  async function writeOff(inputCode: any) {
    if (!doubleVerify) {
      (document.getElementById('inputCode') as HTMLInputElement).value = '';
      setDoubleVerify(true);
    } else {
      // NA CHAMADA TEM QUE SER MANDANDO O NUMERO DO NPE PARA A API DAR BAIXA
      let writeOffIdList = parcelas.filter(
        (item: any) => item.npe === inputCode,
      );
      writeOffIdList = writeOffIdList.map((item: any) => item.id);
      try {
        await experimentGenotipeService.update({
          idList: writeOffIdList,
          npe: inputCode,
          status: 'EM ETIQUETAGEM',
          userId: userLogado.id,
          count: 'writeOff',
        });

        cleanState();
        handlePagination(currentPage);
        setIsOpenModal(false);
      } catch (error) {
        cleanState();
        Swal.fire('Erro ao tentar dar baixa na parcela.');
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => onPressEscape(e));

    return () => {
      document.removeEventListener('keydown', (e) => console.log(e));
    };
  }, []);

  function onPressEscape(e: any) {
    if (e?.keyCode === 27) cleanState();
  }

  function onPressKey(e: any) {
    const inputCode: any = (
      document.getElementById('inputCode') as HTMLInputElement
    )?.value;
    if (inputCode?.length < 9) {
      setErroMessage('o Código deve ser de 8 dígitos para baixa(NPE) é 13 para impressão(NCA)');
    }
    if (e?.charCode === 13 || e?.charCode === 10) validateInput();
  }

  async function validateInput() {
    const inputCode: any = (
      document.getElementById('inputCode') as HTMLInputElement
    )?.value;
    if (inputCode?.length === 13) {
      const lastNumber = parseInt(inputCode?.substring(12, 13));
      const withoutDigit = parseInt(inputCode?.substring(0, 12));

      if (doubleVerify) {
        if (functionsUtils?.generateDigitEAN13(inputCode) !== lastNumber) {
          setErroMessage('o Dígito verificador não confere com o NCA, favor clicar em limpar e tentar novamente');
          setValidateNcaTwo('bg-red-600');
          return;
        }

        verifyAgain(withoutDigit);
      } else {
        if (functionsUtils?.generateDigitEAN13(inputCode) !== lastNumber) {
          setErroMessage('o Dígito verificador não confere com o NCA, favor clicar em limpar e tentar novamente');
          setValidateNcaOne('bg-red-600');
          return;
        }

        handleSubmit(withoutDigit);
      }
    }

    if (inputCode?.length === 8) {
      const lastNumber = parseInt(inputCode?.substring(7, 8));
      const withoutDigit = parseInt(inputCode?.substring(0, 7));

      if (functionsUtils?.generateDigitEAN8(inputCode) !== lastNumber) {
        doubleVerify
          ? (
            setErroMessage('o Dígito verificador não confere com a NPE, favor clicar em limpar e tentar novamente'),
            setValidateNcaTwo('bg-red-600')
          )
          : (
            setErroMessage('o Dígito verificador não confere com a NPE, favor clicar em limpar e tentar novamente'),
            setValidateNcaOne('bg-red-600')
          );
        return;
      }

      doubleVerify
        ? (
          setErroMessage(''),
          setValidateNcaTwo('bg-green-600')
        )
        : (
          setErroMessage(''),
          setValidateNcaOne('bg-green-600')
        );
      writeOff(withoutDigit);
    }
  }

  useEffect(() => {
    handlePagination(0);
  }, []);

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  function openModal() {
    setIsOpenModal(true);
    setTimeout(() => (inputRef?.current as any)?.focus(), 100);
  }

  function selectableFilter(rowData: any) {
    if (isOpenModal || rowData?.status != 'IMPRESSO') {
      return false;
    }

    return true;
  }

  function resetIframe() {
    setStateIframe(stateIframe + 1);
  }

  return (
    <>
      <Head>
        <title>Listagem de parcelas</title>
      </Head>

      {loading && <LoadingComponent text="" />}

      {isLoading && (
        <LoadingComponent text="Gerando etiquetas para impressão..." />
      )}

      <Modal
        isOpen={isOpenModalPrint}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => {
          setIsOpenModalPrint(!isOpenModalPrint);
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
          shadow-gray-900/50
          modalEtiquetaAutomatizada"
      >
        <h3>Impressão de etiquetas</h3>
        <button
          type="button"
          className="flex absolute top-4 right-3 justify-end"
          onClick={() => {
            cleanState();
            setIsOpenModalPrint(false);
          }}
        >
          <RiCloseCircleFill
            size={35}
            className="fill-red-600 hover:fill-red-800"
          />
        </button>

        <iframe
          src={urlPrint}
          key={stateIframe}
          id="iframePrint"
          ref={myRef}
          width="100%"
          height="100%"
        />
      </Modal>

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
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <header className="flex flex-col mt-2">
            <h2 className="mb-2 text-blue-600 text-xl font-medium">
              {`Total NCA encontrado(s) no grupo: ${totalMatch}`}
            </h2>
          </header>
          <button
            type="button"
            className="flex absolute top-4 right-3 justify-end"
            onClick={() => {
              cleanState();
              setIsOpenModal(false);
              // const ifr: any = document.getElementById('iframePrint');
              // ifr!.style.display = 'none';
            }}
          >
            <RiCloseCircleFill
              size={35}
              className="fill-red-600 hover:fill-red-800"
            />
          </button>

          <div className="w-72 flex mt-1">
            <div className="w-44">
              <InputRef
                type="text"
                placeholder="Código de barras (NCA)"
                // disabled={
                //   validateNcaOne === "bg-red-600" ||
                //   validateNcaTwo === "bg-red-600"
                // }
                id="inputCode"
                name="inputCode"
                maxLength={13}
                // onChange={validateInput}
                onKeyPress={onPressKey}
                ref={inputRef}
              />
            </div>

            <div className="w-24 h-24">
              {errorMessage}
            </div>

            <div className="w-20 h-7 ml-2">
              {(validateNcaOne === 'bg-red-600'
                || validateNcaTwo === 'bg-red-600') && (
                <Button
                  type="button"
                  title="Limpar"
                  value="Limpar"
                  textColor="white"
                  onClick={() => cleanState()}
                  bgColor="bg-blue-600"
                />
              )}
            </div>
          </div>

          <div className="flex flex-1 mt-8">
            <div className="flex flex-1">
              <div className="bg-blue-600 w-1 h-34 mr-2" />
              <div>
                <div className={`${validateNcaOne} h-6 w-20 rounded-xl mb-2`} />
                <p className="font-bold text-xs">NCA</p>
                <p className="h-4 font-bold text-xs text-blue-600">{ncaOne}</p>
                <p className="font-bold text-xs mt-1">Nome do genótipo</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {genotypeNameOne}
                </p>
                {/* <p className="font-bold text-xs mt-1">Nome do grupo de exp</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {groupNameOne}
                </p> */}
              </div>
            </div>
            <div className="flex flex-1">
              <div className="bg-blue-600 w-1 h-34 mr-2" />
              <div>
                <div className={`${validateNcaTwo} h-6 w-20 rounded-xl mb-2`} />
                <p className="font-bold text-xs">NCA</p>
                <p className="h-4 font-bold text-xs text-blue-600">{ncaTwo}</p>
                <p className="font-bold text-xs mt-1">Nome do genótipo</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {genotypeNameTwo}
                </p>
                {/* <p className="font-bold text-xs mt-1">Nome do grupo de exp</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {groupNameTwo}
                </p> */}
              </div>
            </div>
          </div>

        </form>
      </Modal>

      <Content contentHeader={tabsEtiquetagemMenu} moduloActive="operacao">
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
                      />
                    </div>
                  </div>

                  {filterFieldFactory('filterNameTec', 'Nome Tec')}
                  {filterFieldFactory('filterGli', 'GLI')}
                  {filterFieldFactory('filterExperimentName', 'Experimento')}
                  {filterFieldFactory('filterPlacingPlace', 'Lugar plantio')}
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
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterRepTo"
                        name="filterRepTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status EXP
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
                        defaultValue="filterNtFrom"
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNtTo"
                        name="filterNtTo"
                        onChange={formik.handleChange}
                        defaultValue="filterNtTo"
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
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNpeTo"
                        name="filterNpeTo"
                        onChange={formik.handleChange}
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
                      />
                      <Input
                        type="text"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNcaTo"
                        name="filterNcaTo"
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
              data={parcelas}
              options={{
                // showSelectAllCheckbox: false,
                selection: true,
                selectionProps: (rowData: any) => {
                  const selectable = selectableFilter(rowData);
                  rowData.tableData.disabled = !selectable;
                  return {
                    disabled: !selectable,
                  };
                },
                // selectionProps: (rowData: any) => ({
                //   disabled: rowData.status !== "IMPRESSO",
                // }),
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
                pageSize: Number(take),
              }}
              onChangeRowsPerPage={() => {}}
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
                    <div className="flex">
                      <div className="h-12 w-32">
                        <Button
                          title="Ação"
                          value="Ação"
                          textColor="white"
                          onClick={() => (rowsSelected?.length > 0 ? reprint() : openModal())}
                          bgColor="bg-blue-600"
                        />
                      </div>
                      <div className="h-12 w-32 ml-4">
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
                    </div>

                    <strong className="text-blue-600">
                      Qte. exp:
                      {' '}
                      {experimentGroup.experimentAmount}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq. a imp.:
                      {' '}
                      {experimentGroup.tagsToPrint}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq. imp.:
                      {' '}
                      {experimentGroup.tagsPrinted}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq.:
                      {' '}
                      {experimentGroup.totalTags}
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
                                        {(providers) => (
                                          <li
                                            ref={providers.innerRef}
                                            {...providers.draggableProps}
                                            {...providers.dragHandleProps}
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
  query,
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('filtersParams', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('itensPage', { req, res });
    removeCookies('filterSelectStatusGrupoExp', { req, res });
  }
  
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;
  const experimentGroupId = query.id;

  const filterApplication = `&id_culture=${idCulture}&id_safra=${idSafra}&experimentGroupId=${experimentGroupId}`;

  const param = `&id_culture=${idCulture}&id_safra=${idSafra}&experimentGroupId=${experimentGroupId}`;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlParcelas = `${publicRuntimeConfig.apiUrl}/experiment-genotipe`;
  const urlParametersParcelas: any = new URL(baseUrlParcelas);
  urlParametersParcelas.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allParcelas = [], total: totalItems = 0 } = await fetch(
    urlParametersParcelas.toString(),
    requestOptions,
  ).then((response) => response.json());

  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/experiment-group`;
  const experimentGroup = await fetch(
    `${baseUrlShow}/${experimentGroupId}`,
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allParcelas,
      totalItems,
      experimentGroupId,
      itensPerPage,
      filterApplication,
      idSafra,
      experimentGroup,
      pageBeforeEdit,
      filterBeforeEdit,
      idCulture,
      orderByserver, // RR
      typeOrderServer, // RR
    },
  };
};
