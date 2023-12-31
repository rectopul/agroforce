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
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { removeCookies, setCookies } from 'cookies-next';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { BsTrashFill } from 'react-icons/bs';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  experimentService,
  npeService,
  userPreferencesService,
} from '../../../services';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ButtonDeleteConfirmation,
} from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';
import { functionsUtils } from '../../../shared/utils/functionsUtils';
import { tableGlobalFunctions } from '../../../helpers';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../components/Loading';

interface INpeProps {
  id: any;
  local: any;
  safra: any;
  foco: any;
  type_assay: any;
  ogm: any;
  epoca: any;
  npei: any;
  npef: any;
  prox_npe: any;
  status?: any;
  created_by: any;
  edited?: any;
}

interface IFilter {
  filterStatus: object | any;
  filterLocal: string | any;
  filterSafra: string | any;
  filterFoco: string | any;
  filterEnsaio: string | any;
  filterTecnologia: string | any;
  filterCodTecnologia: string | any;
  filterEpoca: string | any;
  filterNPE: string | any;
  filterNpeFrom: string | any;
  filterNpeTo: string | any;
  filterNpeFinalFrom: string | any;
  filterNpeFinalTo: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allNpe: any;
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  filterBeforeEdit: object | any;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
  safraId: any | number;
  idCulture: any | number;
}

