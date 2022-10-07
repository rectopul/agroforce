/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef, useState, useEffect } from 'react';
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
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
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  genotypeTreatmentService,
  importService,
  userPreferencesService,
} from '../../../../services';
import * as ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';

export default function Listagem({
  assaySelect,
  genotypeSelect,
  itensPerPage,
  filterApplication,
  idSafra,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
}: ITreatmentGrid) {
  const { TabsDropDowns } = ITabs.default;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.genotypeTreatment || {
    id: 0,
    table_preferences:
      'id,foco,type_assay,tecnologia,gli,bgm,treatments_number,status,statusAssay,genotipoName,nca',
  };

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [treatments, setTreatments] = useState<ITreatment[] | any>([]);
  const [tableMessage, setMessage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(1);
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
      title: 'BGM',
      value: 'bgm',
      defaultChecked: () => camposGerenciados.includes('bgm'),
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
      title: 'IMPORTADO ',
      value: 'importado',
      defaultChecked: () => camposGerenciados.includes('importado'),
    },
    {
      name: 'StatusCheckbox',
      title: 'SORTEADO',
      value: 'sorteado',
      defaultChecked: () => camposGerenciados.includes('sorteado'),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>([]);

  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');

  const router = useRouter();
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  // const take: number = itensPerPage;
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [nccIsValid, setNccIsValid] = useState<boolean>(false);
  const [genotypeIsValid, setGenotypeIsValid] = useState<boolean>(false);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
    orderBy == 'tecnologia' ? 'genotipo.tecnologia.cod_tec' : orderBy
  }&typeOrder=${typeOrder}`;

  const formik = useFormik<ITreatmentFilter>({
    initialValues: {
      filterFoco: checkValue('filterFoco'),
      filterTypeAssay: checkValue('filterTypeAssay'),
      filterTechnology: checkValue('filterTechnology'),
      filterGli: checkValue('filterGli'),
      filterBgm: checkValue('filterBgm'),
      filterTreatmentsNumber: checkValue('filterTreatmentsNumber'),
      filterStatus: checkValue('filterStatus'),
      filterCodTec: checkValue('filterCodTec'),
      filterStatusAssay: checkValue('filterStatusAssay'),
      filterGenotypeName: checkValue('filterGenotypeName'),
      filterNca: checkValue('filterNca'),
      orderBy: '',
      typeOrder: '',
      filterBgmTo: checkValue('filterBgmTo'),
      filterBgmFrom: checkValue('filterBgmFrom'),
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
      filterNca,
      filterBgmTo,
      filterBgmFrom,
      filterNtTo,
      filterNtFrom,
      filterStatusT,
      filterCodTec,
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

      // const filterStatus = selecionados.substr(0, selecionados.length - 1);
      const filterStatus = statusFilterSelected?.join(',')?.toLowerCase();
      const parametersFilter = `&filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterTechnology=${filterTechnology}&filterGli=${filterGli}&filterBgm=${filterBgm}&filterTreatmentsNumber=${filterTreatmentsNumber}&filterStatus=${filterStatus}&filterStatusAssay=${filterStatusAssay}&filterGenotypeName=${filterGenotypeName}&filterNca=${filterNca}&id_safra=${idSafra}&filterBgmTo=${filterBgmTo}&filterBgmFrom=${filterBgmFrom}&filterNtTo=${filterNtTo}&filterNtFrom=${filterNtFrom}&filterStatusT=${filterStatusT}&filterCodTec=${filterCodTec}&status_experiment=${'IMPORTADO'}`;

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
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any) {
    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await genotypeTreatmentService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400) {
        setTreatments(response.response);
        setTotalItems(response.total);
        setAfterFilter(true);
        setMessage(true);
        tableRef.current.dataManager.changePageSize(
          response.total >= take ? take : response.total,
        );
      }
    });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleOrder(column: string, order: number): Promise<void> {
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

    // await genotypeTreatmentService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then(({ status, response }) => {
    //     if (status === 200) {
    //       setTreatments(response);
    //     }
    //   });

    // if (orderList === 2) {
    //   setOrder(0);
    // } else {
    //   setOrder(orderList + 1);
    // }

    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
  }

  function headerTableFactory(
    name: string,
    title: string,
    style: boolean = false,
  ) {
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
      cellStyle: style ? { color: '#039be5', fontWeight: 'bold' } : {},
    };
  }

  function tecnologiaHeaderFactory(name: string, title: string) {
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
      field: 'tecnologia',
      width: 0,
      sorting: true,
      render: (rowData: any) => (
        <div className="h-10 flex">
          <div>
            {`${rowData.assay_list.tecnologia.cod_tec} ${rowData.assay_list.tecnologia.name}`}
          </div>
        </div>
      ),
    };
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item) => {
      if (columnOrder[item] === 'foco') {
        tableFields.push(headerTableFactory('Foco', 'assay_list.foco.name'));
      }
      if (columnOrder[item] === 'type_assay') {
        tableFields.push(
          headerTableFactory('Ensaio', 'assay_list.type_assay.name'),
        );
      }
      if (columnOrder[item] === 'tecnologia') {
        tableFields.push(tecnologiaHeaderFactory('Tecnologia', 'tecnologia'));
      }
      if (columnOrder[item] === 'gli') {
        tableFields.push(headerTableFactory('GLI', 'assay_list.gli'));
      }
      if (columnOrder[item] === 'bgm') {
        tableFields.push(headerTableFactory('BGM', 'assay_list.bgm'));
      }
      if (columnOrder[item] === 'treatments_number') {
        tableFields.push(headerTableFactory('NT', 'treatments_number'));
      }
      if (columnOrder[item] === 'status') {
        tableFields.push(headerTableFactory('Status T', 'status'));
      }
      if (columnOrder[item] === 'statusAssay') {
        tableFields.push(
          headerTableFactory('Status do ensaio', 'assay_list.status'),
        );
      }
      if (columnOrder[item] === 'genotipoName') {
        tableFields.push(
          headerTableFactory('Nome do genótipo', 'genotipo.name_genotipo', true),
        );
      }
      if (columnOrder[item] === 'nca') {
        tableFields.push(headerTableFactory('NCA', 'lote.ncc', true));
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
    await genotypeTreatmentService
      .getAll(filter)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((item: any) => {
            const newItem: any = {};
            newItem.SAFRA = item.safra.safraName;
            newItem.FOCO = item.assay_list.foco.name;
            newItem.ENSAIO = item.assay_list.type_assay.name;
            newItem.TECNOLOGIA = `${item.assay_list.tecnologia.cod_tec} ${item.assay_list.tecnologia.name}`;
            newItem.GLI = item.assay_list.gli;
            newItem.BGM = item.assay_list.bgm;
            newItem.NT = item.treatments_number;
            newItem.STATUS_T = item.status;
            newItem.STATUS_ENSAIO = item.assay_list.status;
            newItem.GENOTIPO = item.genotipo.name_genotipo;
            newItem.NCA = item?.lote?.ncc;
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
          XLSX.writeFile(workBook, 'Tratamentos-genótipo.xlsx');
        }
      });
  };

  const replacementExcel = async (): Promise<void> => {
    await genotypeTreatmentService
      .getAll(filter)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((item: any) => {
            const newItem: any = {};
            newItem.safra = item.safra.safraName;
            newItem.foco = item.assay_list?.foco.name;
            newItem.ensaio = item.assay_list?.type_assay.name;
            newItem.tecnologia = item.assay_list?.tecnologia.cod_tec;
            newItem.gli = item.assay_list?.gli;
            newItem.bgm = item.assay_list?.bgm;
            newItem.nt = item.treatments_number;
            newItem.status_t = item.status;
            newItem.genotipo = item.genotipo.name_genotipo;
            newItem.nca = item.lote?.ncc;
            newItem.novo_genotipo = '';
            newItem.novo_status = '';
            newItem.novo_nca = '';
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
  };

  // manage total pages
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

    await callingApi(filter); // handle pagination globly
  }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams,
    );
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
          defaultValue={title}
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
      setCookies('lastPage', 'substituicao');

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
    } else if (inputFile?.files.length !== 0) {
      readExcel(inputFile.files);
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

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

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
      <Head>
        <title>Listagem de genótipos do ensaio</title>
      </Head>

      <Modal
        isOpen={isOpenModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => setIsOpenModal(!isOpenModal)}
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

          <div className="flex px-4  justify-between">
            <header className="flex flex-col mt-2">
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
            </header>
            <div>
              <div className="mb-2 text-blue-600 text-xl mt-2 font-medium">
                <h2>
                  Total selecionados:
                  {' '}
                  {rowsSelected?.length}
                </h2>
              </div>

              <div className="border-l-8 border-l-blue-600">
                <h2 className="mb-2 font-normal text-xl ml-2 text-gray-900 mt-6">
                  Importa Arquivo:
                </h2>
              </div>

              <h2>Excel</h2>
              <Input
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
              />
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
        "
        >
          <AccordionFilter title="Filtrar genótipos do ensaio">
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
                      Cód. Tecnologia
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="Cód. Tecnologia"
                        id="filterCodTec"
                        name="filterCodTec"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  {filterFieldFactory('filterTechnology', 'Nome da tecnologia')}

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      GLI
                    </label>
                    <SelectAutoComplete
                      data={assaySelect.map((i: any) => i.name)}
                      // value={checkValue("filterGli")}
                      onChange={(e: any) => formik.setFieldValue('filterGli', e)}
                      value={checkValue('filterGli')}
                    />
                  </div>

                  {/* <div className="h-7 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      GLI
                    </label>
                    <Select
                      values={assaySelect}
                      id="filterGli"
                      name="filterGli"

                      onChange={formik.handleChange}
                      selected={false}
                    />
                  </div> */}

                  {/* {filterFieldFactory('filterGli', 'GLI')} */}
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      BGM
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterBgmFrom"
                        name="filterBgmFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterBgmTo"
                        name="filterBgmTo"
                        onChange={formik.handleChange}
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
                        placeholder="De"
                        id="filterNtFrom"
                        name="filterNtFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNtTo"
                        name="filterNtTo"
                        onChange={formik.handleChange}
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

                  {/* <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status do Ensaio
                    </label>

                    <AccordionFilter>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {(provided) => (
                            <ul
                              className="w-full h-full characters"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {statusFilter.map((generate, index) => (
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
                                        defaultChecked={false}
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
                  </div> */}
                  {/* {filterFieldFactory('filterStatusAssay', 'Status do ensaio')} */}

                  <div className="h-7 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome do genótipo
                    </label>
                    {/* <Select
                      values={[
                        { id: "", name: "Selecione" },
                        ...genotypeSelect,
                      ]}
                      id="filterGenotypeName"
                      name="filterGenotypeName"
                      onChange={formik.handleChange}
                      selected={false}
                    /> */}
                    <SelectAutoComplete
                      data={removeSameItems(genotypeSelect)?.map(
                        (i: any) => i.name,
                      )}
                      value={checkValue('filterGenotypeName')}
                      onChange={(e: any) => formik.setFieldValue('filterGenotypeName', e)}
                    />
                  </div>

                  {/* {filterFieldFactory('filterGenotypeName', 'Nome genótipo')} */}
                  {filterFieldFactory('filterNca', 'NCA')}

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
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={afterFilter ? treatments : []}
              options={{
                selection: true,
                selectionProps: (rowData: any) => isOpenModal && { disabled: rowData },
                showTitle: false,
                headerStyle: {
                  zIndex: 0,
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
                    : 'ATENÇÃO, VOCÊ PRECISA APLICAR O FILTRO PARA VER OS REGISTROS.',
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
                        onClick={() => {
                          setRadioStatus();
                          setIsOpenModal(!isOpenModal);
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

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
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
    : 'desc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'assay_list.foco.name';

  const { publicRuntimeConfig } = getConfig();
  const baseUrlTreatment = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;
  const baseUrlAssay = `${publicRuntimeConfig.apiUrl}/assay-list`;

  const filterApplication = req.cookies.filterBeforeEdit
    || `&id_culture=${idCulture}&id_safra=${idSafra}&status_experiment=${'IMPORTADO'}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  // RR
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const param = `&id_culture=${idCulture}&id_safra=${idSafra}`;

  const urlParametersAssay: any = new URL(baseUrlAssay);
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

  const { response: allAssay } = await fetch(
    `${urlParametersAssay.toString()}/?id_culture=${idCulture}&id_safra=${idSafra}`,
    requestOptions,
  ).then((response) => response.json());

  const assaySelect = allAssay.map((item: any) => {
    const newItem: any = {};
    newItem.id = item.gli;
    newItem.name = item.gli;
    return newItem;
  });

  // const teste: any = {};
  // teste.id = "";
  // teste.name = "Selecione";
  // assaySelect.unshift(teste);

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
    },
  };
};
