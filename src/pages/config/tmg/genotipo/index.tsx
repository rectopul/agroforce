/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies, setCookies } from 'cookies-next';
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
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import { tableGlobalFunctions } from 'src/helpers';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  FieldItemsPerPage,
  ManageFields,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { genotipoService, userPreferencesService } from '../../../../services';
import ITabs from '../../../../shared/utils/dropdown';
import { functionsUtils } from '../../../../shared/utils/functionsUtils';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';
import { perm_can_do } from '../../../../shared/utils/perm_can_do';

interface IFilter {
  filterGenotipo: string | any;
  filterMainName: string | any;
  filterCodTecnologia: string | any;
  filterTecnologiaDesc: string | any;
  filterCruza: string | any;
  filterGmr: string | any;
  filterGmrRangeTo: string | any;
  filterGmrRangeFrom: string | any;
  filterLotsTo: string | any;
  filterLotsFrom: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface IGenotipos {
  id: number;
  idCulture: number;
  name_genotipo: string;
  idSafra: number;
  genealogy: string;
  genotipo: string;
  cruza: string;
  cod_tec: string;
  desc: string;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allGenotipos: IGenotipos[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  idCulture: number;
  idSafra: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string;
  orderByserver: any | string;
}

export default function Listagem({
  allGenotipos,
  totalItems,
  itensPerPage,
  filterApplication,
  idCulture,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;
  const tabsDropDowns = TabsDropDowns();

  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'genotipo';
  const module_name = 'genotipo';
  const module_id = 10;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,name_genotipo,name_main,tecnologia,cruza,gmr,numberLotes,name_public,name_experiment,name_alter,elit_name,type,progenitor_f_direto,progenitor_m_direto,progenitor_f_origem,progenitor_m_origem,progenitores_origem,parentesco_completo,action';
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
  const [genotipos, setGenotipo] = useState<IGenotipos[]>(() => allGenotipos);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome genótipo',
      value: 'name_genotipo',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome principal',
      value: 'name_main',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Tecnologia',
      value: 'tecnologia',
    },
    { name: 'CamposGerenciados[]', title: 'Cruzamento origem', value: 'cruza' },
    { name: 'CamposGerenciados[]', title: 'GMR', value: 'gmr' },
    { name: 'CamposGerenciados[]', title: 'Nº Lotes', value: 'numberLotes' },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome publico',
      value: 'name_public',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome experimental',
      value: 'name_experiment',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome alternativo',
      value: 'name_alter',
    },
    { name: 'CamposGerenciados[]', title: 'Elite nome', value: 'elit_name' },
    { name: 'CamposGerenciados[]', title: 'Tipo', value: 'type' },
    {
      name: 'CamposGerenciados[]',
      title: 'Progenitor f direto',
      value: 'progenitor_f_direto',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Progenitor m direto',
      value: 'progenitor_m_direto',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Progenitor f origem',
      value: 'progenitor_f_origem',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Progenitor m origem',
      value: 'progenitor_m_origem',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Progenitores origem',
      value: 'progenitores_origem',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Parentesco',
      value: 'parentesco_completo',
    },
    { name: 'CamposGerenciados[]', title: 'Ação', value: 'action' },
  ]);

  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
    orderBy == 'Tecnologia' ? 'tecnologia.cod_tec' : orderBy
  }&typeOrder=${typeOrder}`;

  const formik = useFormik<IFilter>({
    initialValues: {
      filterGenotipo: checkValue('filterGenotipo'),
      filterMainName: checkValue('filterMainName'),
      filterCodTecnologia: checkValue('filterCodTecnologia'),
      filterTecnologiaDesc: checkValue('filterTecnologiaDesc'),
      filterCruza: checkValue('filterCruza'),
      filterGmr: checkValue('filterGmr'),
      filterGmrRangeFrom: checkValue('filterGmrRangeFrom'),
      filterGmrRangeTo: checkValue('filterGmrRangeTo'),
      filterLotsFrom: checkValue('filterLotsFrom'),
      filterLotsTo: checkValue('filterLotsTo'),
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterGenotipo,
      filterMainName,
      filterCruza,
      filterCodTecnologia,
      filterTecnologiaDesc,
      filterGmr,
      filterGmrRangeTo,
      filterGmrRangeFrom,
      filterLotsTo,
      filterLotsFrom,
    }) => {
      if (!functionsUtils?.isNumeric(filterLotsFrom)) {
        Swal.fire('O campo Lote não pode ter ponto ou vírgula.');
        return;
      }
      if (!functionsUtils?.isNumeric(filterLotsTo)) {
        Swal.fire('O campo Lote não pode ter ponto ou vírgula.');
        return;
      }

      const parametersFilter = `&filterGenotipo=${filterGenotipo}&filterMainName=${filterMainName}&filterCruza=${filterCruza}&filterCodTecnologia=${filterCodTecnologia}&filterTecnologiaDesc=${filterTecnologiaDesc}&filterGmr=${filterGmr}&filterGmrRangeFrom=${filterGmrRangeFrom}&filterGmrRangeTo=${filterGmrRangeTo}&filterLotsTo=${filterLotsTo}&filterLotsFrom=${filterLotsFrom}&id_culture=${idCulture}`;

      setFilter(parametersFilter);
      setCurrentPage(0);
      setLoading(true);
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
    }&take=${take}&orderBy=${
      orderBy == 'Tecnologia' ? 'tecnologia.cod_tec' : orderBy
    }&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await genotipoService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setGenotipo(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao buscar genótipo',
          html: `Ocorreu um erro ao buscar genótipo. Tente novamente mais tarde.`,
          width: '800',
        });
      });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  // esta functionando ordeação
  async function handleOrder(
    column: string,
    order: string | any,
    name: string | any,
  ): Promise<void> {
    setLoading(true);

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

  function tecnologiaHeaderFactory(title: string, name: string) {
    return {
      title: (
        <div className="flex items-center">
          <button
            type="button"
            className="font-medium text-gray-900"
            onClick={() => handleOrder(title, orderList, 'tecnologia')}
          >
            {title}
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

  function statusHeaderFactory() {
    return {
      title: 'Ação',
      field: 'action',
      sorting: false,
      searchable: false,
      render: (rowData: IGenotipos) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              bgColor="bg-blue-600"
              style={{ display: !perm_can_do('/config/tmg/genotipo', 'edit') ? 'none' : '' }}
              textColor="white"
              title={`Editar ${rowData.name_genotipo}`}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filter);
                setCookies('filterBeforeEditTypeOrder', typeOrder);
                setCookies('filterBeforeEditOrderBy', orderBy);
                setCookies('filtersParams', filtersParams);
                setCookies('itensPage', itensPerPage);
                setCookies('lastPage', 'atualizar');
                setCookies('takeBeforeEdit', take);
                setCookies('urlPage', 'genotipo');
                router.push(`/config/tmg/genotipo/atualizar?id=${rowData.id}`);
              }}
            />
          </div>
        </div>
      ),
    };
  }

  function formatDecimal(num: number) {
    return num ? Number(num).toFixed(1) : '';
  }

  function columnsOrder(columnsCampos: any): any {
    const columnCampos: string[] = columnsCampos.split(',');
    const tableFields: any = [];

    // camposGerenciados.map((field: any) => {
    // if (field.value === 'id') {
    // tableFields.push(idHeaderFactory())
    // } else if (field.value === 'status') {
    // tableFields.push(statusHeaderFactory())
    // } else {
    // tableFields.push(headerTableFactory(field.title, field.value));
    // }
    // })
    Object.keys(columnCampos).forEach((_, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'name_genotipo') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome genótipo',
            title: 'name_genotipo',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'name_main') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome principal',
            title: 'name_main',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'tecnologia') {
        tableFields.push(
          headerTableFactoryGlobal({
            type: 'int',
            name: 'Tecnologia',
            title: 'tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.tecnologia.cod_tec} ${rowData.tecnologia.name}`}
              </div>
            ),
          }),
        );
      }
      if (columnCampos[index] === 'cruza') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Cruzamento origem',
            title: 'cruza',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'gmr') {
        tableFields.push(
          headerTableFactoryGlobal({
            type: 'int',
            name: 'GMR',
            title: 'gmr',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => formatDecimal(rowData.gmr),
          }),
        );
      }
      if (columnCampos[index] === 'numberLotes') {
        tableFields.push(
          headerTableFactoryGlobal({
            type: 'int',
            name: 'Nº Lotes',
            title: 'numberLotes',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'name_public') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome público',
            title: 'name_public',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'name_experiment') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome experimental',
            title: 'name_experiment',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'name_alter') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome alternativo',
            title: 'name_alter',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'elit_name') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Elite nome',
            title: 'elit_name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'type') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tipo',
            title: 'type',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'progenitor_f_direto') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Progenitor f direto',
            title: 'progenitor_f_direto',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'progenitor_m_direto') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Progenitor m direto',
            title: 'progenitor_m_direto',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'progenitor_f_origem') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Progenitor f origem',
            title: 'progenitor_f_origem',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'progenitor_m_origem') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Progenitor m origem',
            title: 'progenitor_m_origem',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'progenitores_origem') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Progenitores origem',
            title: 'progenitores_origem',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'parentesco_completo') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Parentesco',
            title: 'parentesco_completo',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'action') {
        tableFields.push(statusHeaderFactory());
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
          module_id: 10,
        })
        .then((response) => {
          userLogado.preferences.genotipo = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.genotipo = {
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
    setLoading(true);

    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await genotipoService.getAll(filterParam).then(({ response, status }) => {
      if (!response.A1) {
        Swal.fire('Nenhum dado para extrair');
        return;
      }
      if (status === 200) {
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, 'Genótipos');

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
        XLSX.writeFile(workBook, 'Genótipos.xlsx');
      } else {
        Swal.fire('Não existem registros para serem exportados, favor checar.');
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
  // paginação certa
  async function handlePagination(page: any): Promise<void> {
    // manage using comman function
    // const { parametersFilter, currentPages } = await tableGlobalFunctions.handlePaginationGlobal(
    //   currentPage,
    //   take,
    //   filtersParams,
    // );

    // await genotipoService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setGenotipo(response.response);
    //     setTotalItems(response.total); // Set new total records
    //     setCurrentPage(currentPages); // Set new current page
    //     setTimeout(removestate, 5000); // Remove State
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

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-10 w-full ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          id={title}
          name={title}
          defaultValue={checkValue(title)}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  function filterFieldFactoryGmrRange(title: any, name: any) {
    return (
      <div className="h-6 w-1/2 ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="int"
              placeholder="De"
              id="filterGmrRangeFrom"
              name="filterGmrRangeFrom"
              defaultValue={checkValue('filterGmrRangeFrom')}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <Input
              type="int"
              placeholder="Até"
              id="filterGmrRangeTo"
              name="filterGmrRangeTo"
              defaultValue={checkValue('filterGmrRangeTo')}
              onChange={formik.handleChange}
            />
          </div>
        </div>
      </div>
    );
  }

  function filterLotRange(title: any, name: any) {
    return (
      <div className="h-6 w-1/2 ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="number"
              placeholder="De"
              id="filterLotsFrom"
              name="filterLotsFrom"
              defaultValue={checkValue('filterLotsFrom')}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Até"
              id="filterLotsTo"
              name="filterLotsTo"
              defaultValue={checkValue('filterLotsTo')}
              onChange={formik.handleChange}
            />
          </div>
        </div>
      </div>
    );
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem de genótipos</title>
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
            title="Filtrar genótipos"
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
                "
                >
                  {filterFieldFactory('filterGenotipo', 'Nome genótipo')}

                  {filterFieldFactory('filterMainName', 'Nome principal')}

                  {filterFieldFactory('filterCodTecnologia', 'Cod Tec')}

                  {filterFieldFactory('filterTecnologiaDesc', 'Nome Tec')}
                </div>

                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-0
                  pt-5
                "
                >
                  {filterFieldFactory('filterCruza', 'Cruzamento de Origem')}

                  {filterFieldFactoryGmrRange('filterGmrRange', 'Faixa de GMR')}
                  {filterLotRange('filterLots', 'Nº Lotes')}

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 50 }} />
                  <div className="h-7 w-32 mt-6">
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
              style={{ background: '#f9fafb', width: '100%' }}
              columns={columns}
              data={genotipos}
              options={{
                sorting: true,
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 460 : 320
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
                        style={{ display: !perm_can_do('/listas/rd', 'import') ? 'none' : '' }}
                        onClick={() => {
                          window.open('/listas/rd?importar=rd', '_blank');
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
                          title="Exportar planilha de genótipos"
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
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => { }}
                          href="genotipo/importar-planilha/config-planilha"
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
                      bgColor="bg-blue-600 rrinky123"
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
  // const PreferencesControllers = new UserPreferenceController();
  // const itensPerPage = (await req.cookies.itensPerPage
  //   ? req.cookies.itensPerPage : 10);

  const { token } = req.cookies;
  const idSafra = Number(req.cookies.safraId);
  const idCulture = Number(req.cookies.cultureId);

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'genotipo') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('filtersParams', { req, res });
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
    : '';

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'name_genotipo';

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/genotipo`;
  const urlParameters: any = new URL(baseUrl);
  // const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}&id_safra=${idSafra}`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}`;

  urlParameters.search = new URLSearchParams(param).toString();

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `&id_culture=${idCulture}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allGenotipos = [], total: totalItems = 0 } = await fetch(
    // const { response: allGenotipos, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allGenotipos,
      totalItems,
      itensPerPage,
      filterApplication,
      idCulture,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