export default function Listagem({
      allNpe,
      itensPerPage,
      filterApplication,
      filterBeforeEdit,
      totalItems,
      typeOrderServer,
      orderByserver,
      safraId,
      idCulture,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const { TabsDropDowns } = ITabs.default;

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns();
  const router = useRouter();

  // eslint-disable-next-line no-return-assign, no-param-reassign
  tabsDropDowns.map((tab) => (tab.titleTab === 'AMBIENTE'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.npe || {
    id: 0,
    table_preferences:
      'id,safra,foco,ensaio,tecnologia,local,npei,epoca,prox_npe,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [npe, setNPE] = useState(allNpe);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(typeOrderServer == 'desc' ? 1 : 2);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito ',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: 'CamposGerenciados[]',
      title: 'Safra ',
      value: 'safra',
      defaultChecked: () => camposGerenciados.includes('safra'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Foco ',
      value: 'foco',
      defaultChecked: () => camposGerenciados.includes('foco'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ensaio ',
      value: 'ensaio',
      defaultChecked: () => camposGerenciados.includes('ensaio'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Tecnologia',
      value: 'tecnologia',
      defaultChecked: () => camposGerenciados.includes('tecnologia'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Lugar cultura',
      value: 'local',
      defaultChecked: () => camposGerenciados.includes('local'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Época ',
      value: 'epoca',
      defaultChecked: () => camposGerenciados.includes('epoca'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NPE Inicial ',
      value: 'npei',
      defaultChecked: () => camposGerenciados.includes('npei'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Prox NPE ',
      value: 'prox_npe',
      defaultChecked: () => camposGerenciados.includes('prox_npe'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ação',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
  ]);

  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [filtersParams, setFiltersParams] = useState<any>(filterBeforeEdit); // Set filter Parameter
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${orderBy == 'Tecnologia' ? 'tecnologia.cod_tec' : orderBy
    }&typeOrder=${typeOrder}`;

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterApplication.split('');

  const formik = useFormik<any>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterLocal: checkValue('filterLocal'),
      filterSafra: checkValue('filterSafra'),
      filterFoco: checkValue('filterFoco'),
      filterEnsaio: checkValue('filterEnsaio'),
      filterTecnologia: checkValue('filterTecnologia'),
      filterCodTecnologia: checkValue('filterCodTecnologia'),
      filterEpoca: checkValue('filterEpoca'),
      filterNPE: checkValue('filterNPE'),
      filterNpeTo: checkValue('filterNpeTo'),
      filterNpeFrom: checkValue('filterNpeFrom'),
      filterNpeFinalTo: checkValue('filterNpeFrom'),
      filterNpeFinalFrom: checkValue('filterNpeFrom'),
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterLocal,
      filterSafra,
      filterFoco,
      filterEnsaio,
      filterTecnologia,
      filterCodTecnologia,
      filterEpoca,
      filterNPE,
      filterNpeTo,
      filterNpeFrom,
      filterNpeFinalTo,
      filterNpeFinalFrom,
    }) => {
      if (!functionsUtils?.isNumeric(filterNpeFrom)) {
        return Swal.fire('O campo NPE Inicial não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNpeTo)) {
        return Swal.fire('O campo NPE Inicial não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNpeFinalFrom)) {
        return Swal.fire('O campo Prox NPE não pode ter ponto ou vírgula.');
      }
      if (!functionsUtils?.isNumeric(filterNpeFinalTo)) {
        return Swal.fire('O campo Prox NPE não pode ter ponto ou vírgula.');
      }

      // &filterSafra=${filterSafra}
      const parametersFilter = `filterStatus=${filterStatus || 1
        }&filterSafra=${filterSafra}&filterNpeTo=${filterNpeTo}&filterCodTecnologia=${filterCodTecnologia}&filterNpeFrom=${filterNpeFrom}&filterLocal=${filterLocal}&filterFoco=${filterFoco}&filterEnsaio=${filterEnsaio}&filterTecnologia=${filterTecnologia}&filterEpoca=${filterEpoca}&filterNPE=${filterNPE}&id_culture=${idCulture}&filterNpeFinalTo=${filterNpeFinalTo}&filterNpeFinalFrom=${filterNpeFinalFrom}&id_safra=${safraId}`;
      // &id_safra=${safraId}
      // await npeService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setNPE(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });
      setFilter(parametersFilter);
      setCurrentPage(0);
      setLoading(true);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any) {
    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await npeService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setNPE(response.response);
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

  async function deleteItem(data: any) {
    setLoading(true);

    const { status, message } = await npeService.deleted({
      id: data?.id,
      userId: userLogado.id,
    });
    if (status === 200) {
      // router.reload();
      handlePagination();
      setLoading(false);
    } else {
      Swal.fire({
        html: message,
        width: '800',
      });
    }
  }

  function statusHeaderFactory() {
    return {
      title: 'Ação',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: INpeProps) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              bgColor={rowData.edited === 1 ? 'bg-blue-900' : 'bg-blue-600'}
              textColor="white"
              title="Editar"
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filter);
                setCookies('filterBeforeEditTypeOrder', typeOrder);
                setCookies('filterBeforeEditOrderBy', orderBy);
                setCookies('filtersParams', filtersParams);
                setCookies('lastPage', 'atualizar');
                setCookies('itensPage', itensPerPage);
                setCookies('takeBeforeEdit', take);
                router.push(`/config/ambiente/atualizar?id=${rowData.id}`);
              }}
            />
          </div>
          <div style={{ width: 5 }} />
          <ButtonDeleteConfirmation
            data={rowData}
            keyName={rowData?.local?.name_local_culture}
            onPress={deleteItem}
            disabled={rowData.status === 3}
          />
          {/* {rowData.status === 1 || rowData.status === 3 ? (
            <div>
              <Button
                title={rowData.status === 3 ? '' : 'Ativo'}
                icon={<BsTrashFill size={14} />}
                onClick={() => deleteItem(rowData.id)}
                bgColor={rowData.status === 3 ? 'bg-gray-400' : 'bg-red-600'}
                textColor="white"
                disabled={rowData.status === 3}
              />
            </div>
          ) : (
            <div className="h-7 flex">
              <div className="h-7" />
              <div>
                <Button
                  title="Inativo"
                  icon={<BsTrashFill size={14} />}
                  onClick={async () => deleteItem(rowData.id)}
                  bgColor="bg-red-800"
                  textColor="white"
                />
              </div>
            </div>
          )} */}
        </div>
      ),
    };
  }

  // function tecnologiaHeaderFactory(title: string, name: string) {
  //   return {
  //     title: (
  //       <div className="flex items-center">
  //         <button
  //           type="button"
  //           className="font-medium text-gray-900"
  //           onClick={() => handleOrder(title, orderList)}
  //         >
  //           {title}
  //         </button>
  //       </div>
  //     ),
  //     field: "tecnologia",
  //     width: 0,
  //     sorting: true,
  //     render: (rowData: any) => (
  //       <div className="h-10 flex">
  //         <div>
  //           {`${rowData.tecnologia.cod_tec} ${rowData.tecnologia.name}`}
  //         </div>
  //       </div>
  //     ),
  //   };
  // }

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item: any) => {
      // if (columnCampos[item] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[item] === 'local') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Lugar cultura',
            title: 'local.name_local_culture',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'safra') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Safra',
            title: 'safra.safraName',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'foco') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Foco',
            title: 'foco.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'ensaio') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Ensaio',
            title: 'type_assay.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      // if (columnCampos[item] === 'tecnologia') {
      //   tableFields.push(headerTableFactory('Nome tec.', 'tecnologia.name'));
      // }
      if (columnCampos[item] === 'tecnologia') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tecnologia',
            title: 'tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData?.tecnologia?.cod_tec} ${rowData?.tecnologia?.name}`}
              </div>
            ),
          }),
        );
      }
      if (columnCampos[item] === 'epoca') {
        tableFields.push(
          headerTableFactoryGlobal({
            type: 'int',
            name: 'Época',
            title: 'epoca',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'npei') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NPE Inicial',
            title: 'npei',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'prox_npe') {
        tableFields.push(
          headerTableFactoryGlobal({
            type: 'int',
            name: 'Prox NPE',
            title: 'prox_npe',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'group') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Grupo',
            title: 'group.group',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[item] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = colums(camposGerenciados);

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

    // await npeService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setNPE(response.response);
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
    typeOrderG !== '' ? typeOrderG == 'desc' ? setOrder(1) : setOrder(2) : '';
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
          module_id: 14,
        })
        .then((response) => {
          userLogado.preferences.npe = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.npe = {
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

  async function handleStatus(idNPE: number, data: any): Promise<void> {
    const parametersFilter = `filterStatus=${1}&safraId=${data.safraId
      }&id_foco=${data.id_foco}&id_ogm=${data.id_ogm}&id_type_assay=${data.id_type_assay
      }&epoca=${String(data.epoca)}`;
    if (data.status == 0) {
      await npeService.getAll(parametersFilter).then((response) => {
        if (response.total > 0) {
          Swal.fire(
            'NPE não pode ser atualizada pois já existe uma npei cadastrada com essas informações',
          );
          router.push('');
        }
      });
    } else {
      if (data.status === 0) {
        data.status = 1;
      } else {
        data.status = 0;
      }
      await npeService.update({ id: idNPE, status: data.status });

      const index = npe.findIndex((npe: any) => npe.id === idNPE);

      if (index === -1) {
        return;
      }

      setNPE((oldSafra: any) => {
        const copy = [...oldSafra];
        copy[index].status = data.status;
        return copy;
      });
    }
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
    await npeService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((row: any) => {
          delete row.avatar;
          if (row.status === 0) {
            row.status = 'Inativo';
          } else {
            row.status = 'Ativo';
          }

          row.CULTURA = row.safra?.culture?.name;
          row.SAFRA = row.safra?.safraName;
          row.FOCO = row.foco?.name;
          row.TIPO_ENSAIO = row.type_assay?.name;
          row.TECNOLOGIA = `${row.tecnologia?.cod_tec} ${row.tecnologia?.name}`;
          row.LOCAL = row.local?.name_local_culture;
          row.NPEI = row.npei;
          row.ÉPOCA = row?.epoca;
          row.GRUPO = row.group.group;

          delete row.nextAvailableNPE;
          delete row.prox_npe;

          delete row.edited;
          delete row.local;
          delete row.safra;
          delete row.foco;
          delete row.epoca;
          delete row.tecnologia;
          delete row.type_assay;
          delete row.group;
          delete row.npei;
          delete row.npei_i;
          delete row.status;
          delete row.nextNPE;
          delete row.npeQT;
          delete row.localId;
          delete row.safraId;
          delete row.npef;
          delete row.id;
          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'npe');

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
        XLSX.writeFile(workBook, 'NPE.xlsx');
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

  async function handlePagination(): Promise<void> {
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
    // await npeService.getAll(parametersFilter).then(({ status, response }) => {
    //   if (status === 200) {
    //     setNPE(response);
    //   }
    // });

    await callingApi(filter); // handle pagination globly
  }

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-4 w-1/4 ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          defaultValue={checkValue(title)}
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
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
        <title>Listagem dos Ambientes</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar ambientes">
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-0
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div className="w-full h-full flex justify-center pb-0">
                  {/* <div className="h-6 w-1/4 ml-0">
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
                  </div> */}

                  {filterFieldFactory('filterFoco', 'Foco')}

                  {filterFieldFactory('filterEnsaio', 'Ensaio')}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Cod Tec
                    </label>
                    <div className="flex">
                      <Input
                        size={7}
                        placeholder="Cod Tec"
                        id="filterCodTecnologia"
                        name="filterCodTecnologia"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  {filterFieldFactory('filterTecnologia', 'Nome Tec')}

                  {filterFieldFactory('filterLocal', 'Lugar cultura')}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Época
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="Época"
                        id="filterEpoca"
                        name="filterEpoca"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NPE Inicial
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        type="number"
                        id="filterNpeFrom"
                        name="filterNpeFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterNpeFrom')}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        type="number"
                        id="filterNpeTo"
                        name="filterNpeTo"
                        defaultValue={checkValue('filterNpeTo')}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Prox NPE
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        type="number"
                        id="filterNpeFinalFrom"
                        name="filterNpeFinalFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        type="number"
                        id="filterNpeFinalTo"
                        name="filterNpeFinalTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
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
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={npe}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 0,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
              }}
              components={{
                Toolbar: () => (
                  <div
                    className="w-full max-h-max
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
                        href="npe/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div> */}

                    <div />
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
                        <Button
                          title="Exportar planilha de NPE"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                        {/* <div style={{ width: 20 }} /> */}
                        {/* <Button
                          title="Configurar Importação de Planilha"
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {}}
                          href="npe/importar-planilha/config-planilha"
                        /> */}
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
}: any) => {
  const { safraId } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const { token } = req.cookies;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('urlPage', { req, res });
    removeCookies('itensPage', { req, res });
  }

  // RR

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : '';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `filterStatus=1&id_culture=${idCulture}&id_safra=${safraId}`;

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/npe`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1&id_culture=${idCulture}&id_safra=${safraId}`;
  // id_culture=${idCulture}&id_safra=${safraId}

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });
  removeCookies('urlPage', { req, res });

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}&id_safra=${safraId}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allNpe = [], total: totalItems = 0 } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allNpe,
      totalItems,
      itensPerPage,
      filterApplication,
      filterBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
      safraId,
      idCulture,
    },
  };
};
