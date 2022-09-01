/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { BsTrashFill } from 'react-icons/bs';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { userPreferencesService } from '../../../../services';
import { experimentService } from '../../../../services/experiment.service';
import {
  AccordionFilter, Button, CheckBox, Content, Input,
} from '../../../../components';
import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
    filterFoco: string
    filterTypeAssay: string
    filterGli: string
    filterExperimentName: string
    filterTecnologia: string
    filterPeriod: string
    filterDelineamento: string
    filterRepetition: string
    orderBy: object | any;
    typeOrder: object | any;
}

interface INpeProps {
    id: number | any;
    local: number;
    safra: number;
    foco: number;
    type_assay: number;
    ogm: number;
    epoca: number;
    npei: number;
    npef: number;
    consumedQT: number;
    prox_npe: number;
    status?: number;
    created_by: number;
}

export interface IExperimento {
    id: number;
    protocol_name: string;
    experiment_name: string;
    year: number;
    rotulo: string;
    foco: string;
    ensaio: string;
    cod_tec: number;
    epoca: number;
    npeQT: number;
    npef: number;
    status?: number;
}

interface IGenerateProps {
    name: string | undefined;
    title: string | number | readonly string[] | undefined;
    value: string | number | readonly string[] | undefined;
}

interface IData {
    allExperiments: IExperimento[];
    totalItems: number;
    itensPerPage: number;
    filterApplication: object | any;
    idSafra: number
    pageBeforeEdit: string | any;
    filterBeforeEdit: string | any
}

