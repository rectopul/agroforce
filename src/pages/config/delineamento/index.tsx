import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import router from 'next/router';
import { useEffect, useState, useRef } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineTable,
  AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { delineamentoService, userPreferencesService } from 'src/services';
import * as XLSX from 'xlsx';
import { number } from 'yup/lib/locale';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ButtonToogleConfirmation,
} from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../helpers';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../components/Loading';
import { functionsUtils } from '../../../shared/utils/functionsUtils';
import perm_can_do from '../../../shared/utils/perm_can_do';

interface IDelineamentoProps {
  id: number | any;
  name: string | any;
  repeticao: string;
  trat_repeticao: number;
  created_by: number;
  status: number;
}

interface IFilter {
  filterStatus: object | any;
  filterName: string | any;
  filterRepeat: string | any;
  filterTreatment: string | any;
  orderBy: object | any;
  typeOrder: object | any;
  filterRepetitionFrom: string | any;
  filterRepetitionTo: string | any;
  filterTratRepetitionFrom: string | any;
  filterTratRepetitionTo: string | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  delineamentos: IDelineamentoProps[];
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  cultureId: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
}

export default function Listagem({
  delineamentos,
  itensPerPage,
  filterApplication,
  totalItems,
  cultureId,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);
  const { TabsDropDowns } = ITabs.default;

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'DELINEAMENTO'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.delineamento || {
    id: 0,
    table_preferences: 'id,name,repeticao,trat_repeticao,sequencia,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [delineamento, setDelineamento] = useState<IDelineamentoProps[]>(
    () => delineamentos,
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);

  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito ',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome',
      value: 'name',
      defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Repetiçao ',
      value: 'repeticao',
      defaultChecked: () => camposGerenciados.includes('repeticao'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Trat Repetição',
      value: 'trat_repeticao',
      defaultChecked: () => camposGerenciados.includes('trat_repeticao'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Sequência',
      value: 'sequencia',
      defaultChecked: () => camposGerenciados.includes('sequencia'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ação',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const columns = colums(camposGerenciados);
  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const formik = useFormik<IFilter>({
    initialValues: {
      filterRepetitionTo: checkValue('filterRepetitionTo'),
      filterRepetitionFrom: checkValue('filterRepetitionFrom'),
      filterTratRepetitionTo: checkValue('filterTratRepetitionTo'),
      filterTratRepetitionFrom: checkValue('filterTratRepetitionFrom'),
      filterStatus: filterStatusBeforeEdit[13],
      filterName: checkValue('filterName'),
      filterRepeat: checkValue('filterRepeat'),
      filterTreatment: checkValue('filterTreatment'),
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterName,
      filterRepeat,
      filterTreatment,
      filterRepetitionTo,
      filterRepetitionFrom,
      filterTratRepetitionTo,
      filterTratRepetitionFrom,
    }) => {
      if (!functionsUtils?.isNumeric(filterRepetitionFrom)) {
        return Swal.fire('O campo Repetição não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterRepetitionTo)) {
        return Swal.fire('O campo Repetição não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterTratRepetitionFrom)) {
        return Swal.fire(
          'O campo Trat Repetição não pode ter ponto ou vírgula.',
        );
      }
      if (!functionsUtils?.isNumeric(filterTratRepetitionTo)) {
        return Swal.fire(
          'O campo Trat Repetição não pode ter ponto ou vírgula.',
        );
      }

      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterName=${filterName}&filterRepeat=${filterRepeat}&filterTreatment=${filterTreatment}&id_culture=${cultureId}&filterRepetitionTo=${filterRepetitionTo}&filterRepetitionFrom=${filterRepetitionFrom}&filterTratRepetitionTo=${filterTratRepetitionTo}&filterTratRepetitionFrom=${filterTratRepetitionFrom}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
      // await delineamentoService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setDelineamento(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });

      setLoading(true);
      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);

    // parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await delineamentoService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setDelineamento(response.response);
          setTotalItems(response.total);
          setLoading(false);
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

  // function headerTableFactory(name: any, title: string) {
  //   return {
  //     title: (
  //       <div className="flex items-center">
  //         <button
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

  function statusHeaderFactory() {
    return {
      title: 'Ação',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: IDelineamentoProps) => (
        <div className="h-7 flex">
          <div className="ml-1" />
          <ButtonToogleConfirmation
            style={{ display: !perm_can_do('/config/delineamento/delineamento', 'disable') ? 'none' : '' }}
            data={rowData}
            text="o delineamento"
            keyName="name"
            onPress={handleStatus}
          />
        </div>
      ),
    };
  }

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item: any) => {
      // if (columnCampos[item] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[item] === 'name') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome',
            title: 'name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }

      if (columnCampos[item] === 'repeticao') {
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

      if (columnCampos[item] === 'trat_repeticao') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Trat Repetição',
            title: 'trat_repeticao',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }

      if (columnCampos[item] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
      if (columnCampos[item] === 'sequencia') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Sequência',
            title: 'sequencia',
            orderList,
            fieldOrder,
            handleOrder,
            filterPlaceholder: 'Filtrar por status',
            render: (rowData: IDelineamentoProps) => (
              <div className="h-7 flex">
                <div
                  className="
                    h-7
                  "
                >
                  <Button
                    icon={<AiOutlineTable size={14} />}
                    style={{ display: !perm_can_do('/config/delineamento/delineamento/sequencia-delineamento', 'view') ? 'none' : '' }}
                    onClick={() => {
                      setCookies('pageBeforeEdit', currentPage?.toString());
                      setCookies('filterBeforeEdit', filter);
                      setCookies('filterBeforeEditTypeOrder', typeOrder);
                      setCookies('filterBeforeEditOrderBy', orderBy);
                      setCookies('filtersParams', filtersParams);
                      setCookies('lastPage', 'sequencia-delineamento');
                      setCookies('itensPage', itensPerPage);
                      setCookies('takeBeforeEdit', take);
                      router.push(
                        `delineamento/sequencia-delineamento?id_delineamento=${rowData.id}`,
                      );
                    }}
                    bgColor="bg-yellow-500"
                    textColor="white"
                    title={`Sequência de ${rowData.name}`}
                  />
                </div>
              </div>
            ),
          }),
        );
      }
    });
    return tableFields;
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

    // await delineamentoService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setDelineamento(response.response);
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

    setFieldOrder(columnG);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    typeOrderG !== '' ? (typeOrderG == 'desc' ? setOrder(1) : setOrder(2)) : '';
    setArrowOrder(arrowOrder);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
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
          module_id: 7,
        })
        .then((response) => {
          userLogado.preferences.delineamento = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.delineamento = {
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

  async function handleStatus(data: IDelineamentoProps): Promise<void> {
    setLoading(true);
    const parametersFilter = `filterStatus=${1}&id_culture=${cultureId}&name=${
      data?.name
    }`;

    await delineamentoService.getAll(parametersFilter).then((response) => {
      // if (response.total > 0) {
      //   return Swal.fire(
      //     'Delineamento não pode ser atualizado pois já existe uma delineamento com esse nome ativo!',
      //   );
      // }
      delineamentoService.update({
        id: data?.id,
        created_by: userLogado?.id,
        status: data?.status === 0 ? 1 : 0,
      });

      handlePagination(currentPage);

      // const index = delineamento.findIndex(
      //   (delineamento) => delineamento.id === data?.id
      // );

      // if (index === -1) {
      //   return;
      // }

      // setDelineamento((oldSafra) => {
      //   const copy = [...oldSafra];
      //   copy[index].status = data?.status === 0 ? 1 : 0;
      //   return copy;
      // });

      // const { id, status } = delineamento[index];
    });
    // } else {
    //   if (data.status === 0) {
    //     data.status = 1;
    //   } else {
    //     data.status = 0;
    //   }

    //   delineamentoService.update({
    //     id: data?.id,
    //     status: data.status,
    //   });

    //   const index = delineamento.findIndex(
    //     (delineamento) => delineamento.id === data?.id
    //   );

    //   if (index === -1) {
    //     return;
    //   }

    //   setDelineamento((oldSafra) => {
    //     const copy = [...oldSafra];
    //     copy[index].status = data.status;
    //     return copy;
    //   });

    //   const { id, status } = delineamento[index];
    // }
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
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await delineamentoService.getAll(filterParam).then(({ status, response }) => {
      if (status === 200) {
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, 'delineamento');

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
        XLSX.writeFile(workBook, 'Delineamento.xlsx');
      } else {
        Swal.fire('Não existem registros para serem exportados, favor checar.');
      }
    });
    setLoading(false);
  };

  async function handlePagination(page: any): Promise<void> {
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
    // await delineamentoService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setDelineamento(response.response);
    //   }
    // });
    await callingApi(filter, page); // handle pagination globly
  }

  // manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams,
    );
    return parameter;
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem dos delineamentos</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >
          <AccordionFilter
            title="Filtrar delineamentos"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
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
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-0
                "
                >
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatusBeforeEdit[13]}
                      // defaultValue={checkValue('filterStatus')}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="nome"
                      id="filterName"
                      name="filterName"
                      onChange={formik.handleChange}
                      defaultValue={checkValue('filterName')}
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Repetição
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterRepetitionFrom"
                        name="filterRepetitionFrom"
                        defaultValue={checkValue('filterRepetitionFrom')}
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        type="number"
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
                      Trat Repetição
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterTratRepetitionFrom"
                        name="filterTratRepetitionFrom"
                        defaultValue={checkValue('filterTratRepetitionFrom')}
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        type="number"
                        placeholder="Até"
                        id="filterTratRepetitionTo"
                        name="filterTratRepetitionTo"
                        defaultValue={checkValue('filterTratRepetitionTo')}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
                    <Button
                      onClick={() => {}}
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
          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={delineamento}
              options={{
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 400 : 320
                }px)`,
                showTitle: false,
                headerStyle: {
                  zIndex: 1,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
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
                    {/* <div className='h-12'>
                      <Button
                        title="Cadastrar Delineamento"
                        value="Cadastrar Delineamento"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {router.push('delineamento/cadastro')}}
                        icon={<FiUserPlus size={20} />}
                      />
                    </div> */}
                    <div className="h-12">
                      <Button
                        title="Importar"
                        value="Importar"
                        bgColor="bg-blue-600"
                        style={{ display: !perm_can_do('/config/delineamento/delineamento', 'import') ? 'none' : '' }}
                        textColor="white"
                        onClick={() => {
                          window.open(
                            '/listas/rd?importar=delineamento',
                            '_blank',
                          );
                        }}
                        icon={<RiFileExcel2Line size={20} />}
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
                                        {(provided) => (
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
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
                        {/* <Button title="Importação de planilha" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {router.push('sequencia-delineamento/importacao')}} /> */}
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
                      {/* <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Configurar Importação de Planilha"
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {}}
                          href="delineamento/importar-planilha/config-planilha"
                        />
                      </div> */}
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
                      onClick={() => handlePagination(0)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage < 1}
                    />
                    <Button
                      onClick={() => handlePagination(currentPage - 1)}
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
                          onClick={() => handlePagination(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))}
                    <Button
                      onClick={() => handlePagination(currentPage + 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiRightArrow size={15} />}
                      disabled={currentPage + 1 >= pages}
                    />
                    <Button
                      onClick={() => handlePagination(pages - 1)}
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
  const { cultureId } = req.cookies;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('itensPage', { req, res });
  }

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `filterStatus=1&id_culture=${cultureId}`;

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'repeticao';

  const { token } = req.cookies;
  // const { cultureId } = req.cookies;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1&id_culture=${cultureId}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/delineamento`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const response = await fetch(urlParameters.toString(), requestOptions);
  const { response: delineamentos, total: totalItems } = await response.json();

  return {
    props: {
      delineamentos,
      totalItems,
      itensPerPage,
      filterApplication,
      cultureId,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
