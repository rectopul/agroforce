/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
  AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import {
  RiFileExcel2Line,
  RiSettingsFill,
  RiArrowUpDownLine,
  RiCloseCircleFill,
} from 'react-icons/ri';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { removeCookies, setCookies } from 'cookies-next';
import experiment from 'src/pages/api/experiment';
import { number } from 'yup';
import Modal from 'react-modal';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ButtonToogleConfirmation,
  ManageFields,
} from '../../../components';
import { quadraService, userPreferencesService } from '../../../services';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import ITabs from '../../../shared/utils/dropdown';
import { functionsUtils } from '../../../shared/utils/functionsUtils';
import { tableGlobalFunctions } from '../../../helpers';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../components/Loading';
import { perm_can_do } from '../../../shared/utils/perm_can_do';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  filterSchema: string | any;
  filterPreparation: string | any;
  filterPFrom: string | any;
  filterPTo: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface IQuadra {
  id: number;
  id_culture: number;
  local: any;
  local_plagio: string;
  cod_quadra: string;
  comp_p: string;
  linha_p: string;
  esquema: string;
  divisor: string;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  quadras: IQuadra[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  cultureId: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string;
  orderByserver: any | string;
}

export default function Listagem({
  quadras,
  totalItems,
  itensPerPage,
  filterApplication,
  cultureId,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();
  const [loading, setLoading] = useState<boolean>(false);

  tabsDropDowns.map((tab) => (tab.titleTab === 'QUADRAS'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const tableRef = useRef<any>(null);

  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'quadra';
  const module_name = 'quadras';
  const module_id = 17;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,local_preparo,cod_quadra,linha_p,esquema,allocation,status,action';
  const preferencesDefault = {
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  };

  const [preferences, setPreferences] = useState<any>(
    userLogado.preferences[identifier_preference] || preferencesDefault,
  );

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [quadra, setQuadra] = useState<IQuadra[]>(() => quadras);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    {
      name: 'CamposGerenciados[]',
      title: 'Local preparo',
      value: 'local_preparo',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Código quadra',
      value: 'cod_quadra',
    },
    { name: 'CamposGerenciados[]', title: 'Linha P', value: 'linha_p' },
    { name: 'CamposGerenciados[]', title: 'Esquema', value: 'esquema' },
    {
      name: 'CamposGerenciados[]',
      title: 'Status Alocação',
      value: 'allocation',
    },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
    { name: 'CamposGerenciados[]', title: 'Ação', value: 'action' },
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

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const [modalImport, setModalImport] = useState(false);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterSearch: checkValue('filterSearch'),
      filterSchema: checkValue('filterSchema'),
      filterPTo: checkValue('filterPTo'),
      filterPFrom: checkValue('filterPFrom'),
      filterPreparation: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterSearch,
      filterSchema,
      filterPTo,
      filterPFrom,
      filterPreparation,
    }) => {
      if (!functionsUtils?.isNumeric(filterPFrom)) {
        return Swal.fire('O campo Linha P não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterPTo)) {
        return Swal.fire('O campo Linha P não pode ter ponto ou vírgula.');
      }

      const parametersFilter = `filterStatus=${filterStatus}&filterPreparation=${filterPreparation}&filterSearch=${filterSearch}&filterSchema=${filterSchema}&filterPTo=${filterPTo}&filterPFrom=${filterPFrom}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
      // await quadraService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setQuadra(response.response);
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

    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await quadraService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setQuadra(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao buscar quadra',
          html: `Ocorreu um erro ao buscar quadra. Tente novamente mais tarde.`,
          width: '800',
        });
      });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleStatus(data: IQuadra): Promise<void> {
    const parametersFilter = `filterStatus=${1}&cod_quadra=${
      data.cod_quadra
    }&local_preparo=${data.local.name_local_culture}`;

    await quadraService.getAll(parametersFilter).then(async ({ status }) => {
      if (status === 200 && data.status === 1) {
        Swal.fire('Foco já ativado');
        return;
      }
      await quadraService.update({
        id: data?.id,
        created_by: userLogado?.id,
        status: data.status === 0 ? 1 : 0,
      });

      handlePagination(currentPage);
    });

    // const index = quadra.findIndex(
    //   (quadraIndex) => quadraIndex.id === data?.id
    // );

    // if (index === -1) return;

    // setQuadra((oldSafra) => {
    //   const copy = [...oldSafra];
    //   copy[index].status = data.status === 0 ? 1 : 0;
    //   return copy;
    // });
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

    // await quadraService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setQuadra(response.response);
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

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (colorStar === '#eba417' ? (
        <div className="h-9 flex">
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
      ) : (
        <div className="h-9 flex">
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
      )),
    };
  }

  function actionHeaderFactory() {
    return {
      title: 'Ação',
      field: 'action',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: IQuadra) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              bgColor="bg-blue-600"
              textColor="white"
              title={`Editar ${rowData.cod_quadra}`}
              style={{
                display: !perm_can_do('/config/quadra', 'edit') ? 'none' : '',
              }}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filter);
                setCookies('filterBeforeEditTypeOrder', typeOrder);
                setCookies('filterBeforeEditOrderBy', orderBy);
                setCookies('filtersParams', filtersParams);
                setCookies('lastPage', 'atualizar');
                setCookies('urlPage', 'quadra');
                router.push(`/config/quadra/atualizar?id=${rowData.id}`);
              }}
            />
          </div>
          <div style={{ width: 5 }} />
          <ButtonToogleConfirmation
            data={rowData}
            text="a quadra"
            keyName="name"
            style={{
              display: !perm_can_do('/config/quadra', 'disable') ? 'none' : '',
            }}
            onPress={handleStatus}
          />
        </div>
      ),
    };
  }

  function columnsOrder(columnsCampos: any): any {
    const columnCampos: any = columnsCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((_, index) => {
      if (columnCampos[index] === 'cod_quadra') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Código quadra',
            title: 'cod_quadra',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'comp_p') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Comp P',
            title: 'comp_p',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'linha_p') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Linha P',
            title: 'linha_p',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'esquema') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Esquema',
            title: 'esquema',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'divisor') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Divisor',
            title: 'divisor',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'local_plantio') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Local plantio',
            title: 'local_plantio',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'local_preparo') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Local preparo',
            title: 'local.name_local_culture',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'allocation') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status Alocação',
            title: 'allocation',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div className="h-7">
                {rowData?.status == 1 ? 'Ativo' : 'Inativo'}
              </div>
            ),
          }),
        );
      }
      if (columnCampos[index] === 'action') {
        tableFields.push(actionHeaderFactory());
      }
    });
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
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id: 17,
        })
        .then((response) => {
          userLogado.preferences.quadras = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.quadras = {
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
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true&fileNumber=${1}`;

    await quadraService.getAll(filterParam).then(({ status, response }) => {
      if (status === 200) {
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, 'quadra');

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
        XLSX.writeFile(workBook, 'Quadras.xlsx');
      } else {
        Swal.fire('Não existem registros para serem exportados, favor checar.');
      }
    });
    setLoading(false);
  };

  const [idArray, setIdArray] = useState([]);

  const downloadExcelSintetico = async (): Promise<void> => {
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true&fileNumber=${2}`;

    await quadraService
      .getAll(filterParam)
      .then(({ status, response, message }) => {
        if (!response.A1) {
          Swal.fire('Nenhum dado para extrair');
          return;
        }
        if (status === 200) {
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, response, 'quadra');

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
          XLSX.writeFile(workBook, 'Sintética.xlsx');
        } else {
          Swal.fire('nenhum resultado encontrado');
        }
      });
    setLoading(false);
  };

  const dowloadExcelAnalytics = async () => {
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true&fileNumber=${3}`;

    await quadraService
      .getAll(`${filterParam}&allocation=${'IMPORTADO'}`)
      .then(({ status, response }) => {
        if (status === 200) {
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, response, 'quadra');

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
          XLSX.writeFile(workBook, 'Analítico.xlsx');
        } else {
          Swal.fire('Nenhuma quadra alocada');
        }
      });
    setLoading(false);
  };

  // manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(page: any): Promise<void> {
    // const skip = currentPage * Number(take);
    // let parametersFilter;
    // if (orderType) {
    //   parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    // } else {
    //   parametersFilter = `skip=${skip}&take=${take}`;
    // }

    // if (filter) {
    //   parametersFilter = `${parametersFilter}&${filter}&${cultureId}`;
    // }
    // await quadraService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setQuadra(response.response);
    //   }
    // });
    await callingApi(filter, page); // handle pagination globly
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
        <title>Listagem de quadras</title>
      </Head>

      <Modal
        isOpen={modalImport}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => setModalImport(false)}
        style={{ overlay: { zIndex: 1000 } }}
        overlayClassName="fixed inset-0 flex bg-transparent justify-center items-center bg-white/75"
        className="flex
          flex-col
          w-full
          h-40
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
              setModalImport(false);
            }}
          >
            <RiCloseCircleFill
              size={35}
              className="fill-red-600 hover:fill-red-800"
            />
          </button>

          <h2 className="mt-2 text-blue-600 text-xl font-medium">
            Selecione o tipo de importação:
          </h2>

          <div className="flex justify-between mt-10">
            <div className="flex flex-1 flex-col mt-2">
              <div>
                <button
                  type="button"
                  className="w-full h-8 ml-auto mt-0 bg-green-600 text-white px-8 rounded-lg text-sm hover:bg-green-800"
                  onClick={() => {
                    window.open('/listas/rd?importar=quadra', '_blank');
                    setModalImport(false);
                  }}
                >
                  Quadra
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col ml-4 mt-2">
              <div>
                <button
                  type="button"
                  className="w-full h-8 ml-auto mt-0 bg-green-600 text-white px-8 rounded-lg text-sm hover:bg-green-800"
                  onClick={() => {
                    window.open(
                      '/listas/rd?importar=alocacao_quadra',
                      '_blank',
                    );
                    setModalImport(false);
                  }}
                >
                  Alocação de Quadra
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>

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
            title="Filtrar quadras"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
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
                  <div className="h-7 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatusBeforeEdit[13]}
                      // defaultValue={checkValue('filterSearch')}
                      values={filtersStatusItem.map((id) => id)}
                      selected="1"
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Local preparo
                    </label>
                    <Input
                      type="text"
                      placeholder="Local Preparo"
                      id="filterPreparation"
                      name="filterPreparation"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Código quadra
                    </label>
                    <Input
                      type="text"
                      placeholder="Código quadra"
                      id="filterSearch"
                      name="filterSearch"
                      defaultValue={checkValue('filterSearch')}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Linha P
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterPFrom"
                        name="filterPFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterPFrom')}
                      />
                      <Input
                        type="number"
                        placeholder="Até"
                        id="filterPTo"
                        name="filterPTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterPTo')}
                      />
                    </div>
                  </div>
                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Esquema
                    </label>
                    <Input
                      type="text"
                      placeholder="Esquema"
                      id="filterSchema"
                      name="filterSchema"
                      onChange={formik.handleChange}
                      defaultValue={checkValue('filterSchema')}
                    />
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
                    <Button
                      type="submit"
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

          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={quadra}
              options={{
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 400 : 320
                }px)`,
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
                    <div className="h-12">
                      <Button
                        title="Importar"
                        value="Importar"
                        bgColor="bg-blue-600"
                        textColor="white"
                        style={{
                          display: !perm_can_do('/config/quadra', 'import')
                            ? 'none'
                            : '',
                        }}
                        onClick={() => {
                          setModalImport(true);
                        }}
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <ManageFields
                        statusAccordionExpanded={false}
                        generatesPropsDefault={generatesProps}
                        camposGerenciadosDefault={camposGerenciadosDefault}
                        preferences={preferences}
                        preferencesDefault={preferencesDefault}
                        userLogado={userLogado}
                        label="Gerenciar Campos"
                        table={table}
                        module_name={module_name}
                        module_id={module_id}
                        identifier_preference={identifier_preference}
                        OnSetStatusAccordion={(e: any) => {
                          setStatusAccordion(e);
                        }}
                        OnSetGeneratesProps={(e: any) => {
                          setGeneratesProps(e);
                        }}
                        OnSetCamposGerenciados={(e: any) => {
                          setCamposGerenciados(e);
                        }}
                        OnColumnsOrder={(e: any) => {
                          columnsOrder(e);
                        }}
                        OnSetUserLogado={(e: any) => {
                          setUserLogado(e);
                        }}
                        OnSetPreferences={(e: any) => {
                          setPreferences(e);
                        }}
                      />

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de quadras"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportação Sintética"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-yellow-500"
                          textColor="white"
                          onClick={() => {
                            downloadExcelSintetico();
                          }}
                        />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportação Analítico"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-green-600"
                          textColor="white"
                          onClick={() => {
                            dowloadExcelAnalytics();
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
                          href="quadra/importar-planilha/config-planilha"
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
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 15;

  const { token } = req.cookies;
  const cultureId: number = Number(req.cookies.cultureId);
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'quadra') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('urlPage', { req, res });
  }

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'local.name_local_culture';

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : 'filterStatus=1';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const response = await fetch(`${baseUrl}`, requestOptions);
  const { response: quadras, total: totalItems } = await response.json();

  return {
    props: {
      quadras,
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
