/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef, useEffect, useState } from 'react';
import { removeCookies, setCookies, getCookie } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { BsTrashFill } from 'react-icons/bs';
import { RiCloseCircleFill, RiFileExcel2Line } from 'react-icons/ri';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import { IGenerateProps } from '../../../interfaces/shared/generate-props.interface';

import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  ModalComponent,
  FieldItemsPerPage,
  SelectMultiple,
  ModalConfirmation,
  ManageFields,
} from '../../../components';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  experimentGroupService,
  userPreferencesService,
} from '../../../services';
import * as ITabs from '../../../shared/utils/dropdown';
import { functionsUtils } from '../../../shared/utils/functionsUtils';
import {
  IExperimentGroupFilter,
  IExperimentsGroup,
} from '../../../interfaces/listas/operacao/etiquetagem/etiquetagem.interface';
import { IReturnObject } from '../../../interfaces/shared/Import.interface';
import { tableGlobalFunctions } from '../../../helpers';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../components/Loading';
import { perm_can_do } from '../../../shared/utils/perm_can_do';

export default function Listagem({
  allExperimentGroup,
  totalItems,
  itensPerPage,
  safraId,
  filterApplication,
  pageBeforeEdit,
  filterBeforeEdit,
  idCulture,
  typeOrderServer,
  orderByserver,
  filterSelectStatusGrupoExp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsEtiquetagemMenu = tabsOperation.map((i) => (i.titleTab === 'ETIQUETAGEM'
    ? { ...i, statusTab: true }
    : { ...i, statubsTab: false }));

  const tableRef = useRef<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'ExperimentGroup';
  const module_name = 'etiquetagem';
  const module_id = 29;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,name,experimentAmount,tagsToPrint,tagsPrinted,totalTags,status,action';
  const preferencesDefault = {
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  };

  const [preferences, setPreferences] = useState<any>(
    userLogado.preferences[identifier_preference] || preferencesDefault,
  );

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [experimentGroup, setExperimentGroup] = useState<IExperimentsGroup[]>(
    () => allExperimentGroup,
  );
  const [currentPage, setCurrentPage] = useState<number>(pageBeforeEdit);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]',
      title: 'Grupo de etiquetagem',
      value: 'name',
      defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Qtde exp',
      value: 'experimentAmount',
      defaultChecked: () => camposGerenciados.includes('experimentAmount'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Etiq a imprimir',
      value: 'tagsToPrint',
      defaultChecked: () => camposGerenciados.includes('tagsToPrint'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Etiq impressas',
      value: 'tagsPrinted',
      defaultChecked: () => camposGerenciados.includes('tagsPrinted'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Total etiquetas',
      value: 'totalTags',
      defaultChecked: () => camposGerenciados.includes('totalTags'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status grupo exp',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ação',
      value: 'action',
      defaultChecked: () => camposGerenciados.includes('action'),
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    {
      name: 'StatusCheckbox',
      title: 'ETIQ. NÃO INICIADA',
      value: 'ETIQ. NÃO INICIADA',
      defaultChecked: () => camposGerenciados.includes('ETIQ. NÃO INICIADA'),
    },
    {
      name: 'StatusCheckbox',
      title: 'ETIQ. EM ANDAMENTO',
      value: 'ETIQ. EM ANDAMENTO',
      defaultChecked: () => camposGerenciados.includes('ETIQ. EM ANDAMENTO'),
    },
    {
      name: 'StatusCheckbox',
      title: 'ETIQ. FINALIZADA',
      value: 'ETIQ. FINALIZADA',
      defaultChecked: () => camposGerenciados.includes('ETIQ. FINALIZADA'),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>(
    filterSelectStatusGrupoExp,
  );

  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  // const take: number = itensPerPage;
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  // const [orderBy, setOrderBy] = useState<string>(orderByserver);
  // const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);
  const [orderBy, setOrderBy] = useState<string>('');
  const [fieldOrder, setFieldOrder] = useState<any>('');

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);
  const [itemSelectedDelete, setItemSelectedDelete] = useState<any>(null);

  // const pathExtra = `skip=${currentPage * Number(take)}&take=${take}`;

  const formik = useFormik<any>({
    initialValues: {
      filterExperimentGroup: checkValue('filterExperimentGroup'),
      filterStatus: checkValue('filterStatus'),
      filterQtdExpFrom: checkValue('filterQtdExpFrom'),
      filterQtdExpTo: checkValue('filterQtdExpTo'),
      filterTotalEtiqImprimirFrom: checkValue('filterTotalEtiqImprimirFrom'),
      filterTotalEtiqImprimirTo: checkValue('filterTotalEtiqImprimirTo'),
      filterTotalEtiqImpressasFrom: checkValue('filterTotalEtiqImpressasFrom'),
      filterTotalEtiqImpressasTo: checkValue('filterTotalEtiqImpressasTo'),
      filterTotalEtiqFrom: checkValue('filterTotalEtiqFrom'),
      filterTotalEtiqTo: checkValue('filterTotalEtiqTo'),
    },
    onSubmit: async ({
      filterExperimentGroup,
      filterQtdExpTo,
      filterQtdExpFrom,
      filterTotalEtiqImprimirTo,
      filterTotalEtiqImprimirFrom,
      filterTotalEtiqImpressasTo,
      filterTotalEtiqImpressasFrom,
      filterTotalEtiqTo,
      filterTotalEtiqFrom,
      // filterStatus,
    }) => {
      const filterStatus = statusFilterSelected?.join(',');

      const parametersFilter = `&filterExperimentGroup=${filterExperimentGroup}&filterQtdExpTo=${filterQtdExpTo}&filterQtdExpFrom=${filterQtdExpFrom}&filterTotalEtiqImprimirTo=${filterTotalEtiqImprimirTo}&filterTotalEtiqImprimirFrom=${filterTotalEtiqImprimirFrom}&filterTotalEtiqImpressasTo=${filterTotalEtiqImpressasTo}&filterTotalEtiqImpressasFrom=${filterTotalEtiqImpressasFrom}&filterTotalEtiqTo=${filterTotalEtiqTo}&filterTotalEtiqFrom=${filterTotalEtiqFrom}&filterStatus=${filterStatus}&safraId=${safraId}&id_culture=${idCulture}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEditOperation', filtersParams);
      // await experimentGroupService
      //   .getAll(`${parametersFilter}`)
      //   .then(({ response, total: allTotal }) => {
      //     setFilter(parametersFilter);
      //     setExperimentGroup(response);
      //     setTotalItems(allTotal);
      //     setCurrentPage(0);
      //     tableRef.current.dataManager.changePageSize(allTotal >= take ? take : allTotal);
      //   });

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    if (statusFilterSelected?.length > 0) {
      parametersFilter = `${parametersFilter}&filterStatus=${statusFilterSelected?.join(
        ',',
      )}`;
    }

    setCookies('filterBeforeEditOperation', parametersFilter);
    setCookies('filterBeforeEditTypeOrderOperation', typeOrder);
    setCookies('filterBeforeEditOrderByOperation', orderBy);

    // parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    // setCookies("filtersParams", parametersFilter);

    setCookies('filtersParamsOperation', parametersFilter);

    try {
      await experimentGroupService
        .getAll(parametersFilter)
        .then((response) => {
          if (response.status === 200 || response.status === 400) {
            setExperimentGroup(response.response);
            setTotalItems(response.total);
            tableRef?.current?.dataManager?.changePageSize(
              response.total >= take ? take : response.total,
            );
          }
        });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: 'Falha ao buscar grupo de experimento',
        html: `Ocorreu um erro ao buscar grupo de experimento. Tente novamente mais tarde.`,
        width: '800',
      });
    }
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  useEffect(() => {
    setCookies('filtersParams-test-rr', filtersParams);
  }, [filtersParams]);

  async function handleOrder(
    column: string,
    order: number,
    name: any,
  ): Promise<void> {
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

  async function deleteConfirmItem(item: any) {
    setItemSelectedDelete(item);
    setIsOpenModalConfirm(true);
  }

  async function deleteItem() {
    setLoading(true);
    setIsOpenModalConfirm(false);

    const { status, message } = await experimentGroupService.deleted(
      {
        id: itemSelectedDelete?.id,
        userId: userLogado.id,
      },
    );
    if (status === 200) {
      // router.reload();
      handlePagination(currentPage);
      // handleTotalPages();
      setLoading(false);
    } else {
      Swal.fire({
        html: message,
        width: '800',
      });
      setLoading(false);
    }
  }

  // function headerTableFactory(name: string, title: string) {
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

  function actionTableFactory() {
    return {
      title: <div className="flex items-center">Ação</div>,
      field: 'action',
      sorting: false,
      width: 0,
      render: (rowData: any) => (
        <div className="flex gap-2">
          <div className="h-10 w-10">
            <Button
              title={`Editar ${rowData.name}`}
              type="button"
              style={{ display: !perm_can_do('/operacao/etiquetagem', 'edit') ? 'none' : '' }}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filter);
                setCookies('filterBeforeEditTypeOrder', typeOrder);
                setCookies('filterBeforeEditOrderBy', orderBy);
                setCookies('filtersParams', filtersParams);
                setCookies('takeBeforeEdit', take);
                setCookies('lastPage', 'atualizar');
                setCookies('urlPage', 'experimentGroup');
                setCookies('filterSelectStatusGrupoExp', statusFilterSelected);
                router.push(`/operacao/etiquetagem/atualizar?id=${rowData.id}`);
              }}
              rounder="rounded-full"
              bgColor="bg-blue-600"
              textColor="white"
              icon={<BiEdit size={20} />}
            />
          </div>
          <div className="h-10 w-10">
            <Button
              title=""
              type="button"
              style={{ display: !perm_can_do('/operacao/etiquetagem', 'print') ? 'none' : '' }}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filter);
                setCookies('filterBeforeEditTypeOrder', typeOrder);
                setCookies('filterBeforeEditOrderBy', orderBy);
                setCookies('filtersParams', filtersParams);
                setCookies('takeBeforeEdit', take);
                setCookies('lastPage', 'atualizar');
                setCookies('urlPage', 'experimentGroup');
                setCookies('filterSelectStatusGrupoExp', statusFilterSelected);
                router.push(`/operacao/etiquetagem/parcelas?id=${rowData.id}`);
              }}
              rounder="rounded-full"
              bgColor="bg-blue-600"
              textColor="white"
              icon={<AiOutlinePrinter size={20} />}
            />
          </div>
          <div className="h-10 w-10">
            <Button
              disabled={
                rowData.status === 'ETIQ. EM ANDAMENTO'
                || rowData.status === 'ETIQ. FINALIZADA'
              }
              title={`Excluir ${rowData.name}`}
              type="button"
              style={{ display: !perm_can_do('/operacao/etiquetagem', 'delete') ? 'none' : '' }}
              onClick={() => {
                deleteConfirmItem(rowData);
              }}
              rounder="rounded-full"
              bgColor={
                rowData.status === 'ETIQ. EM ANDAMENTO'
                || rowData.status === 'ETIQ. FINALIZADA'
                  ? 'bg-gray-600'
                  : 'bg-red-600'
              }
              textColor="white"
              icon={<BsTrashFill size={20} />}
            />
          </div>
        </div>
      ),
    };
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item: any) => {
      if (columnOrder[item] === 'name') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Grupo de etiquetagem',
            title: 'name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'experimentAmount') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Qtde exp',
            title: 'experimentAmount',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'tagsToPrint') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Etiq a imprimir',
            title: 'tagsToPrint',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'tagsPrinted') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Etiq impressas',
            title: 'tagsPrinted',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'totalTags') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Total etiquetas',
            title: 'totalTags',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status grupo exp',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'action') {
        tableFields.push(actionTableFactory());
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
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id: 29,
        })
        .then((response) => {
          userLogado.preferences.etiquetagem = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.etiquetagem = {
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
    await experimentGroupService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        response.map((item: any) => {
          const newItem = item;

          newItem.CULTURA = item.safra.culture.name;
          newItem.SAFRA = item.safra.safraName;
          newItem.GRUPO_DE_ETIQUETAGEM = item.name;
          newItem.QTDE_EXP = item.experimentAmount;
          newItem.ETIQ_A_IMPRIMIR = item.tagsToPrint;
          newItem.ETIQ_IMPRESSAS = item.tagsPrinted;
          newItem.TOTAL_ETIQUETAS = item.totalTags;
          newItem.STATUS_GRUPO_EXP = item.status;
          newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

          delete newItem.id;
          delete newItem.safraId;
          delete newItem.safra;
          delete newItem.name;
          delete newItem.experimentAmount;
          delete newItem.tagsToPrint;
          delete newItem.tagsPrinted;
          delete newItem.totalTags;
          delete newItem.status;
          delete newItem.experiment;
          delete newItem.created_at;
          delete newItem.updated_at;
          delete newItem.createdBy;
          return newItem;
        });
        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workBook,
          workSheet,
          'Listagem-grupo-de-etiquetagem',
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
        XLSX.writeFile(workBook, 'Listagem grupo de etiquetagem.xlsx');
      } else {
        setLoading(false);
        Swal.fire('Nenhum dado para extrair');
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
    //   parametersFilter = `${parametersFilter}&${filter}`;
    // }
    // await experimentGroupService
    //   .getAll(parametersFilter)
    //   .then(({ status, response }) => {
    //     if (status === 200) {
    //       setExperimentGroup(response);
    //     }
    //   });
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

  function filterFieldFactory(
    title: string,
    name: string,
    small: boolean = false,
  ) {
    return (
      <div className={small ? 'h-7 w-1/3 ml-2' : 'h-7 w-1/2 ml-2'}>
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          id={title}
          defaultValue={checkValue(title)}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    const inputValue: any = (
      document.getElementById('inputName') as HTMLInputElement
    )?.value;
    const { response }: IReturnObject = await experimentGroupService.getAll({
      filterExperimentGroup: inputValue,
      safraId,
    });
    if (response?.length > 0) {
      Swal.fire('Grupo já cadastrado');
    } else {
      try {
        const {
          response: newGroup,
        }: IReturnObject = await experimentGroupService.create({
          name: inputValue?.trim(),
          safraId: Number(safraId),
          createdBy: userLogado.id,
        });
        router.push(`/operacao/etiquetagem/atualizar?id=${newGroup.id}`);
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao criar grupo de experimento',
          html: `Ocorreu um erro ao criar grupo de experimento. Tente novamente mais tarde.`,
          width: '800',
        });
      }
    }
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de Grupo de etiquetagem</title>
      </Head>

      {loading && <ComponentLoading text="" />}

      <ModalConfirmation
        isOpen={isOpenModalConfirm}
        text={`Tem certeza que deseja deletar o item ${itemSelectedDelete?.name}?`}
        onPress={deleteItem}
        onCancel={() => setIsOpenModalConfirm(false)}
      />

      <ModalComponent
        isOpen={isOpenModal}
        onPress={(e: any) => handleSubmit(e)}
        onCancel={() => setIsOpenModal(false)}
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col px-4  justify-between">
            <header className="flex flex-col mt-2">
              <h2 className="mb-2 text-blue-600 text-xl font-medium">
                Cadastrar grupo de etiquetagem
              </h2>
            </header>
            <h2 style={{ marginTop: 25, marginBottom: 5 }}>
              Nome do grupo de etiquetagem
            </h2>
            <Input
              type="text"
              placeholder="Nome do grupo de etiquetagem"
              id="inputName"
              name="inputName"
            />
          </div>
        </form>
      </ModalComponent>

      <Content contentHeader={tabsEtiquetagemMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >
          <AccordionFilter
            title="Filtrar grupos"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-1
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
                  {filterFieldFactory(
                    'filterExperimentGroup',
                    'Grupo de etiquetagem',
                  )}

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Qtde exp
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterQtdExpFrom"
                        name="filterQtdExpFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterQtdExpFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterQtdExpTo"
                        name="filterQtdExpTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterQtdExpTo')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Etiq a imprimir
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterTotalEtiqImprimirFrom"
                        name="filterTotalEtiqImprimirFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterTotalEtiqImprimirFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterTotalEtiqImprimirTo"
                        name="filterTotalEtiqImprimirTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterTotalEtiqImprimirTo')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Etiq impressas
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterTotalEtiqImpressasFrom"
                        name="filterTotalEtiqImpressasFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue(
                          'filterTotalEtiqImpressasFrom',
                        )}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterTotalEtiqImpressasTo"
                        name="filterTotalEtiqImpressasTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterTotalEtiqImpressasTo')}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Total etiquetas
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterTotalEtiqFrom"
                        name="filterTotalEtiqFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterTotalEtiqFrom')}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterTotalEtiqTo"
                        name="filterTotalEtiqTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue('filterTotalEtiqTo')}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status grupo exp
                    </label>
                    <SelectMultiple
                      data={statusFilter.map((i: any) => i.title)}
                      values={statusFilterSelected}
                      onChange={(e: any) => setStatusFilterSelected(e)}
                    />
                  </div>

                  {/* <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status grupo exp.
                    </label> */}
                  {/* <AccordionFilter>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {(provided) => (
                            <ul
                              className="w-full h-full characters"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {statusFilter.map((generate, index) => (
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
                              ))}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </AccordionFilter> */}
                  {/* </div> */}

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      onClick={() => {
                        setLoading(true);
                      }}
                      value="Filtrar"
                      type="submit"
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
              data={experimentGroup}
              options={{
                selectionProps: (rowData: any) => isOpenModal && { disabled: rowData },
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
              onChangeRowsPerPage={() => {}}
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
                    <div className="h-12 w-44 ml-0">
                      <Button
                        title="Criar novo grupo"
                        value="Criar novo grupo"
                        textColor="white"
                        style={{ display: !perm_can_do('/operacao/etiquetagem', 'create') ? 'none' : '' }}
                        onClick={() => {
                          setIsOpenModal(!isOpenModal);
                        }}
                        bgColor="bg-blue-600"
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
                          orderColumns(e);
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
                          title="Exportar planilha de grupos"
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
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/experiment-group`;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'experimentGroup') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('filtersParams', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('itensPage', { req, res });
    removeCookies('filterSelectStatusGrupoExp', { req, res });
  }

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'asc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const filterApplication = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `&id_culture=${idCulture}&safraId=${idSafra}`;
  // //RR

  const filterSelectStatusGrupoExp = req.cookies.filterSelectStatusGrupoExp
    ? JSON?.parse(req.cookies.filterSelectStatusGrupoExp)
    : [];

  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('lastPage', { req, res });
  removeCookies('filterSelectStatusGrupoExp', { req, res });

  const param = `skip=0&take=${itensPerPage}&safraId=${idSafra}&id_culture=${idCulture}`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;
  const {
    response: allExperimentGroup = [],
    total: totalItems = 0,
  } = await fetch(urlParameters.toString(), requestOptions).then((response) => response.json());

  const safraId = idSafra;

  return {
    props: {
      allExperimentGroup,
      totalItems,
      safraId,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      idCulture,
      orderByserver,
      typeOrderServer,
      filterSelectStatusGrupoExp,
    },
  };
};
