/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Checkbox as Checkbox1 } from '@mui/material';
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
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
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { BsDownload } from 'react-icons/bs';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiCloseCircleFill, RiFileExcel2Line } from 'react-icons/ri';
// import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { FaLevelUpAlt } from 'react-icons/fa';
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
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  genotypeTreatmentService,
  userPreferencesService,
} from '../../../../services';
import * as ITabs from '../../../../shared/utils/dropdown';

export default function Listagem({
  assaySelect,
  genotypeSelect,
  itensPerPage,
  filterApplication,
  idSafra,
  filterBeforeEdit,
}: ITreatmentGrid) {
  const { TabsDropDowns } = ITabs.default;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.genotypeTreatment || {
    id: 0,
    table_preferences:
      'id,foco,type_assay,tecnologia,gli,bgm,treatments_number,genotype_treatment,status,action',
  };

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [treatments, setTreatments] = useState<ITreatment[] | any>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(1);
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(0);
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
      title: 'Nome da Tec.',
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
      title: 'Nome genótipo',
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
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const router = useRouter();
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const checkedItems: any = {};
  const [checkedAllItems, setCheckedAllItems] = useState<boolean>(true);
  const [nccIsValid, setNccIsValid] = useState<boolean>(false);
  const [genotypeIsValid, setGenotypeIsValid] = useState<boolean>(false);
  const [rowsSelected, setRowsSelected] = useState([]);

  const formik = useFormik<ITreatmentFilter>({
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
      filterNca: '',
      orderBy: '',
      typeOrder: '',
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
      const filterStatus = selecionados.substr(0, selecionados.length - 1);
      const parametersFilter = `filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterTechnology=${filterTechnology}&filterGli=${filterGli}&filterBgm=${filterBgm}&filterTreatmentsNumber=${filterTreatmentsNumber}&filterStatus=${filterStatus}&filterStatusAssay=${filterStatusAssay}&filterGenotypeName=${filterGenotypeName}&filterNca=${filterNca}&id_safra=${idSafra}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await genotypeTreatmentService
        .getAll(`${parametersFilter}`)
        .then(({ response, total: allTotal }) => {
          setFilter(parametersFilter);
          setTreatments(response);
          setTotalItems(allTotal);
          setAfterFilter(true);
          setCurrentPage(0);
        });
    },
  });

  async function handleOrder(column: string, order: number): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }
    setOrderBy(column);
    setOrderType(typeOrder);
    if (filter && typeof filter !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    } else {
      parametersFilter = filter;
    }

    await genotypeTreatmentService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then(({ status, response }) => {
        if (status === 200) {
          setTreatments(response);
        }
      });

    if (orderList === 2) {
      setOrder(0);
    } else {
      setOrder(orderList + 1);
    }
  }

  function headerTableFactory(name: string, title: string) {
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

  const setCheck = (id: any) => {
    checkedItems[id] = checkedItems[id]
      ? false
      : treatments[id - 1]?.genotipo.name_genotipo;
    console.log('checkedItems');
    console.log(checkedItems);
  };

  const setAllCheck = () => {
    setCheckedAllItems(!checkedAllItems);
    treatments?.forEach((item: any) => {
      checkedItems[item.id] = checkedItems[item.id]?.length > 0
        ? false
        : item?.genotipo.name_genotipo;
    });
    console.log('checkedItems');
    console.log(checkedItems);
  };

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
        tableFields.push(
          headerTableFactory('Nome da tecnologia', 'assay_list.tecnologia.name'),
        );
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
          headerTableFactory('Nome genótipo', 'genotipo.name_genotipo'),
        );
      }
      if (columnOrder[item] === 'nca') {
        tableFields.push(headerTableFactory('NCA', 'lote.ncc'));
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
            newItem.foco = item.assay_list.foco.name;
            newItem.ensaio = item.assay_list.type_assay.name;
            newItem.tecnologia = item.assay_list.tecnologia.name;
            newItem.gli = item.assay_list.gli;
            newItem.bgm = item.assay_list.bgm;
            newItem.nt = item.treatments_number;
            newItem.status_t = item.status;
            newItem.status_ensaio = item.assay_list.status;
            newItem.genotipo = item.genotipo.name_genotipo;
            newItem.nca = item.lote.ncc;
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
            newItem.foco = item.assay_list.foco.name;
            newItem.ensaio = item.assay_list.type_assay.name;
            newItem.tecnologia = item.assay_list.tecnologia.name;
            newItem.gli = item.assay_list.gli;
            newItem.bgm = item.assay_list.bgm;
            newItem.nt = item.treatments_number;
            newItem.status_t = item.status;
            newItem.status_ensaio = item.assay_list.status;
            newItem.genotipo = item.genotipo.name_genotipo;
            newItem.nca = item.lote.ncc;
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
          XLSX.writeFile(workBook, 'Tratamentos-genótipo.xlsx');
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
          setTreatments(response);
        }
      });
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
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  function importValidate() {
    // const user = 23;
    // const id_safra = 2;
    // const id_culture = 1;
    // const rows = [
    //   [
    //     'GLI (Grupo de linhagem)',
    //     'SAFRA',
    //     'FOCO',
    //     'ENSAIO',
    //     'Código da tecnologia',
    //     'BGM',
    //     'NT',
    //     'Nome do genótipo',
    //     'NCA',
    //     'Novo Nome do genótipo',
    //     'T',
    //     'Novo NCA',
    //   ],
    //   [
    //     'BKF2RL(0)/001',
    //     '2021_22',
    //     'CO',
    //     'F2',
    //     0,
    //     13,
    //     1,
    //     'TMGC21-0-61301_05',
    //     202120585414,
    //     'T',
    //     'TMGC21-0-61301_05',
    //     202120585415,
    //   ],
    //   [
    //     'BKF2RL(0)/001',
    //     '2021_22',
    //     'CO',
    //     'F2',
    //     0,
    //     13,
    //     2,
    //     'TMGC21-0-61301_07',
    //     202120585416,
    //     'TMGC21-0-61301_07',
    //     'L',
    //     202120585413,
    //   ],
    //   [
    //     'BKF2RL(0)/001',
    //     '2021_22',
    //     'CO',
    //     'F2',
    //     0,
    //     5,
    //     3,
    //     'TMGC21-0-61301_04',
    //     202120585412,
    //     'TMGC21-0-61301_04',
    //     'T',
    //     202120585417,
    //   ],
    // ];
    // importService.validate({
    //   spreadSheet: rows, moduleId: 27, idSafra: id_safra, idCulture: id_culture, created_by: user, table: 'tratmento',
    // }).then(({ status, message }: any) => {
    //   if (status !== 200) {
    //     Swal.fire({
    //       html: message,
    //       width: '900',
    //     });
    //   }
    //   if (status === 200) {
    //     Swal.fire({
    //       html: message,
    //       width: '800',
    //     });
    //   }
    // });
  }

  async function replaceNca() {
    const checkedTreatments = JSON.stringify(checkedItems);
    localStorage.setItem('checkedTreatments', checkedTreatments);
    router.push('/listas/ensaios/tratamento-genotipo/substituicao/');
  }

  function replaceGenotipo() {
    // const selectedTreatments: any = treatments?.map((_, index) => (checkedItems[index]
    //   ? treatments[index] : null));
    // console.log('selectedTreatments');
    // console.log(selectedTreatments);
    // //let nameGenotipo = selectedTreatments[1].genotipo.name_genotipo;
    // const validateReplace = selectedTreatments.map((item: any) => {
    //   if (item?.genotipo.name_genotipo === nameGenotipo) {
    //     nameGenotipo = item.genotipo.name_genotipo;
    //     return true;
    //   }
    //   nameGenotipo = item.genotipo.name_genotipo;
    //   return false;
    // });
    // console.log('validateReplace');
    // console.log(validateReplace);
  }

  async function handleSubmit() {
    console.log(rowsSelected);
  }

  async function setRadioStatus() {
    const selectedGenotype: any = {};
    rowsSelected.forEach((item: any) => {
      selectedGenotype[item.genotipo.name_genotipo] = true;
    });
    const checkedLength = Object.getOwnPropertyNames(selectedGenotype);
    if (rowsSelected.length <= 0) {
      setNccIsValid(true);
      setGenotypeIsValid(true);
    }
    if (checkedLength.length > 1) {
      setNccIsValid(true);
    }
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de genótipos do ensaio</title>
      </Head>

      {/* <Modal
        isOpen={isOpenModal}
        onRequestClose={() => { setIsOpenModal(!isOpenModal); }}
        overlayClassName="fixed inset-0 flex bg-transparent  mt-12  justify-center"
        className="flex
          flex-col
          w-full h-36
          h-52
          max-w-xl
          bg-gray-50
          rounded-tl-2xl
          rounded-tr-2xl
          rounded-br-2xl
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
              setRadioStatus();
              setIsOpenModal(!isOpenModal);
            }}
          >
            <RiCloseCircleFill className="fill-red-600 text-lg hover:fill-red-800" />
          </button>

          <div className="flex px-4  justify-between">
            <header className="flex flex-col mt-2">
              <h2 className="mb-2 text-blue-600 text-sm font-medium">Ação</h2>
              <div>
                <div className="border-l-8 border-l-blue-600 mt-4">
                  <h2 className="mb-2 font-normal text-base ml-2 text-gray-900">
                    Substituir
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="substituir" id="genotipo" disabled={genotypeIsValid} />
                  <label htmlFor="genotipo" className="font-normal">
                    Genótipo
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="substituir" id="nca" disabled={nccIsValid} />
                <label htmlFor="nca" className="font-normal">
                  NCA
                </label>
              </div>
            </header>
            <div>
              <div className="mb-2 text-blue-600 text-sm mt-2 font-medium">
                <h2>
                  Total selecionados:
                  {' '}
                  {rowsSelected?.length}
                </h2>
              </div>

              <div className="border-l-8 border-l-blue-600">
                <h2 className="mb-2 font-normal text-base ml-2 text-gray-900 mt-6">
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

          <button
            type="submit"
            value="Cadastrar"
            className="ml-auto mt-6 bg-green-600 text-white px-4   rounded-lg text-sm hover:bg-green-800"
            onClick={() => handleSubmit()}
          >
            confirmar
          </button>
        </form>
      </Modal> */}

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar tratamento genótipo">
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
                  justify-center
                  pb-8
                "
                >
                  {filterFieldFactory('filterFoco', 'Foco')}
                  {filterFieldFactory('filterTypeAssay', 'Ensaio')}
                  {filterFieldFactory('filterTechnology', 'Tecnologia')}
                  <div className="h-7 w-1/2 ml-4">
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
                  </div>

                  {/* {filterFieldFactory('filterGli', 'GLI')} */}
                  {filterFieldFactory('filterBgm', 'BMG')}
                </div>
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pt-2
                  pb-3
                  "
                >
                  {filterFieldFactory('filterTreatmentsNumber', 'NT')}
                  {filterFieldFactory('filterStatus', 'Status T')}

                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status do Ensaio
                    </label>
                    {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {statusFilter.map((generate, index) => (
                        <CheckBox
                          key={index}
                          name={generate.name}
                          title={generate.title?.toString()}
                          value={generate.value}
                          defaultChecked={false}
                        />
                      ))}
                    </div> */}
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
                  </div>
                  {/* {filterFieldFactory('filterStatusAssay', 'Status do ensaio')} */}

                  <div className="h-7 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Genótipo
                    </label>
                    <Select
                      values={[{ id: '', name: 'Selecione' }, ...genotypeSelect]}
                      id="filterGenotypeName"
                      name="filterGenotypeName"
                      onChange={formik.handleChange}
                      selected={false}
                    />
                  </div>

                  {/* {filterFieldFactory('filterGenotypeName', 'Nome genótipo')} */}
                  {filterFieldFactory('filterNca', 'NCA')}

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      onClick={() => { }}
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
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={afterFilter ? treatments : []}
              options={{
                selection: true,
                showTitle: false,
                headerStyle: {
                  zIndex: 0,
                  // zIndex: 20, tava assim
                },
                rowStyle: { background: '#f9fafb' },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
              }}
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
                        title="Ação"
                        value="Ação"
                        bgColor={rowsSelected?.length > 0 ? 'bg-blue-600' : 'bg-gray-600'}
                        textColor="white"
                        onClick={() => { setIsOpenModal(!isOpenModal); }}
                        disabled={rowsSelected?.length <= 0}
                        // icon={<FaEllipsisV size={20} />}
                        icon={<FaLevelUpAlt size={20} />}
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
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlTreatment = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;
  const baseUrlAssay = `${publicRuntimeConfig.apiUrl}/assay-list`;

  const filterApplication = req.cookies.filterBeforeEdit || `&id_culture=${idCulture}&id_safra=${idSafra}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const param = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}`;

  const urlParametersAssay: any = new URL(baseUrlAssay);
  const urlParametersTreatment: any = new URL(baseUrlTreatment);
  urlParametersTreatment.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allTreatments, total: totalItems } = await fetch(
    urlParametersTreatment.toString(),
    requestOptions,
  ).then((response) => response.json());

  const { response: allAssay } = await fetch(
    urlParametersAssay.toString(),
    requestOptions,
  ).then((response) => response.json());

  const assaySelect = allAssay.map((item: any) => {
    const newItem: any = {};
    newItem.id = item.gli;
    newItem.name = item.gli;
    return newItem;
  });

  const teste: any = {};
  teste.id = '';
  teste.name = 'Selecione';
  assaySelect.unshift(teste);

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
    },
  };
};
