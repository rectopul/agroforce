/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef } from 'react';
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
import { RiArrowUpDownLine, RiCloseCircleFill, RiFileExcel2Line } from 'react-icons/ri';
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
} from '../../../interfaces/listas/ensaio/genotype-treatment.interface';
import { IGenerateProps } from '../../../interfaces/shared/generate-props.interface';

import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../components';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  genotypeTreatmentService,
  importService,
  userPreferencesService,
} from '../../../services';
import * as ITabs from '../../../shared/utils/dropdown';

export default function Listagem({
  assaySelect,
  genotypeSelect,
  itensPerPage,
  filterApplication,
  idSafra,
  filterBeforeEdit,
}: ITreatmentGrid) {
  const { tabsOperation } = ITabs.default;

  const tabsOperationMenu = tabsOperation.map((i) => (i.titleTab === 'ETIQUETAGEM' ? { ...i, statusTab: true } : i));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.etique || {
    id: 0,
    table_preferences:
    'id,foco,type_assay,tecnologia,gli,bgm,treatments_number,genotype_treatment,status,action',
  };

  const tableRef = useRef<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [experimentGroup, setExperimentGroup] = useState<ITreatment[] | any>([]);
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
  const [orderBy, setOrderBy] = useState<string>('');
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
      filterBgmTo: '',
      filterBgmFrom: '',
      filterNtTo: '',
      filterNtFrom: '',
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
      const parametersFilter = `&filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterTechnology=${filterTechnology}&filterGli=${filterGli}&filterBgm=${filterBgm}&filterTreatmentsNumber=${filterTreatmentsNumber}&filterStatus=${filterStatus}&filterStatusAssay=${filterStatusAssay}&filterGenotypeName=${filterGenotypeName}&filterNca=${filterNca}&id_safra=${idSafra}&filterBgmTo=${filterBgmTo}&filterBgmFrom=${filterBgmFrom}&filterNtTo=${filterNtTo}&filterNtFrom=${filterNtFrom}`;
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
          setMessage(true);
          tableRef.current.dataManager.changePageSize(allTotal >= take ? take : allTotal);
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
        tableFields.push(
          tecnologiaHeaderFactory('Tecnologia', 'tecnologia'),
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
          headerTableFactory('Nome do genótipo', 'genotipo.name_genotipo'),
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
            newItem.tecnologia = `${item.assay_list.tecnologia.cod_tec} ${item.assay_list.tecnologia.name}`;
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
            newItem.safra = item.safra.safraName;
            newItem.foco = item.assay_list.foco.name;
            newItem.ensaio = item.assay_list.type_assay.name;
            newItem.tecnologia = item.assay_list.tecnologia.cod_tec;
            newItem.gli = item.assay_list.gli;
            newItem.bgm = item.assay_list.bgm;
            newItem.nt = item.treatments_number;
            newItem.status_t = item.status;
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
          XLSX.writeFile(workBook, 'Substituição-genótipos.xlsx');
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

  function readExcel(value: any) {
    readXlsxFile(value[0]).then((rows) => {
      importService.validate({
        table: 'REPLACEMENT_GENOTYPE ',
        spreadSheet: rows,
        moduleId: 27,
        idSafra: userLogado.safras.safra_selecionada,
        created_by: userLogado.id,
      }).then(({ message }: any) => {
        Swal.fire({
          html: message,
          width: '800',
        });
      });
    });
  }

  async function handleSubmit(event: any) {
    const genotypeButton = document.querySelector("input[id='genotipo']:checked");
    const ncaButton = document.querySelector("input[id='nca']:checked");
    const inputFile: any = document.getElementById('import');
    event.preventDefault();
    if (genotypeButton) {
      const checkedTreatments: any = rowsSelected.map((item: any) => (
        { id: item.id }
      ));
      const checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
      localStorage.setItem('checkedTreatments', checkedTreatmentsLocal);
      localStorage.setItem('treatmentsOptionSelected', JSON.stringify('genotipo'));

      router.push('/listas/ensaios/tratamento-genotipo/substituicao/');
    } else if (ncaButton) {
      const checkedTreatments: any = rowsSelected.map((item: any) => (
        { id: item.id, genotipo: item.genotipo.name_genotipo }
      ));
      const checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
      localStorage.setItem('checkedTreatments', checkedTreatmentsLocal);
      localStorage.setItem('treatmentsOptionSelected', JSON.stringify('nca'));

      router.push('/listas/ensaios/tratamento-genotipo/substituicao/');
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

  return (
    <>
      <Head>
        <title>Listagem de genótipos do ensaio</title>
      </Head>

      <Modal
        isOpen={isOpenModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => { setIsOpenModal(!isOpenModal); }}
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
            <RiCloseCircleFill size={35} className="fill-red-600 hover:fill-red-800" />
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
                  <input type="radio" name="substituir" id="genotipo" disabled={genotypeIsValid} />
                  <label htmlFor="genotipo" className="font-normal text-base">
                    Nome do genótipo
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="substituir" id="nca" disabled={nccIsValid} />
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

      <Content contentHeader={tabsOperationMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar tratamentos genótipos">
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
                  {filterFieldFactory('filterExperimentGroup', 'Nome do grupo de experimento')}
                  {filterFieldFactory('filterQuantityExperiment', 'Qtde. exp.')}
                  {filterFieldFactory('filterTagsToPrint', 'Total etiq. a imprimir')}
                  {filterFieldFactory('filterTagsPrinted', 'Total etiq. impressas')}
                  {filterFieldFactory('filterTotalTags', 'Total etiquetas')}
                  {filterFieldFactory('filterStatus', 'Status')}

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

                <div className="h-7 w-1/2 ml-4">
                  <label className="block text-gray-900 text-sm font-bold mb-1">
                    Itens por página
                  </label>
                  <Select
                    values={[
                      { id: 10, name: 10 },
                      { id: 50, name: 50 },
                      { id: 100, name: 100 },
                      { id: 200, name: 200 },
                    ]}
                    selected={take}
                    onChange={(e: any) => setTake(e.target.value)}
                  />
                </div>

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

              </form>
            </div>
          </AccordionFilter>

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={experimentGroup}
              options={{
                selection: true,
                selectionProps: (rowData: any) => (isOpenModal && { disabled: rowData }),
                showTitle: false,
                headerStyle: {
                  zIndex: 0,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
              }}
              onChangeRowsPerPage={() => { }}
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
                        title="Criar novo grupo"
                        value="Criar novo grupo"
                        textColor="white"
                        onClick={() => {
                          setIsOpenModal(!isOpenModal);
                        }}
                        bgColor="bg-blue-600"
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
  const { safraId } = req.cookies;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlExperimentGroup = `${publicRuntimeConfig.apiUrl}/experiment-group`;

  const filterApplication = req.cookies.filterBeforeEdit || `&id_safra=${safraId}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const param = `&id_safra=${safraId}`;

  const urlExperimentGroup: any = new URL(baseUrlExperimentGroup);
  urlExperimentGroup.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allTreatments, total: totalItems } = await fetch(
    urlExperimentGroup.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allTreatments,
      totalItems,
      itensPerPage,
      filterApplication,
      safraId,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