export default function Listagem({
  allExperiments,
  totalItems,
  itensPerPage,
  filterApplication,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs;

  const tabsOperationMenu = tabsOperation.map((i) => (i.titleTab === 'AMBIENTE' ? { ...i, statusTab: true } : i));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.experimento || {
    id: 0, table_preferences: 'id,protocolName,foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const router = useRouter();
  const [experimentos, setExperimento] = useState<IExperimento[]>(() => allExperiments);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [filter, setFilter] = useState<any>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Protocolo', value: 'protocolName' },
    { name: 'CamposGerenciados[]', title: 'GLI', value: 'gli' },
    { name: 'CamposGerenciados[]', title: 'Nome do experimento', value: 'experimentName' },
    { name: 'CamposGerenciados[]', title: 'Nome tec.', value: 'tecnologia' },
    { name: 'CamposGerenciados[]', title: 'Época', value: 'period' },
    { name: 'CamposGerenciados[]', title: 'Delineamento', value: 'delineamento' },
    { name: 'CamposGerenciados[]', title: 'Rep.', value: 'repetitionsNumber' },
    { name: 'CamposGerenciados[]', title: 'Number of treatment', value: 'countNT' },
    { name: 'CamposGerenciados[]', title: 'NPE Inicial', value: 'repetitionsNumber' },
    { name: 'CamposGerenciados[]', title: 'NPE Final', value: 'repetitionsNumber' },
    { name: 'CamposGerenciados[]', title: 'QT. NPE', value: 'npeQT' },
  ]);

  const selectedNPE = JSON.parse(localStorage.getItem('selectedNPE') as string);
  const [NPESelectedRow, setNPESelectedRow] = useState<any>(null);

  const [colorStar, setColorStar] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterFoco: '',
      filterTypeAssay: '',
      filterGli: '',
      filterExperimentName: '',
      filterTecnologia: '',
      filterPeriod: '',
      filterDelineamento: '',
      filterRepetition: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterGli,
      filterExperimentName,
      filterTecnologia,
      filterPeriod,
      filterDelineamento,
      filterRepetition,
    }) => {
      const parametersFilter = `filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterGli=${filterGli}&filterExperimentName=${filterExperimentName}&filterTecnologia=${filterTecnologia}&filterPeriod=${filterPeriod}&filterRepetition=${filterRepetition}&filterDelineamento=${filterDelineamento}&idSafra=${idSafra}`;
      setFilter(parametersFilter);
      setCookies('filterBeforeEdit', filter);
      await experimentService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setExperimento(response.response);
        setTotalItems(response.total);
        setCurrentPage(0);
      });
    },
  });

  async function handleOrder(column: string, order: string | any): Promise<void> {
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

    await experimentService.getAll(`${parametersFilter}&skip=0&take=${take}`).then(({ status, response }: any) => {
      if (status === 200) {
        setExperimento(response);
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
  }

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="h-7 flex items-center">
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
      sorting: false,
    };
  }

  function idHeaderFactory() {
    return {
      title: (
        <div className="flex items-center">
          {arrowOrder}
        </div>
      ),
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (
        colorStar === '#eba417'
          ? (
            <div className="h-10 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('')}
                >
                  <AiTwotoneStar size={20} color="#eba417" />
                </button>
              </div>
            </div>
          )
          : (
            <div className="h-10 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('#eba417')}
                >
                  <AiTwotoneStar size={20} />
                </button>
              </div>
            </div>
          )
      ),
    };
  }

  async function deleteItem(id: number) {
    const { status, message } = await await experimentService.deleted(id);
    if (status === 200) {
      router.reload();
    } else {
      Swal.fire({
        html: message,
        width: '800',
      });
    }
  }

  function statusHeaderFactory() {
    return {
      title: 'Ações',
      field: 'action',
      sorting: false,
      searchable: false,
      render: (rowData: IExperimento) => (
        <div className="h-10 flex">
          <div className="h-10">
            <Button
              icon={<BiEdit size={16} />}
              title={`Atualizar ${rowData.experiment_name}`}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filter);
                router.push(`/listas/experimentos/experimento/atualizar?id=${rowData.id}`);
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div>
            <Button
              icon={<BsTrashFill size={16} />}
              onClick={() => deleteItem(rowData.id)}
              bgColor="bg-red-600"
              textColor="white"
            />
          </div>
        </div>
      ),
    };
  }

  function columnsOrder(columnsCampos: any): any {
    const columnCampos: any = columnsCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((_, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'protocolName') {
        tableFields.push(headerTableFactory('Protocolo', 'assay_list.protocol_name'));
      }
      if (columnCampos[index] === 'gli') {
        tableFields.push(headerTableFactory('GLI', 'assay_list.gli'));
      }
      if (columnCampos[index] === 'tecnologia') {
        tableFields.push(headerTableFactory('Cód tec', 'assay_list.tecnologia.name'));
      }
      if (columnCampos[index] === 'experimentName') {
        tableFields.push(headerTableFactory('Nome experimento', 'experimentName'));
      }
      if (columnCampos[index] === 'period') {
        tableFields.push(headerTableFactory('Época', 'period'));
      }
      if (columnCampos[index] === 'delineamento') {
        tableFields.push(headerTableFactory('Delineamento', 'delineamento.name'));
      }
      if (columnCampos[index] === 'repetitionsNumber') {
        tableFields.push(headerTableFactory('Rep.', 'repetitionsNumber'));
      }
    });

    tableFields.push(headerTableFactory('Number of Treatment', 'countNT'));

    tableFields.push(headerTableFactory('NPE Inicial', 'npei'));

    tableFields.push(headerTableFactory('NPE Final', 'npef'));

    tableFields.push(headerTableFactory('QT. NPE', 'npeQT'));

    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

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
      await userPreferencesService.create({
        table_preferences: campos,
        userId: userLogado.id,
        module_id: 22,
      }).then((response) => {
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
    setCamposGerenciados(campos);
  }

  function handleOnDragEnd(result: DropResult): void {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    const excelFilters = `${filterApplication}&paramSelect=${camposGerenciados}`;
    // if (!filterApplication.includes('paramSelect')) {
    //   filterApplication +=
    // }

    await experimentService.getAll(excelFilters).then(({ status, response, message }: any) => {
      if (status === 200) {
        response.map((item: any) => {
          const newItem = item;
          if (item.assay_list) {
            newItem.gli = item.assay_list.gli;
            newItem.protocol_name = item.assay_list.protocol_name;
            newItem.foco = item.assay_list.foco.name;
            newItem.type_assay = item.assay_list.type_assay.name;
            newItem.tecnologia = item.assay_list.tecnologia.name;
          }
          if (item.delineamento) {
            newItem.repeticao = item.delineamento.repeticao;
            newItem.delineamento = item.delineamento.name;
          }
          delete newItem.assay_list;
          return newItem;
        });

        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'experimentos');

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
        Swal.fire(message);
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
    let parametersFilter = `skip=${skip}&take=${take}&idSafra=25&idLocal=286`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await experimentService.getAll(parametersFilter).then(({ status, response }: any) => {
      if (status === 200) {
        setExperimento(response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-10 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          max="40"
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  const columnNPE = [
    { title: 'Local', field: 'local.name_local_culture' },
    { title: 'Safra', field: 'safra.safraName' },
    { title: 'Foco', field: 'foco.name' },
    { title: 'Ensaio', field: 'type_assay.name' },
    { title: 'Tecnologia', field: 'tecnologia.name' },
    { title: 'Epoca', field: 'epoca' },
    { title: 'NPE Inicial', field: 'npei' },
    { title: 'NPE Final', field: 'npef' },
    { title: 'NPE Quantity', field: 'consumedQT' },
  ];

  const handleNPERowSelection = (rowData: any) => {
    if (NPESelectedRow?.tableData?.id != rowData?.tableData?.id) {
      rowData.tableData.checked = false;
    } else {
      rowData.tableData.checked = true;
    }
  };

  async function getExperiments(): Promise<void> {
    if (NPESelectedRow) {
      let parametersFilter = `idSafra=${NPESelectedRow?.id_safra}&idLocal=${NPESelectedRow?.id_local}`;

      if (filter) {
        parametersFilter = `${parametersFilter}&${filter}`;
      }
      await experimentService.getAll(parametersFilter).then(({ status, response }: any) => {
        if (status === 200) {
          let i = NPESelectedRow.npei;
          response.map((item: any) => {
            item.npei = i;
            item.npef = i + item.npeQT;
            i = item.npef + 1;
          });
          selectedNPE.filter((x: any) => x == NPESelectedRow).npef = i;
          setExperimento(response);
        }
      });
    }
  }

  function validateConsumedData() {
    let total_consumed = 0;
    let lastNPE = 0;
    const nextNPE = NPESelectedRow?.nextNPE;
    experimentos.map((item) => {
      total_consumed += item.npeQT;
      lastNPE = item?.npef;
    });
    let test = `To be Consumed - ${NPESelectedRow?.consumedQT}\nTotal Consumned - ${total_consumed}\n`;
    test += `Last NPE - ${lastNPE}\n` + `Next NPE - ${nextNPE}`;
    alert(test);
  }

  useEffect(() => {
    getExperiments();
  }, [NPESelectedRow]);

  return (
    <>
      <Head><title>Listagem de experimentos</title></Head>

      <Content contentHeader={tabsOperationMenu} moduloActive="operation">
        <main className="h-full w-full flex flex-col items-start gap-0">
          <div className="w-full">
            <MaterialTable
              style={{ background: '#f9fafb', marginBottom: '15px', paddingBottom: '10px' }}
              columns={columnNPE}
              data={selectedNPE}
              onRowClick={(evt, selectedRow: any) => {
                setNPESelectedRow(selectedRow);
                selectedRow.tableData.checked = true;
              }}
              options={{
                // selection: true,
                // selectionProps: handleNPERowSelection,
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                  height: 50,
                },
                rowStyle: (rowData) => ({
                  backgroundColor:
                    NPESelectedRow?.tableData?.id === rowData.tableData.id ? '#d3d3d3' : '#f9fafb',
                  height: 40,
                }),
                search: false,
                filtering: false,
                showSelectAllCheckbox: false,
                paging: false,
              }}
              components={{
                Toolbar: () => null,
                Pagination: () => null,
              }}
            />
          </div>
          {NPESelectedRow
            ? (
              <div className="w-full h-full overflow-y-scroll">
                <MaterialTable
                  style={{ background: '#f9fafb' }}
                  columns={columns}
                  data={experimentos}
                  options={{
                    showTitle: false,
                    headerStyle: {
                      zIndex: 20,
                    },
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

                        {/* <div className="h-12">
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="experimento/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div> */}
                        <strong className="text-600">
                          Experimentos
                        </strong>
                        <strong className="text-blue-600">
                          Total registrado:
                          {' '}
                          {itemsTotal}
                        </strong>

                        <div className="h-full flex items-center gap-2">
                          <div className="border-solid border-2 border-blue-600 rounded">
                            <div className="w-72">
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
                                                                                        {(provider) => (
                                                                                          <li
                                                                                            ref={provider.innerRef}
                                                                                            {...provider.draggableProps}
                                                                                            {...provider.dragHandleProps}
                                                                                          >
                                                                                            <CheckBox
                                                                                              name={generate.name}
                                                                                              title={generate.title?.toString()}
                                                                                              value={generate.value}
                                                                                              defaultChecked={camposGerenciados
                                                                                                .includes(String(generate.value))}
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
                            <Button
                              title="Sortear"
                              value="Sortear"
                              bgColor="bg-blue-600"
                              textColor="white"
                              onClick={validateConsumedData}
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
            ) : ''}
        </main>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0]?.itens_per_page ?? 10;

  const { token } = req.cookies;
  const idSafra = Number(req.cookies.safraId);
  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : '';
  const filterApplication = req.cookies.filterBeforeEdit ? `${req.cookies.filterBeforeEdit}&idSafra=${idSafra}` : '';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/experiment`;

  const param = `skip=0&take=${itensPerPage}&idSafra=${idSafra}`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allExperiments, total: totalItems } = await fetch(`${baseUrl}?idSafra=${idSafra}`, requestOptions).then((response) => response.json());

  return {
    props: {
      allExperiments,
      totalItems,
      itensPerPage,
      filterApplication,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};