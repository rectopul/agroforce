/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import Head from 'next/head';
import readXlsxFile from 'read-excel-file';
import Swal from 'sweetalert2';
import React, { useState, ReactNode, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { IoIosCloudUpload } from 'react-icons/io';
import MaterialTable from 'material-table';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar,
} from 'react-icons/ai';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import {
  AccordionFilter, CheckBox, Button, Content, Input,
} from '../../../components';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import { userPreferencesService, logImportService, importService } from '../../../services';
import * as ITabs from '../../../shared/utils/dropdown';

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

interface IData {
  allLogs: LogData[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  id_genotipo: number;
  uploadInProcess: number;
  idSafra: number
  idCulture: number
}
export default function Import({
  allLogs, totalItems, itensPerPage, filterApplication, uploadInProcess, idSafra, idCulture,
}: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'RD'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const [executeUpload, setExecuteUpload] = useState<any>(Number(uploadInProcess));

  function readExcel(moduleId: number, table: string) {
    const value: any = document.getElementById(`inputFile-${moduleId}`);
    if (!value.files[0]) {
      Swal.fire('Insira um arquivo');
      return;
    }
    const userLogado = JSON.parse(localStorage.getItem('user') as string);
    setExecuteUpload(1);
    readXlsxFile(value.files[0]).then((rows) => {
      if (moduleId) {
        importService.validate({
          spreadSheet: rows, moduleId, created_by: userLogado.id, idSafra, idCulture, table,
        }).then(({ message }: any) => {
          Swal.fire({
            html: message,
            width: '800',
          });
          setExecuteUpload(0);
        });
      } else {
        importService.validateProtocol({
          spreadSheet: rows, moduleId, created_by: userLogado.id, idSafra, idCulture, table,
        }).then(({ message }) => {
          Swal.fire({
            html: message,
            width: '800',
          });
          setExecuteUpload(0);
        });
      }
    });
  }

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.rd || { id: 0, table_preferences: 'id,user_id,created_at,table' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [logs, setLogs] = useState<LogData[]>(allLogs);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsTotal = (totalItems || 0);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Usuario', value: 'user_id' },
    { name: 'CamposGerenciados[]', title: 'Tabela', value: 'table' },
    { name: 'CamposGerenciados[]', title: 'Importado em', value: 'created_at' },
  ]);
  const filter = filterApplication;
  const [colorStar, setColorStar] = useState<string>('');

  const take: number = itensPerPage || 10;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const disabledButton = (executeUpload === 1);
  const bgColor = (executeUpload === 1) ? 'bg-red-600' : 'bg-blue-600';

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

    await logImportService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setLogs(response.response);
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
                  <AiTwotoneStar size={25} color="#eba417" />
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
                  <AiTwotoneStar size={25} />
                </button>
              </div>
            </div>
          )
      ),
    };
  }

  function columnsOrder(columnOrder: string) {
    const columnCampos: string[] = columnOrder.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnCampos[index] === 'user_id') {
        tableFields.push(headerTableFactory('Usuário', 'user.name'));
      }
      if (columnCampos[index] === 'table') {
        tableFields.push(headerTableFactory('Tabela', 'table'));
      }
      if (columnCampos[index] === 'created_at') {
        tableFields.push(headerTableFactory('Importado em', 'created_at'));
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

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
        module_id: 25,
      }).then((response) => {
        userLogado.preferences.lote = {
          id: response.response.id,
          userId: preferences.userId,
          table_preferences: campos,
        };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.lote = {
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
    await logImportService.getAll(filterApplication).then(({ status, response }) => {
      if (status === 200) {
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
    const skip = currentPage * Number(take);
    let parametersFilter = `skip=${skip}&take=${take}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await logImportService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setLogs(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);
  return (
    <>
      <Head>
        <title>Importação planilhas</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <div className="grid grid-cols-3 gap-4 h-screen">
          <div className="bg-white rounded-lg">
            <div className="mt-2 justify-center flex">
              <span className="text-xl" style={{ marginLeft: '5%' }}>IMPORTAÇÃO DE PLANILHAS</span>
            </div>
            <hr />

            <div className="m-4 grid grid-cols-3 gap-4 h-20 items-center">
              <div className="h-20 w-20 flex items-center mr-1">
                <Button
                  textColor="white"
                  bgColor={bgColor}
                  rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                  onClick={() => readExcel(0, '')}
                  icon={<IoIosCloudUpload size={40} />}
                  disabled={disabledButton}
                  type="button"
                />
              </div>
              <div className="col-span-2" style={{ marginLeft: '-15%' }}>
                <span className="font-bold">Cadastros RD</span>
                <p>ultimo update 28/06/22</p>
                <Input type="file" required id="inputFile-0" name="inputFile-0" />
              </div>
            </div>

            <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
              <div className=" h-20 w-20 flex items-center mr-1">
                <Button
                  textColor="white"
                  bgColor={bgColor}
                  rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                  onClick={() => readExcel(26, 'lista-ensaio')}
                  icon={<IoIosCloudUpload size={40} />}
                  disabled={disabledButton}
                  type="button"
                />
              </div>
              <div className="col-span-2" style={{ marginLeft: '-15%' }}>
                <span className="font-bold">Importar Lista de Ensaio</span>
                <p>ultimo update 28/06/22</p>
                <Input type="file" required id="inputFile-26" name="inputFile-26" />
              </div>
            </div>

            <div className="m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center">
              <div className=" h-20 w-20 flex items-center mr-1">
                <Button
                  textColor="white"
                  bgColor={bgColor}
                  rounder="rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full"
                  onClick={() => readExcel(22, 'experimento')}
                  icon={<IoIosCloudUpload size={40} />}
                  disabled={disabledButton}
                  type="button"
                />
              </div>
              <div className="col-span-2" style={{ marginLeft: '-15%' }}>
                <span className="font-bold">Importar Lista de Experimento</span>
                <p>ultimo update 28/06/22</p>
                <Input type="file" required id="inputFile-22" name="inputFile-22" />
              </div>
            </div>

          </div>

          <div className="bg-white rounded-lg col-span-2">
            <div className="mt-2 justify-center flex">
              <span className="text-xl" style={{ marginLeft: '5%' }}>HISTÓRICO DE IMPORTAÇÕES</span>
            </div>
            <hr />

            <div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
              <MaterialTable
                style={{ background: '#f9fafb' }}
                columns={columns}
                data={logs}
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
                      className="w-full max-h-96 flex items-center justify-between gap-4 bg-gray-50 py-2 px-5 border-solid border-b border-gray-200"
                    >

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
                                          generatesProps.map((genarate, index) => (
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
                                                    defaultChecked={camposGerenciados
                                                      .includes(genarate.value as string)}
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
                          <Button title="Exportar planilha de logs" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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
          </div>
        </div>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0].itens_per_page ?? 15;

  const { publicRuntimeConfig } = getConfig();
  const { token } = req.cookies;
  const idSafra = Number(req.cookies.safraId);
  const idCulture = Number(req.cookies.cultureId);

  const filterApplication = '';
  const param = `skip=0&take=${itensPerPage}`;

  const urlParameters: any = new URL(`${publicRuntimeConfig.apiUrl}/log-import`);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const {
    response: allLogs,
    total: totalItems,
  } = await fetch(urlParameters.toString(), requestOptions).then((response) => response.json());
  let uploadInProcess: number = 0;
  allLogs.map((item: any) => (item.status === 2 ? uploadInProcess = 1 : false));
  return {
    props: {
      allLogs, totalItems, itensPerPage, filterApplication, uploadInProcess, idSafra, idCulture,
    },
  };
};
