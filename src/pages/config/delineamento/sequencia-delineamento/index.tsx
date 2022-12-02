/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import {
  ReactNode, useEffect, useState, useRef,
} from 'react';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { removeCookies, setCookies } from 'cookies-next';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  sequenciaDelineamentoService,
  userPreferencesService,
} from '../../../../services';
import { IReturnObject } from '../../../../interfaces/shared/Import.interface';
import ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
  filterRepetitionFrom: string | any;
  filterRepetitionTo: string | any;
  filterOrderFrom: string | any;
  filterOrderTo: string | any;
  filterNtFrom: string | any;
  filterNtTo: string | any;
  filterBlockFrom: string | any;
  filterBlockTo: string | any;
}

interface ISequenciaDelineamento {
  id: number;
  id_delineamento: number;
  delineamento: string;
  repeticao: number;
  sorteio: number;
  nt: number;
  bloco: number;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allItems: ISequenciaDelineamento[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  idDelineamento: number;
  typeOrderServer: any | string;
  orderByserver: any | string;
  filterBeforeEdit: any | object;
}

export default function Listagem({
  allItems,
  totalItems,
  itensPerPage,
  filterApplication,
  idDelineamento,
  typeOrderServer,
  orderByserver,
  filterBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs;

  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'DELINEAMENTO'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.sequencia_delineamento || {
    id: 0,
    table_preferences: 'id,delineamento,repeticao,sorteio,nt,bloco,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [seqDelineamento, setSeqDelineamento] = useState<
    ISequenciaDelineamento[]
  >(() => allItems);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<any>(filterBeforeEdit); // Set filter Parameter
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome',
      value: 'delineamento',
    },
    { name: 'CamposGerenciados[]', title: 'Repetição', value: 'repeticao' },
    { name: 'CamposGerenciados[]', title: 'Ordem', value: 'sorteio' },
    { name: 'CamposGerenciados[]', title: 'NT', value: 'nt' },
    { name: 'CamposGerenciados[]', title: 'Bloco', value: 'bloco' },
    // { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterSearch: checkValue('filterSearch'),
      orderBy: '',
      typeOrder: '',
      filterRepetitionTo: checkValue('filterRepetitionTo'),
      filterRepetitionFrom: checkValue('filterRepetitionFrom'),
      filterOrderTo: checkValue('filterOrderTo'),
      filterOrderFrom: checkValue('filterOrderFrom'),
      filterNtTo: checkValue('filterNtTo'),
      filterNtFrom: checkValue('filterNtFrom'),
      filterBlockTo: checkValue('filterBlockTo'),
      filterBlockFrom: checkValue('filterBlockFrom'),
    },
    onSubmit: async ({
      // eslint-disable-next-line max-len
      filterSearch,
      filterRepetitionTo,
      filterRepetitionFrom,
      filterOrderTo,
      filterOrderFrom,
      filterNtTo,
      filterNtFrom,
      filterBlockTo,
      filterBlockFrom,
    }) => {
      const parametersFilter = `&filterSearch=${filterSearch}&filterRepetitionTo=${filterRepetitionTo}&filterRepetitionFrom=${filterRepetitionFrom}&filterOrderTo=${filterOrderTo}&filterOrderFrom=${filterOrderFrom}&filterNtTo=${filterNtTo}&filterNtFrom=${filterNtFrom}&filterBlockTo=${filterBlockTo}&filterBlockFrom=${filterBlockFrom}&id_delineamento=${idDelineamento}`;
      // await sequenciaDelineamentoService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then(({ response, total: newTotal }: IReturnObject) => {
      //     setFilter(parametersFilter);
      //     setSeqDelineamento(response);
      //     setTotalItems(newTotal);
      //     setCurrentPage(0);
      //   });

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any) {
    setCookies('filterBeforeEditSquence', parametersFilter);
    setCookies('filterBeforeEditTypeOrderSquence', typeOrder);
    setCookies('filterBeforeEditOrderBySquence', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await sequenciaDelineamentoService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setSeqDelineamento(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleStatusCulture(
    idCulture: number,
    data: ISequenciaDelineamento,
  ): Promise<void> {
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }

    const index = seqDelineamento.findIndex((item) => item.id === idCulture);

    if (index === -1) {
      return;
    }

    setSeqDelineamento((oldCulture) => {
      const copy = [...oldCulture];
      copy[index].status = data.status;
      return copy;
    });
  }

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
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
    // if (filter && typeof (filter) !== 'undefined') {
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

    // await sequenciaDelineamentoService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then(({ status, response }: IReturnObject) => {
    //     if (status === 200) {
    //       setSeqDelineamento(response);
    //     }
    //   });

    // if (orderList === 2) {
    //   setOrder(0);
    //   setArrowOrder(<AiOutlineArrowDown />);
    // } else {
    //   setOrder(orderList + 1);
    //   if (orderList === 1) {
    //     setArrowOrder(<AiOutlineArrowUp />);
    //   } else {
    //     setArrowOrder('');
    //   }
    // }

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
  //     sorting: false,
  //   };
  // }

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (colorStar === '#eba417' ? (
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
      ) : (
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
      )),
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Status',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: ISequenciaDelineamento) => (
        <div className="h-7 flex">
          {rowData.status ? (
            <div className="h-7">
              <Button
                icon={<FaRegThumbsUp size={14} />}
                title="Ativo"
                onClick={async () => handleStatusCulture(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
          ) : (
            <div className="h-7">
              <Button
                icon={<FaRegThumbsDown size={14} />}
                title="Inativo"
                onClick={async () => handleStatusCulture(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                bgColor="bg-red-800"
                textColor="white"
              />
            </div>
          )}
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
      if (columnCampos[index] === 'delineamento') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome',
            title: 'delineamento.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'repeticao') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Repetição',
            title: 'repeticao',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'sorteio') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Ordem',
            title: 'sorteio',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'nt') {
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
      if (columnCampos[index] === 'bloco') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Bloco',
            title: 'bloco',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      // if (columnCampos[index] === 'status') {
      //   tableFields.push(statusHeaderFactory());
      // }
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
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id: 16,
        })
        .then((response) => {
          userLogado.preferences.sequencia_delineamento = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.sequencia_delineamento = {
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
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    await sequenciaDelineamentoService
      .getAll(filter)
      .then(({ status, response }: IReturnObject) => {
        if (status === 200) {
          const newData = response.map((row: any) => {
            if (row.status === 0) {
              row.status = 'Inativo' as any;
            } else {
              row.status = 'Ativo' as any;
            }
            row.NOME = row.delineamento?.name;
            row.REPETICAO = row.repeticao;
            row.SORTEIO = row.sorteio;
            row.NT = row.nt;
            row.BLOCO = row.bloco;
            row.STATUS = row.status;

            delete row.nt;
            delete row.bloco;
            delete row.status;
            delete row.sorteio;
            delete row.repeticao;
            delete row.id;
            delete row.id_delineamento;
            delete row.delineamento;

            return row;
          });

          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            workBook,
            workSheet,
            'Sequencia de delineamento',
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
          XLSX.writeFile(workBook, 'Sequencia de delineamento.xlsx');
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
    //   parametersFilter = `skip=${skip}&take=${take}&id_delineamento=${idDelineamento}&orderBy=${orderBy}&typeOrder=${orderType}`;
    // } else {
    //   parametersFilter = `skip=${skip}&take=${take}&id_delineamento=${idDelineamento}`;
    // }

    // if (filter) {
    //   parametersFilter = `${parametersFilter}&${filter}`;
    // }
    // await sequenciaDelineamentoService
    //   .getAll(parametersFilter)
    //   .then(({ status, response, total: allTotal }: IReturnObject) => {
    //     if (status === 200) {
    //       setSeqDelineamento(response);
    //       setTotalItems(allTotal);
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

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem de sequência de delineamento</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="h-full w-full flex flex-col items-start gap-4">
          <AccordionFilter title="Filtrar sequências de delineamentos">
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
                  {/* <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={checkValue('filterStatus')}
                      values={filtersStatusItem.map((id) => id)}
                      selected="1"
                    />
                  </div> */}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome"
                      id="filterSearch"
                      name="filterSearch"
                      defaultValue={checkValue('filterSearch')}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Repetição
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterRepetitionFrom"
                        name="filterRepetitionFrom"
                        defaultValue={checkValue('filterRepetitionFrom')}
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 5 }}
                        placeholder="Até"
                        id="filterRepetitionTo"
                        name="filterRepetitionTo"
                        defaultValue={checkValue('filterRepetitionTo')}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Ordem
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterOrderFrom"
                        name="filterOrderFrom"
                        defaultValue={checkValue('filterOrderFrom')}
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 5 }}
                        placeholder="Até"
                        id="filterOrderTo"
                        defaultValue={checkValue('filterOrderTo')}
                        name="filterOrderTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NT
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterNtFrom"
                        name="filterNtFrom"
                        defaultValue={checkValue('filterNtFrom')}
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 5 }}
                        placeholder="Até"
                        id="filterNtTo"
                        name="filterNtTo"
                        defaultValue={checkValue('filterNtTo')}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Bloco
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterBlockFrom"
                        name="filterBlockFrom"
                        defaultValue={checkValue('filterBlockFrom')}
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 5 }}
                        placeholder="Até"
                        id="filterBlockTo"
                        defaultValue={checkValue('filterBlockTo')}
                        name="filterBlockTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      type="submit"
                      onClick={() => {
                        setLoading(true);
                      }}
                      value="Filtrar"
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiFilterAlt size={18} />}
                    />
                  </div>
                </div>
              </form>
            </div>
          </AccordionFilter>

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={seqDelineamento}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
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
                    <div className="w-40 h-7">
                      <Button
                        type="button"
                        value="Voltar"
                        bgColor="bg-red-600"
                        textColor="white"
                        onClick={() => {
                          router.back();
                        }}
                        icon={<IoMdArrowBack size={18} />}
                      />
                    </div>

                    <div className="h-12" />
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
                                    {generatesProps.map((generate, index) => (
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
                                              defaultChecked={camposGerenciados.includes(
                                                generate.value as string,
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
                          title="Exportar planilha de delineamento"
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
  query,
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 15;

  const { token } = req.cookies;
  const idDelineamento: number = Number(query.id_delineamento);

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/sequencia-delineamento`;

  // Last page
  const lastPageServer = req.cookies.lastPageSquence
    ? req.cookies.lastPageSquence
    : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEditSquence', { req, res });
    removeCookies('pageBeforeEditSquence', { req, res });
    removeCookies('filterBeforeEditTypeOrderSquence', { req, res });
    removeCookies('filterBeforeEditOrderBySquence', { req, res });
    removeCookies('lastPageSquence', { req, res });
  }

  const filterBeforeEdit = req.cookies.filterBeforeEditSquence
    ? req.cookies.filterBeforeEditSquence
    : `filterStatus=1&id_delineamento=${idDelineamento}`;

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrderSquence
    ? req.cookies.filterBeforeEditTypeOrderSquence
    : 'asc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBySquence
    ? req.cookies.filterBeforeEditOrderBySquence
    : 'sorteio';

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_delineamento=${idDelineamento}`;
  // const filterApplication = 'filterStatus=1';

  const filterApplication = req.cookies.filterBeforeEditSquence
    ? req.cookies.filterBeforeEditSquence
    : `filterStatus=1&id_delineamento=${idDelineamento}`;

  removeCookies('filterBeforeEditSquence', { req, res });
  removeCookies('pageBeforeEditSquence', { req, res });
  removeCookies('filterBeforeEditTypeOrderSquence', { req, res });
  removeCookies('filterBeforeEditOrderBySquence', { req, res });
  removeCookies('lastPageSquence', { req, res });

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allItems, total: totalItems }: IReturnObject = await fetch(
    `${baseUrl}`,
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allItems,
      totalItems,
      itensPerPage,
      filterApplication,
      idDelineamento,
      orderByserver,
      typeOrderServer,
      filterBeforeEdit,
    },
  };
};
