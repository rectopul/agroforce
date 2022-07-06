import Head from 'next/head';
import readXlsxFile from 'read-excel-file';
import { importService } from 'src/services/';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import React, { useState, ReactNode, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { IoIosCloudUpload } from "react-icons/io";
import MaterialTable from "material-table";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar } from "react-icons/ai";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { AccordionFilter, CheckBox, Select } from "src/components";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { userPreferencesService, logImportService } from "src/services";
import * as XLSX from 'xlsx';
import { Button, Content, Input } from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

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
  allItems: LogData[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
  id_genotipo: number;
  UploadInProcess: number;
}
export default function Import({ allItems, totalItems, itensPerPage, filterAplication, UploadInProcess }: IData) {
  const router = useRouter();
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'RD'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));
  function readExcel() {
    var value: any = document.getElementById("inputFile");
    if (!value.files[0]) {
      Swal.fire("Insira um arquivo")
      return;
    }
    const userLogado = JSON.parse(localStorage.getItem("user") as string);
    setExecuteUpload(1);
    readXlsxFile(value.files[0]).then((rows) => {
      importService.validateProtocol({ spreadSheet: rows, created_by: userLogado.id }).then((response) => {
        if (response.message !== '') {
          Swal.fire({
            html: response.message,
            width: '900',
          });
        }
        if (!response.error) {
          Swal.fire({
            html: response.message,
            width: '800',
          });
        }
        setExecuteUpload(0);
      });
    });
  }

  const formik = useFormik<any>({
    initialValues: {
      input: [],
      safra: '',
      foco: '',
    },
    onSubmit: async (values) => {
      var inputFile: any = document.getElementById("inputFile");
      readExcel();
    },
  });

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.lote || { id: 0, table_preferences: "id,user_id,created_at, table" };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [executeUpload, setExecuteUpload] = useState<any>(Number(UploadInProcess));
  console.log(executeUpload);
  const [logs, setLogs] = useState<LogData[]>(allItems);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems || 0);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Favorito", value: "id" },
    { name: "CamposGerenciados[]", title: "Usuario", value: "user_id" },
    { name: "CamposGerenciados[]", title: "Tabela", value: "table" },
    { name: "CamposGerenciados[]", title: "Importado em", value: "created_at" },
  ]);
  const [filter, setFilter] = useState<any>(filterAplication);
  const [colorStar, setColorStar] = useState<string>('');

  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const take: number = itensPerPage || 10;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const columns = columnsOrder(camposGerenciados);

  const disabledButton = (executeUpload === 1) ? true : false;
  const bgColor = (executeUpload === 1) ? 'bg-red-600' : 'bg-blue-600';

  const formikLote = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      const parametersFilter = "filterStatus=" + values.filterStatus + "&filterSearch=" + values.filterSearch;
      await logImportService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response: LogData[]) => {
        setLogs(response);
        setTotaItems(response.length);
        setFilter(parametersFilter);
      });
    },
  });

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button className="font-medium text-gray-900" onClick={() => handleOrder(title, orderList)}>
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

  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnCampos[index] === 'user_id') {
        tableFields.push(headerTableFactory('Usuario', 'user_id'));
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

    await logImportService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
      console.log('ENTROUUUU 1')
      if (response.status === 200) {
        setLogs(response.response)
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

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = '';
    for (let i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 12 }).then((response) => {
        userLogado.preferences.lote = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.lote = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
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

  const downloadExcel = async (): Promise<void> => {
    if (!filterAplication.includes('paramSelect')) {
      filterAplication += `&paramSelect=${camposGerenciados}`;
    }

    await logImportService.getAll(filterAplication).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: { status: any }) => {
          if (row.status === 0) {
            row.status = 'Inativo';
          } else {
            row.status = 'Ativo';
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'logs');

        // Buffer
        const buf = XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'buffer',
        });
        // Binary
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'binary',
        });
        // Download
        XLSX.writeFile(workBook, 'logs.xlsx');
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
        console.log('Itemns', allItems);

        // console.log(response.response);
        setLogs(response.response);
        console.log('Logs', logs);
      }
    });
  };

  useEffect(() => {
    handlePagination(); '';
    handleTotalPages();
  }, [currentPage]);
  return (
    <>
      <Head>
        <title>Importação planilhas</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive={'listas'}>
        <div className="grid grid-cols-3 gap-4 h-screen	">
          <div className="bg-white rounded-lg">
            <div className="mt-2 justify-center flex">
              <span className="text-xl" style={{ marginLeft: "5%" }}>IMPORTAÇÃO DE PLANILHAS</span>
            </div>
            <hr></hr>
            <div className="m-4 grid grid-cols-3 gap-4 h-20 items-center">
              <div className="
											h-20
											w-20
											flex
											items-center
											mr-1
										">
                <Button
                  textColor='white'
                  bgColor={bgColor}
                  rounder={`rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full`}
                  onClick={() => readExcel()}
                  icon={<IoIosCloudUpload size={40} />}
                  disabled={disabledButton}
                  type="button" />
                <span className="text-white">{<IoIosCloudUpload size={40} />}</span>
              </div>
              <div className="col-span-2" style={{ marginLeft: "-15%" }}>
                <span className="font-bold">Titulo</span>
                <p>ultimo update 28/06/22</p>
                <a><Input type="file" required id="inputFile" name="inputFile" /></a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg col-span-2">
            <div className="mt-2 justify-center flex">
              <span className="text-xl" style={{ marginLeft: "5%" }}>HISTORICO DE IMPORTAÇÕES</span>
            </div>
            <hr></hr>

            <div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
              <MaterialTable
                style={{ background: '#f9fafb' }}
                columns={columns}
                data={logs}
                options={{
                  showTitle: false,
                  headerStyle: {
                    zIndex: 20
                  },
                  search: false,
                  filtering: false,
                  pageSize: itensPerPage
                }}
                components={{
                  Toolbar: () => (
                    <div
                      className='w-full max-h-96	
												flex
												items-center
												justify-between
												gap-4
												bg-gray-50
												py-2
												px-5
												border-solid border-b
												border-gray-200
											'>

                      <strong className='text-blue-600'>Total registrado: {itemsTotal}</strong>

                      <div className='h-full flex items-center gap-2'>
                        <div className="border-solid border-2 border-blue-600 rounded">
                          <div className="w-72">
                            <AccordionFilter title='Gerenciar Campos' grid={statusAccordion}>
                              <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId='characters'>
                                  {
                                    (provided) => (
                                      <ul className="w-full h-full characters" {...provided.droppableProps} ref={provided.innerRef}>
                                        <div className="h-8 mb-3">
                                          <Button
                                            value="Atualizar"
                                            bgColor='bg-blue-600'
                                            textColor='white'
                                            onClick={getValuesColumns}
                                            icon={<IoReloadSharp size={20} />}
                                          />
                                        </div>
                                        {
                                          generatesProps.map((genarate, index) => (
                                            <Draggable key={index} draggableId={String(genarate.title)} index={index}>
                                              {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                  <CheckBox
                                                    name={genarate.name}
                                                    title={genarate.title?.toString()}
                                                    value={genarate.value}
                                                    defaultChecked={camposGerenciados.includes(genarate.value as string)}
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

                        <div className='h-12 flex items-center justify-center w-full'>
                          <Button title="Exportar planilha de logs" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
                        </div>
                      </div>
                    </div>
                  ),
                  Pagination: (props) => (
                    <>
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
                            <>
                              <Button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                value={`${currentPage + 1}`}
                                bgColor="bg-blue-600"
                                textColor="white"
                                disabled={true}
                              />
                            </>
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
                    </>
                  ) as any
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0].itens_per_page ?? 15;

  const { publicRuntimeConfig } = getConfig();
  const token = req.cookies.token;

  const filterAplication = "";
  const param = `skip=0&take=${itensPerPage}`;

  const urlParameters: any = new URL(`${publicRuntimeConfig.apiUrl}/log-import`);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const apiLogs: any = await fetch(urlParameters.toString(), requestOptions);
  const { response: allItems, total: totalItems } = await apiLogs.json();
  let UploadInProcess: number = 0;
  allItems.map((item: any) => {
    item.status === 2 ? UploadInProcess = 1 : false;
  });
  return { props: { allItems, totalItems, itensPerPage, filterAplication, UploadInProcess } }
}
