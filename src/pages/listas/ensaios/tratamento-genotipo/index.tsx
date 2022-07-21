/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { deleteCookie, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Checkbox as Checkbox1 } from '@mui/material';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import {
  BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Swal from 'sweetalert2';
import { BsDownload } from 'react-icons/bs';
import { ITreatment, ITreatmentFilter, ITreatmentGrid } from '../../../../interfaces/listas/ensaio/genotype-treatment.interface';
import { IGenerateProps } from '../../../../interfaces/shared/generate-props.interface';

import {
  genotypeTreatmentService, importService, replaceTreatmentService, userPreferencesService,
} from '../../../../services';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

export default function TipoEnsaio({
  assaySelect,
  genotypeSelect,
  itensPerPage,
  filterApplication,
  idSafra,
  filterBeforeEdit,
}: ITreatmentGrid) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.genotypeTreatment
    || { id: 0, table_preferences: 'id,foco,type_assay,tecnologia,gli,bgm,treatments_number,genotype_treatment,status,action' };

  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const [treatments, setTreatments] = useState<ITreatment[]>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(1);
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(0);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]', title: 'CheckBox ', value: 'id', defaultChecked: () => camposGerenciados.includes('id'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Foco', value: 'foco', defaultChecked: () => camposGerenciados.includes('foco'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Ensaio', value: 'type_assay', defaultChecked: () => camposGerenciados.includes('type_assay'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Nome da Tec.', value: 'tecnologia', defaultChecked: () => camposGerenciados.includes('tecnologia'),
    },
    {
      name: 'CamposGerenciados[]', title: 'GLI', value: 'gli', defaultChecked: () => camposGerenciados.includes('gli'),
    },
    {
      name: 'CamposGerenciados[]', title: 'BGM', value: 'bgm', defaultChecked: () => camposGerenciados.includes('bgm'),
    },
    {
      name: 'CamposGerenciados[]', title: 'NT', value: 'treatments_number', defaultChecked: () => camposGerenciados.includes('treatments_number'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Status T', value: 'status', defaultChecked: () => camposGerenciados.includes('status'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Status do Ensaio', value: 'statusAssay', defaultChecked: () => camposGerenciados.includes('statusAssay'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Nome genótipo', value: 'genotipoName', defaultChecked: () => camposGerenciados.includes('genotipoName'),
    },
    {
      name: 'CamposGerenciados[]', title: 'NCA', value: 'nca', defaultChecked: () => camposGerenciados.includes('nca'),
    },
  ]);
  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    {
      name: 'StatusCheckbox', title: 'IMPORTADO ', value: 'importado', defaultChecked: () => camposGerenciados.includes('importado'),
    },
    {
      name: 'StatusCheckbox', title: 'SORTEADO', value: 'sorteado', defaultChecked: () => camposGerenciados.includes('sorteado'),
    },
  ]);
  const router = useRouter();
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);
  const checkedItems: any = {};
  const [checkedAllItems, setCheckedAllItems] = useState<boolean>(true);

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
      const allCheckBox: any = document.querySelectorAll("input[name='StatusCheckbox']");
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
      await genotypeTreatmentService.getAll(`${parametersFilter}`)
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

    if (filter && typeof (filter) !== 'undefined') {
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

    await genotypeTreatmentService.getAll(`${parametersFilter}&skip=0&take=${take}`).then(({ status, response }) => {
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
          <button type="button" className="font-medium text-gray-900" onClick={() => handleOrder(title, orderList)}>
            {name}
          </button>
        </div>
      ),
      field: title,
      sorting: false,
    };
  }

  const setCheck = (id: any) => {
    checkedItems[id] = checkedItems[id] ? false : treatments[id - 1]?.genotipo.name_genotipo;
    console.log('checkedItems');
    console.log(checkedItems);
  };

  const setAllCheck = () => {
    setCheckedAllItems(!checkedAllItems);
    treatments?.forEach((item) => {
      checkedItems[item.id] = (checkedItems[item.id])?.length > 0
        ? false : item?.genotipo.name_genotipo;
    });
    console.log('checkedItems');
    console.log(checkedItems);
  };

  function idHeaderFactory() {
    return {
      title:
        <div className="h-10 flex">
          <Checkbox1
            onChange={setAllCheck}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
          />
        </div>,
      field: 'id',
      sorting: false,
      width: 0,
      render: (rowData: any) => (
        (
          <div className="h-10 flex">
            <Checkbox1
              checked={!!checkedItems[rowData.id]}
              onChange={() => setCheck(rowData.id)}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
            />
            {/* <input type="checkbox" onChange={() => setCheck(rowData.id)} /> */}
          </div>
        )
      ),
    };
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item) => {
      if (columnOrder[item] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnOrder[item] === 'foco') {
        tableFields.push(headerTableFactory('Foco', 'assay_list.foco.name'));
      }
      if (columnOrder[item] === 'type_assay') {
        tableFields.push(headerTableFactory('Ensaio', 'assay_list.type_assay.name'));
      }
      if (columnOrder[item] === 'tecnologia') {
        tableFields.push(headerTableFactory('Nome da tecnologia', 'assay_list.tecnologia.name'));
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
        tableFields.push(headerTableFactory('Status do ensaio', 'assay_list.status'));
      }
      if (columnOrder[item] === 'genotipoName') {
        tableFields.push(headerTableFactory('Nome genótipo', 'genotipo.name_genotipo'));
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
      await userPreferencesService.create({
        table_preferences: campos,
        userId: userLogado.id,
        module_id: 27,
      }).then((response) => {
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
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
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
    await genotypeTreatmentService.getAll(filter).then(({ status, response }) => {
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
    await genotypeTreatmentService.getAll(filter).then(({ status, response }) => {
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
    let parametersFilter = `skip=${skip}&take=${take}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await genotypeTreatmentService.getAll(parametersFilter).then(({ status, response }) => {
      if (status === 200) {
        setTreatments(response);
      }
    });
  }

  function filterFieldFactory(title: string, name: string) {
    return (
      <div className="h-10 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-2">
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

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de genótipos do ensaio</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        "
        >

          <AccordionFilter title="Filtrar ensaios">
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
                  pb-2
                "
                >
                  {filterFieldFactory('filterFoco', 'Foco')}
                  {filterFieldFactory('filterTypeAssay', 'Ensaio')}
                  {filterFieldFactory('filterTechnology', 'Tecnologia')}
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
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
                  {filterFieldFactory('filterTreatmentsNumber', 'NT')}
                  {filterFieldFactory('filterStatus', 'Status T')}

                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Status do Ensaio
                    </label>
                    <AccordionFilter>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {
                            (provided) => (
                              <ul className="w-full h-full characters" {...provided.droppableProps} ref={provided.innerRef}>
                                {
                                  statusFilter.map((generate, index) => (
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
                                  ))
                                }
                                {provided.placeholder}
                              </ul>
                            )
                          }
                        </Droppable>
                      </DragDropContext>
                    </AccordionFilter>
                  </div>
                  {/* {filterFieldFactory('filterStatusAssay', 'Status do ensaio')} */}

                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Genótipo
                    </label>
                    <Select
                      values={genotypeSelect}
                      id="filterGenotypeName"
                      name="filterGenotypeName"
                      onChange={formik.handleChange}
                      selected={false}
                    />
                  </div>

                  {/* {filterFieldFactory('filterGenotypeName', 'Nome genótipo')} */}
                  {filterFieldFactory('filterNca', 'NCA')}

                </div>

                <div className="h-16 w-32 mt-3">
                  <Button
                    onClick={() => { }}
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
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={afterFilter ? treatments : []}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb' },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
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

                    <div className="h-12 w-32">
                      <Button
                        title="NCA"
                        value="NCA"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={replaceNca}
                      />
                    </div>
                    <div className="h-12 w-32">
                      <Button
                        title="GENOTIPO"
                        value="GENOTIPO"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={replaceGenotipo}
                      />
                    </div>
                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2
                    "
                    >
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-64">
                          <AccordionFilter title="Gerenciar Campos" grid={statusAccordion}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {
                                  (provided) => (
                                    <ul className="w-full h-full characters" {...provided.droppableProps} ref={provided.innerRef}>
                                      <div className="h-8 mb-3">
                                        <Button
                                          value="Atualizar"
                                          bgColor="bg-blue-600"
                                          textColor="white"
                                          onClick={getValuesColumns}
                                          icon={<IoReloadSharp size={20} />}
                                        />
                                      </div>
                                      {
                                        generatesProps.map((generate, index) => (
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
                                                  defaultChecked={
                                                    camposGerenciados.includes(generate.value)
                                                  }
                                                />
                                              </li>
                                            )}
                                          </Draggable>
                                        ))
                                      }
                                      {provided.placeholder}
                                    </ul>
                                  )
                                }
                              </Droppable>
                            </DragDropContext>
                          </AccordionFilter>
                        </div>
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button title="Exportar planilha para substituição" icon={<BsDownload size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { replacementExcel(); }} />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button title="Exportar planilha de tratamentos" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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
                      onClick={() => setCurrentPage(currentPage - 10)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage <= 1}
                    />
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiLeftArrow size={15} />}
                      disabled={currentPage <= 0}
                    />
                    {
                      Array(1).fill('').map((value, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))
                    }
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiRightArrow size={15} />}
                      disabled={currentPage + 1 >= pages}
                    />
                    <Button
                      onClick={() => setCurrentPage(currentPage + 10)}
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0].itens_per_page;

  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : '';
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  deleteCookie('filterBeforeEdit', { req, res });
  deleteCookie('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrlTreatment = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;
  const baseUrlAssay = `${publicRuntimeConfig.apiUrl}/assay-list`;

  const filterApplication = filterBeforeEdit || `&id_culture=${idCulture}&id_safra=${idSafra}`;

  const param = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}`;

  const urlParametersAssay: any = new URL(baseUrlAssay);
  const urlParametersTreatment: any = new URL(baseUrlTreatment);
  urlParametersTreatment.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const {
    response: allTreatments,
    total: totalItems,
  } = await fetch(urlParametersTreatment.toString(), requestOptions)
    .then((response) => response.json());

  const { response: allAssay } = await fetch(urlParametersAssay.toString(), requestOptions)
    .then((response) => response.json());

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

  const genotypeSelect = allTreatments.map((item: any) => {
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
