/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef } from 'react';
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
  ModalConfirmation,
  Select,
} from '../../../components';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  experimentGenotipeService,
  importService,
  userPreferencesService,
} from '../../../services';
import * as ITabs from '../../../shared/utils/dropdown';
import { IReturnObject } from '../../../interfaces/shared/Import.interface';
import { fetchWrapper } from '../../../helpers';
import { IExperiments } from '../../../interfaces/listas/experimento/experimento.interface';

interface IFilter {
  filterFoco: string
  filterTypeAssay: string
  filterNameTec: string
  filterCodTec: string
  filterGli: string
  filterExperimentName: string
  filterLocal: string
  filterRepetitionFrom: string | any;
  filterRepetitionTo: string | any;
  filterStatus: string
  filterNtFrom: string
  filterNtTo: string
  filterNpeFrom: string
  filterNpeTo: string
  filterGenotypeName: string
  filterNca: string
  orderBy: object | any;
  typeOrder: object | any;
}

export default function Listagem({
  allExperiments,
  totalItems,
  itensPerPage,
  experimentGroupId,
  filterApplication,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsEtiquetagemMenu = tabsOperation.map((i: any) => (i.titleTab === 'ETIQUETAGEM' ? { ...i, statusTab: true } : i));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.parcelas || {
    id: 0,
    table_preferences:
      'id,foco,type_assay,tecnologia,gli,experimentName,local,repetitionsNumber,status,NT,npe,genotypeName,nca,action',
  };

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [parcelas, setParcelas] = useState<ITreatment[] | any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
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
      title: 'Experimento',
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
      title: 'REP.',
      value: 'rep',
      defaultChecked: () => camposGerenciados.includes('rep'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status',
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
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [rowsSelected, setRowsSelected] = useState([]);
  const router = useRouter();

  const formik = useFormik<IFilter>({
    initialValues: {
      filterFoco: '',
      filterTypeAssay: '',
      filterNameTec: '',
      filterCodTec: '',
      filterGli: '',
      filterExperimentName: '',
      filterLocal: '',
      filterRepetitionFrom: '',
      filterRepetitionTo: '',
      filterStatus: '',
      filterNtFrom: '',
      filterNtTo: '',
      filterNpeFrom: '',
      filterNpeTo: '',
      filterGenotypeName: '',
      filterNca: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterNameTec,
      filterCodTec,
      filterGli,
      filterExperimentName,
      filterLocal,
      filterRepetitionFrom,
      filterRepetitionTo,
      filterStatus,
      filterNtFrom,
      filterNtTo,
      filterNpeFrom,
      filterNpeTo,
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
      const filterStatusT = selecionados.substr(0, selecionados.length - 1);

      // Call filter with there parameter
      const parametersFilter = await fetchWrapper.handleFilterParameter(
        'parcelas',
        filterFoco,
        filterTypeAssay,
        filterNameTec,
        filterCodTec,
        filterGli,
        filterExperimentName,
        filterLocal,
        filterRepetitionFrom,
        filterRepetitionTo,
        filterStatus,
        filterNtFrom,
        filterNtTo,
        filterNpeFrom,
        filterNpeTo,
        filterGenotypeName,
        filterNca,
        idSafra,
      );

      setFiltersParams(parametersFilter);
      setFilter(parametersFilter);
      setCookies('filterBeforeEdit', filter);

      await experimentGenotipeService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setParcelas(response.response);
        setTotalItems(response.total);
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

    await experimentGenotipeService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then(({ status, response }: IReturnObject) => {
        if (status === 200) {
          setParcelas(response);
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
            {`${rowData.tecnologia.cod_tec} ${rowData.tecnologia.name}`}
          </div>
        </div>
      ),
    };
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((index: any) => {
      if (columnOrder[index] === 'foco') {
        tableFields.push(headerTableFactory('Foco', 'foco.name'));
      }
      if (columnOrder[index] === 'type_assay') {
        tableFields.push(
          headerTableFactory('Ensaio', 'type_assay.name'),
        );
      }
      if (columnOrder[index] === 'tecnologia') {
        tableFields.push(
          tecnologiaHeaderFactory('Tecnologia', 'tecnologia'),
        );
      }
      if (columnOrder[index] === 'gli') {
        tableFields.push(headerTableFactory('GLI', 'gli'));
      }
      if (columnOrder[index] === 'experiment') {
        tableFields.push(headerTableFactory('Experimento', 'experiment.experimentName'));
      }
      if (columnOrder[index] === 'local') {
        tableFields.push(headerTableFactory('Lugar de plantio', 'experiment.local.name_local_culture'));
      }
      if (columnOrder[index] === 'rep') {
        tableFields.push(headerTableFactory('REP.', 'rep'));
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(
          headerTableFactory('Status EXP.', 'experiment.status'),
        );
      }
      if (columnOrder[index] === 'nt') {
        tableFields.push(
          headerTableFactory('NT.', 'nt'),
        );
      }
      if (columnOrder[index] === 'npe') {
        tableFields.push(
          headerTableFactory('NPE.', 'npe'),
        );
      }
      if (columnOrder[index] === 'name_genotipo') {
        tableFields.push(
          headerTableFactory('Nome do genótipo', 'name_genotipo'),
        );
      }
      if (columnOrder[index] === 'nca') {
        tableFields.push(headerTableFactory('NCA', 'nca'));
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
    await experimentGenotipeService
      .getAll(filter)
      .then(({ status, response }: IReturnObject) => {
        if (status === 200) {
          const newData = response.map((item: any) => item);
          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, 'Parcelas');

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
      parametersFilter = `skip=${skip}&take=${take}&experimentGroupId=${experimentGroupId}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}&experimentGroupId=${experimentGroupId}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await experimentGenotipeService
      .getAll(parametersFilter)
      .then(({ status, response }: IReturnObject) => {
        if (status === 200) {
          setParcelas(response);
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

  async function handleSubmit() {
    // const experimentsSelected = rowsSelected.map((item: IExperiments) => item.id);
    // const { status }: IReturnObject = await experimentGenotipeService.update({
    //   idList: experimentsSelected,
    //   experimentGroupId: Number(experimentGroupId),
    //   status: 'IMP. N INICI.',
    // });
    // if (status !== 200) {
    //   Swal.fire('Erro ao associar experimentos');
    // } else {
    //   router.back();
    // }
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de parcelas</title>
      </Head>

      <Content contentHeader={tabsEtiquetagemMenu} moduloActive="operacao">
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
                                    px-4
                                    bg-white
                                    "
                onSubmit={formik.handleSubmit}
              >
                <div className="w-full h-full
                                        flex
                                        justify-center
                                        pb-8
                                        "
                >
                  {filterFieldFactory('filterFoco', 'Foco')}
                  {filterFieldFactory('filterTypeAssay', 'Ensaio')}
                  {filterFieldFactory('filterCod', 'Cód. Tecnologia')}
                  {filterFieldFactory('filterTecnologia', 'Nome Tecnologia')}
                  {filterFieldFactory('filterGli', 'GLI')}
                  {filterFieldFactory('filterExperimentName', 'Nome Experimento')}

                </div>

                <div className="w-full h-full
                                        flex
                                        justify-center
                                        pb-2
                                        "
                >
                  {filterFieldFactory('filterLocal', 'Lugar de plantio')}

                  <div className="h-10 w-full ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status do Experimento
                    </label>
                    <AccordionFilter>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {(provided) => (
                            <ul
                              className="w-1/2 h-full characters"
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
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Repetição
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterRepetitionFrom"
                        name="filterRepetitionFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterRepetitionTo"
                        name="filterRepetitionTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-full ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status da Parcela
                    </label>
                    <AccordionFilter>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {(provided) => (
                            <ul
                              className="w-1/2 h-full characters"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {statusImp.map((generate, index) => (
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

                  <div className="h-6 w-1/2 ml-4">
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
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NPE
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterNpeFrom"
                        name="filterNpeFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNpeTo"
                        name="filterNpeTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  {filterFieldFactory('filterGenotypeName', 'Nome do genotipo')}
                  {filterFieldFactory('filterNca', 'NCA')}
                  <div className="w-full" style={{ marginLeft: -80 }} />

                  <div className="h-7 w-32 mt-6">
                    <Button
                      type="submit"
                      onClick={() => { }}
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
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={parcelas}
              options={{
                selection: true,
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
                        title="Ação"
                        value="Ação"
                        textColor="white"
                        onClick={() => { }}
                        bgColor="bg-blue-600"
                        icon={<RiArrowUpDownLine size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Qte. exp:
                      {' '}
                      {parcelas.length}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq. a imp.:
                      {' '}
                      {parcelas.length}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq. imp.:
                      {' '}
                      {parcelas.length}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq.:
                      {' '}
                      {parcelas.length}
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
  const { id: experimentGroupId } = query;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlParcelas = `${publicRuntimeConfig.apiUrl}/experiment_genotipe`;

  const filterApplication = req.cookies.filterBeforeEdit || `&id_culture=${idCulture}&id_safra=${idSafra}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const param = `&id_culture=${idCulture}&id_safra=${idSafra}&experimentGroupId=${experimentGroupId}`;

  const urlParametersParcelas: any = new URL(baseUrlParcelas);
  urlParametersParcelas.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allParcelas, total: totalItems } = await fetch(
    urlParametersParcelas.toString(),
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
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
