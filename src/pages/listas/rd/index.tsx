/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import Head from 'next/head';
import readXlsxFile from 'read-excel-file';
import Swal from 'sweetalert2';
import React, {
  useState, ReactNode, useEffect, useRef,
} from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { IoIosCloudUpload } from 'react-icons/io';

import {
  AiFillInfoCircle,
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import MaterialTable from 'material-table';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import Spinner from 'react-bootstrap/Spinner';
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';

import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { useFormik } from 'formik';
import {
  Box, Tab, Tabs, Typography,
} from '@mui/material';
import { fetchWrapper } from 'src/helpers';
import { useRouter } from 'next/router';
import {
  AccordionFilter,
  CheckBox,
  Button,
  Content,
  Input,
  FieldItemsPerPage,
} from '../../../components';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  userPreferencesService,
  logImportService,
  importService,
} from '../../../services';
import * as ITabs from '../../../shared/utils/dropdown';
import ComponentLoading from '../../../components/Loading';
import { functionsUtils } from '../../../shared/utils/functionsUtils';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';

export interface LogData {
  id: number;
  user_id: number;
  table: string;
  created_at: string;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function Import({
  allLogs,
  totalItems,
  itensPerPage,
  filterApplication,
  uploadInProcess,
  idSafra,
  idCulture,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (tab.titleTab === 'RD' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const tableRef = useRef<any>(null);

  const [executeUpload, setExecuteUpload] = useState<any>(
    Number(uploadInProcess),
  );
  const router = useRouter();
  const disabledButton = executeUpload === 1;
  const bgColor = executeUpload === 1 ? 'bg-red-600' : 'bg-blue-600';
  const [loading, setLoading] = useState<boolean>(false);

  async function readExcel(moduleId: number, table: string) {
    try {
      const value: any = document.getElementById(`inputFile-${moduleId}`);
      if (!value.files[0]) {
        Swal.fire('Insira um arquivo');
        return;
      }

      const fileExtension: any = functionsUtils.getFileExtension(
        value?.files[0]?.name,
      );

      if (fileExtension !== 'xlsx') {
        Swal.fire('Apenas arquivos .xlsx são aceitos.');
        (document.getElementById(`inputFile-${moduleId}`) as any).value = null;
        return;
      }

      const userLogado = JSON.parse(localStorage.getItem('user') as string);
      setExecuteUpload(1);

      readXlsxFile(value.files[0]).then(async (rows) => {
        setLoading(true);

        if (moduleId) {
          const { message } = await importService.validate({
            spreadSheet: rows,
            moduleId,
            created_by: userLogado.id,
            idSafra,
            idCulture,
            table,
            disabledButton,
          });
          setLoading(false);
          handlePagination();
          Swal.fire({
            html: message,
            width: '800',
          });
          setExecuteUpload(0);
        } else {
          const { message } = await importService.validateProtocol({
            spreadSheet: rows,
            moduleId,
            created_by: userLogado.id,
            idSafra,
            idCulture,
            table,
            disabledButton,
          });
          setLoading(false);
          handlePagination();
          Swal.fire({
            html: message,
            width: '800',
          });
          setExecuteUpload(0);
        }
      }).catch((e: any) => {
        Swal.fire({
          html: 'Erro ao ler planilha',
          width: '800',
          didClose: () => {
            router.reload();
          },
        });
      });

      (document.getElementById(`inputFile-${moduleId}`) as any).value = null;
    } catch (e: any) {
      Swal.fire({
        html: 'Erro ao ler planilha',
        width: '800',
        didClose: () => {
          router.reload();
        },
      });
    }
  }

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.rd || {
    id: 0,
    table_preferences: 'id,user_id,created_at,table,state',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [logs, setLogs] = useState<LogData[]>(allLogs);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Usuário', value: 'user_id' },
    { name: 'CamposGerenciados[]', title: 'Tabela', value: 'table' },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'state' },
    { name: 'CamposGerenciados[]', title: 'Importado em', value: 'created_at' },
  ]);
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [typeOrder, setTypeOrder] = useState<string>('');
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pathExtra = `skip=${currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;
  const pages = Math.ceil(total / take);
  const formik = useFormik<any>({
    initialValues: {
      filterUser: '',
      filterTable: '',
      filterStartDate: '',
      filterEndDate: '',
      filterState: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterUser,
      filterTable,
      filterStartDate,
      filterEndDate,
      filterState,
    }) => {
      const parametersFilter = `filterUser=${filterUser}&filterTable=${filterTable}&filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}&filterState=${filterState}`;
      setFilter(parametersFilter);
      await getAllLogs(`${parametersFilter}`);
    },
  });

  async function getAllLogs(parametersFilter: any) {
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    await logImportService
      .getAll(parametersFilter)
      .then(({ response, total: allTotal }) => {
        setLogs(response);
        setTotalItems(allTotal);
        tableRef.current.dataManager.changePageSize(
          allTotal >= take ? take : allTotal,
        );
      });
  }

  // Call that function when change type order value.
  useEffect(() => {
    getAllLogs(filter);
  }, [typeOrder]);

  // async function handleOrder(
  //   column: string,
  //   order: string | any,
  // ): Promise<void> {
  //   let orderType: any;
  //   let parametersFilter: any;
  //   if (order === 1) {
  //     orderType = 'asc';
  //   } else if (order === 2) {
  //     orderType = 'desc';
  //   } else {
  //     orderType = '';
  //   }

  //   setOrderBy(column);
  //   setTypeOrder(orderType);

  //   if (filter && typeof filter !== 'undefined') {
  //     if (orderType !== '') {
  //       parametersFilter = `${filter}&orderBy=${column}&typeOrder=${orderType}`;
  //     } else {
  //       parametersFilter = filter;
  //     }
  //   } else if (orderType !== '') {
  //     parametersFilter = `orderBy=${column}&typeOrder=${orderType}`;
  //   } else {
  //     parametersFilter = filter;
  //   }

  //   await logImportService
  //     .getAll(`${parametersFilter}&skip=0&take=${take}`)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         setLogs(response.response);
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
  // }

  // function headerTableFactory(name: any, title: string) {
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
  //   };
  // }

  function headerTableStatusFactory() {
    return {
      title: 'Status',
      field: 'state',
      sorting: false,
      render: (rowData: any) => (
        <div className="h-7 flex">
          <div className="h-7">
            {rowData.state}
          </div>
          <div style={{ width: 5 }} />
          {rowData.invalid_data ? (
            <div className="h-7">
              <Button
                title={rowData.state}
                onClick={() => {
                  Swal.fire({
                    html: rowData.invalid_data,
                    width: '800',
                  });
                }}
                icon={<AiFillInfoCircle size={20} />}
                bgColor="bg-blue-600"
                textColor="white"
              />
            </div>
          ) : ''}

        </div>
      ),
    };
  }

  function columnsOrder(columnOrder: string) {
    const columnCampos: string[] = columnOrder.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'user_id') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Usuário',
            title: 'user.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'table') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tabela',
            title: 'table',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'created_at') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Importado em',
            title: 'created_at',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'state') {
        tableFields.push(headerTableStatusFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await fetchWrapper.handleOrderG(column, order, orderList);

    setFieldOrder(name);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
  }

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
          module_id: 25,
        })
        .then((response) => {
          userLogado.preferences.rd = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.rd = {
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

    const items: any = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  // async function lastUpdate(tableName: string) {
  //   switch (tableName) {
  //     case 'ensaio':
  //       return (
  //         <p>00-00-000 00:00:00</p>
  //       );
  //     case 'experimento': {
  //       const { status, response } = await experimentService.getAll({ idSafra });
  //       let lastExperiment: any = 0;
  //       if (status === 200) {
  //         const lastExperimentUpdate = response.map((item: any) => {
  //           if (lastExperiment < item.created_at) {
  //             lastExperiment = item.created_at;
  //           }
  //         });
  //         return (
  //           <p>{lastExperimentUpdate}</p>
  //         );
  //       }
  //       return (
  //         <p>00-00-000 00:00:00</p>
  //       );
  //     }
  //     default:
  //       return (
  //         <p>00-00-000 00:00:00</p>
  //       );
  //   }
  // }

  const downloadExcel = async (): Promise<void> => {
    await logImportService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        response.map((item: any) => {
          const newItem = item;

          newItem.USUÁRIO = item.user.name;
          newItem.TABELA = item.table;
          newItem.STATUS = item.state;
          newItem.IMPORTADO_EM = item.created_at;

          delete newItem.user;
          delete newItem.table;
          delete newItem.state;
          delete newItem.created_at;
          delete newItem.id;
          delete newItem.status;
          return newItem;
        });
        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'logs');

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
        XLSX.writeFile(workBook, 'Logs.xlsx');
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
    await getAllLogs(filter);
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

  function TabPanel(props: TabPanelProps) {
    const {
      children, value, index, ...other
    } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="Importando planilha, aguarde..." />}

      <Head>
        <title>Importação planilhas</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <div className="grid grid-cols-3 gap-4 h-screen">
          <div className="bg-white rounded-lg">
            <div className="mt-2 justify-center flex">
              <span className="text-xl" style={{ marginLeft: '5%' }}>
                IMPORTAÇÃO DE PLANILHAS
              </span>
            </div>
            <hr />

            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  variant="fullWidth"
                >
                  <Tab label="Pesquisa" {...a11yProps(0)} />
                  <Tab label="Equipe de dados" {...a11yProps(1)} />
                </Tabs>
              </Box>

              <TabPanel value={value} index={0}>
                <div className="m-4 grid grid-cols-3 gap-4 h-20 items-center">
                  <div className="h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      bgColor={bgColor}
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(0, '')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">Cadastros RD</span>
                    <Input
                      type="file"
                      required
                      id="inputFile-0"
                      name="inputFile-0"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      bgColor={bgColor}
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(26, 'ASSAY_LIST')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">Importar Lista de Ensaio</span>

                    <Input
                      type="file"
                      required
                      id="inputFile-26"
                      name="inputFile-26"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-24 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      bgColor={bgColor}
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(27, 'GENOTYPE_TREATMENT')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">
                      Importar Subs. de genótipo/nca Ensaio
                    </span>

                    <Input
                      type="file"
                      required
                      id="inputFile-27"
                      name="inputFile-27"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      bgColor={bgColor}
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(22, 'EXPERIMENT')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">
                      Importar Lista de Experimento
                    </span>

                    <Input
                      type="file"
                      required
                      id="inputFile-22"
                      name="inputFile-22"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      bgColor={bgColor}
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(30, 'PARCELS')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">
                      Importar Subs. de genótipo/nca Experimento
                    </span>

                    <Input
                      type="file"
                      required
                      id="inputFile-30"
                      name="inputFile-30"
                    />
                  </div>
                </div>

                <div className="h-10" />
              </TabPanel>

              <TabPanel value={value} index={1}>
                <div className="m-4 grid grid-cols-3 gap-4 h-20 items-center">
                  <div className="h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      bgColor={bgColor}
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(7, 'DELIMITATION')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">Importar Delineamento</span>

                    <Input
                      type="file"
                      required
                      id="inputFile-7"
                      name="inputFile-7"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      bgColor={bgColor}
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(14, 'NPE')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">Importar Ambiente</span>

                    <Input
                      type="file"
                      required
                      id="inputFile-14"
                      name="inputFile-14"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      bgColor={bgColor}
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(5, 'BLOCK_LAYOUT')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">Importar Layout de quadra</span>

                    <Input
                      type="file"
                      required
                      id="inputFile-5"
                      name="inputFile-5"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      bgColor={bgColor}
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(17, 'BLOCK')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">Importar Quadra</span>

                    <Input
                      type="file"
                      required
                      id="inputFile-17"
                      name="inputFile-17"
                    />
                  </div>
                </div>

                <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
                  <div className=" h-20 w-20 flex items-center mr-1">
                    <Button
                      textColor="white"
                      bgColor={bgColor}
                      title={
                        disabledButton
                          ? 'Outra planilha já esta sendo importada'
                          : 'Upload'
                      }
                      rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                      onClick={() => readExcel(31, 'ALLOCATION')}
                      icon={<IoIosCloudUpload size={40} />}
                      disabled={disabledButton}
                      type="button"
                    />
                  </div>
                  <div className="col-span-2" style={{ marginLeft: '-12%' }}>
                    <span className="font-bold">
                      Importar Alocação de Quadra
                    </span>

                    <Input
                      type="file"
                      required
                      id="inputFile-31"
                      name="inputFile-31"
                    />
                  </div>
                </div>
              </TabPanel>
            </Box>
          </div>

          <div className="bg-white rounded-lg col-span-2">
            <div className="mt-2 justify-center flex">
              <span className="text-xl" style={{ marginLeft: '5%' }}>
                HISTÓRICO DE IMPORTAÇÕES
              </span>
            </div>
            <hr />

            <AccordionFilter title="Filtrar log de importação">
              <div className="w-full flex gap-2">
                <form
                  className="flex flex-col
                      w-full
                      items-center
                      px-2
                      bg-white
                    "
                  onSubmit={formik.handleSubmit}
                >
                  <div
                    className="w-full h-full
                      flex
                      justify-center
                      pb-0
                    "
                  >
                    {filterFieldFactory('filterUser', 'Usuário')}
                    {filterFieldFactory('filterTable', 'Tabela')}
                    <div className="h-10 w-1/2 ml-2">
                      <label className="block text-gray-900 text-sm font-bold mb-1">
                        De:
                      </label>
                      <Input
                        type="date"
                        id="filterStartDate"
                        name="filterStartDate"
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="h-10 w-1/2 ml-2">
                      <label className="block text-gray-900 text-sm font-bold mb-1">
                        Até:
                      </label>
                      <Input
                        type="date"
                        id="filterEndDate"
                        name="filterEndDate"
                        onChange={formik.handleChange}
                      />
                    </div>
                    {filterFieldFactory('filterState', 'Status')}

                    <FieldItemsPerPage
                      label="Itens"
                      selected={take}
                      onChange={setTake}
                    />

                    <div style={{ width: 40 }} />
                    <div className="h-7 w-32 mt-6">
                      <Button
                        onClick={() => {
                          setLoading(true);
                        }}
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

            <div
              style={{ marginTop: '1%' }}
              className="w-full h-auto overflow-y-scroll"
            >
              <MaterialTable
                tableRef={tableRef}
                style={{ background: '#f9fafb' }}
                columns={columns}
                data={logs}
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
                    <div className="w-full max-h-96 flex items-center justify-between gap-4 bg-gray-50 py-2 px-5 border-solid border-b border-gray-200">
                      <div />

                      <strong className="text-blue-600">
                        Total registrado:
                        {' '}
                        {itemsTotal}
                      </strong>

                      <div className="h-full flex items-center gap-2">
                        <div className="border-solid border-2 border-blue-600 rounded">
                          <div className="w-72">
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
                                      {generatesProps.map((genarate, index) => (
                                        <Draggable
                                          key={index}
                                          draggableId={String(genarate.title)}
                                          index={index}
                                        >
                                          {(provider) => (
                                            <li
                                              ref={provider.innerRef}
                                              {...provider.draggableProps}
                                              {...provider.dragHandleProps}
                                            >
                                              <CheckBox
                                                name={genarate.name}
                                                title={genarate.title?.toString()}
                                                value={genarate.value}
                                                defaultChecked={camposGerenciados.includes(
                                                  genarate.value as string,
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
                            title="Exportar planilha de logs"
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
                      className="flex h-20 gap-2 pr-2 py-5 bg-gray-50"
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
          </div>
        </div>
      </Content>
    </>
    // )
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 15;

  const { publicRuntimeConfig } = getConfig();
  const { token } = req.cookies;
  const idSafra = Number(req.cookies.safraId);
  const idCulture = Number(req.cookies.cultureId);

  const filterApplication = '';
  const param = `skip=0&take=${itensPerPage}`;

  const urlParameters: any = new URL(
    `${publicRuntimeConfig.apiUrl}/log-import`,
  );
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const { response: allLogs, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());
  let uploadInProcess: number = 0;
  allLogs?.map((item: any) => (item.status === 2 ? (uploadInProcess = 1) : false));
  return {
    props: {
      allLogs,
      totalItems,
      itensPerPage,
      filterApplication,
      uploadInProcess,
      idSafra,
      idCulture,
    },
  };
};
