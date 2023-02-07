/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef } from 'react';
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { BsTrashFill } from 'react-icons/bs';
import { RiFileExcel2Line, RiOrganizationChart } from 'react-icons/ri';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { IoMdArrowBack } from 'react-icons/io';
import moment from 'moment';
import { ITreatmentGrid } from '../../../interfaces/listas/ensaio/genotype-treatment.interface';
import { IGenerateProps } from '../../../interfaces/shared/generate-props.interface';

import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  ModalConfirmation,
} from '../../../components';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  userPreferencesService,
  experimentGroupService,
  experimentService,
} from '../../../services';
import * as ITabs from '../../../shared/utils/dropdown';
import { IExperiments } from '../../../interfaces/listas/experimento/experimento.interface';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../components/Loading';
import { tableGlobalFunctions } from '../../../helpers';

export default function Listagem({
  experimentGroup,
  experimentGroupId,
  itensPerPage,
  filterApplication,
  filterBeforeEdit,
  orderByserver,
  typeOrderServer,
  safraId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsEtiquetagemMenu = tabsOperation.map((i: any) => (i.titleTab === 'ETIQUETAGEM' ? { ...i, statusTab: true } : i));

  const tableRef = useRef<any>(null);
  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.experimento || {
    id: 0,
    table_preferences:
      'id,foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,status,action',
  };

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [experiments, setExperiments] = useState<IExperiments[] | any>([]);
  const [tableMessage, setMessage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [experimentAdd, setExperimentAdd] = useState<boolean>();

  const [take, setTake] = useState<number>(itensPerPage);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [itemsTotal, setTotalItems] = useState<number>(0);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Foco', value: 'foco' },
    { name: 'CamposGerenciados[]', title: 'Ensaio', value: 'type_assay' },
    { name: 'CamposGerenciados[]', title: 'GLI', value: 'gli' },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome experimento',
      value: 'experimentName',
    },
    { name: 'CamposGerenciados[]', title: 'Tecnologia', value: 'tecnologia' },
    { name: 'CamposGerenciados[]', title: 'Época', value: 'period' },
    {
      name: 'CamposGerenciados[]',
      title: 'Delineamento',
      value: 'delineamento',
    },
    { name: 'CamposGerenciados[]', title: 'Rep', value: 'repetitionsNumber' },
    { name: 'CamposGerenciados[]', title: 'Status EXP', value: 'status' },
    { name: 'CamposGerenciados[]', title: 'Ação', value: 'action' },
  ]);
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  // const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
  //   orderBy == "tecnologia" ? "assay_list.tecnologia.cod_tec" : orderBy
  // }&typeOrder=${typeOrder}`;

  const router = useRouter();
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  // const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [selectedCheckBox, setSelectedCheckBox] = useState([]);

  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState<boolean>(false);
  const [itemSelectedDelete, setItemSelectedDelete] = useState<any>(null);

  const formik = useFormik<any>({
    initialValues: {
      id: experimentGroup?.id,
      name: experimentGroup?.name,
    },
    onSubmit: async (values) => {
      await experimentGroupService
        .update({
          id: values.id,
          name: values.name,
          safraId,
        })
        .then(({ status, message }) => {
          if (status === 200) {
            Swal.fire('Grupo de experimento atualizado com sucesso!');
            router.back();
          } else {
            setLoading(false);
            Swal.fire(message);
          }
        });
    },
  });

  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    setFilter(parametersFilter);
    // setCookies('filterBeforeEdit', parametersFilter);
    // setCookies('filterBeforeEditTypeOrder', typeOrder);
    // setCookies('filterBeforeEditOrderBy', orderBy);

    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${
      orderBy == 'tecnologia' ? 'assay_list.tecnologia.cod_tec' : orderBy
    }&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    // setCookies('filtersParams', parametersFilter);

    await experimentService
      .getAll(parametersFilter)
      .then((response: any) => {
        if (response.status === 200 || response.status === 400) {
          setExperiments(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
        setLoading(false);
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
    setLoading(true);
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
              disabled={
                rowData.status === 'ETIQ. EM ANDAMENTO'
                || rowData.status === 'ETIQ. FINALIZADA'
              }
              title={`Excluir ${rowData.experimentName}`}
              type="button"
              onClick={() => {
                deleteConfirmItem(rowData, false);
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
    Object.keys(columnOrder).forEach((_, index) => {
      if (columnOrder[index] === 'foco') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Foco',
            title: 'assay_list.foco.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'type_assay') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Ensaio',
            title: 'assay_list.type_assay.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'gli') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GLI',
            title: 'assay_list.gli',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'tecnologia') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tecnologia',
            title: 'assay_list.tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData?.assay_list?.tecnologia?.cod_tec} ${rowData?.assay_list?.tecnologia?.name}`}
              </div>
            ),
          }),
        );
      }
      if (columnOrder[index] === 'experimentName') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome experimento',
            title: 'experimentName',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'period') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Época',
            title: 'period',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'delineamento') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Delineamento',
            title: 'delineamento.name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'repetitionsNumber') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Rep',
            title: 'repetitionsNumber',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status EXP',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[index] === 'action') {
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
          module_id: 22,
        })
        .then((response) => {
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
    await experimentService
      .getAll(`${filter}&excel=${true}`)
      .then(({ status, response }: any) => {
        if (status === 200) {
          response.map((item: any) => {
            const newItem = item;
            newItem.CULTURA = item.assay_list?.safra?.culture?.name;
            newItem.SAFRA = item.assay_list?.safra?.safraName;
            newItem.FOCO = item.assay_list?.foco.name;
            newItem.ENSAIO = item.assay_list?.type_assay.name;
            newItem.GLI = item.assay_list?.gli;
            newItem.NOME_DO_EXPERIMENTO = item?.experimentName;
            newItem.TECNOLOGIA = `${item.assay_list?.tecnologia.cod_tec} ${item.assay_list?.tecnologia.name}`;
            newItem.ÉPOCA = item?.period;
            newItem.DELINEAMENTO = item.delineamento?.name;
            newItem.REP = item.repetitionsNumber;
            newItem.STATUS_EXP = item.status;
            newItem.BGM = item.assay_list?.bgm;
            newItem.STATUS_ENSAIO = item.assay_list?.status;
            newItem.LUGAR_PLANTIO = newItem.local?.name_local_culture;
            newItem.DENSIDADE = item?.density;
            newItem.ORDEM_SORTEIO = item?.orderDraw;
            newItem.NLP = item?.nlp;
            newItem.CLP = item?.clp;
            newItem.OBSERVAÇÕES = item?.comments;
            newItem.NPE_QT = newItem.npeQT;
            newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

            delete newItem.id;
            delete newItem.safra;
            delete newItem.experiment_genotipe;
            delete newItem.seq_delineamento;
            delete newItem.experimentGroupId;
            delete newItem.countNT;
            delete newItem.npeQT;
            delete newItem.local;
            delete newItem.delineamento;
            delete newItem.eel;
            delete newItem.clp;
            delete newItem.nlp;
            delete newItem.orderDraw;
            delete newItem.comments;
            delete newItem.period;
            delete newItem.repetitionsNumber;
            delete newItem.density;
            delete newItem.status;
            delete newItem.experimentName;
            delete newItem.type_assay;
            delete newItem.idSafra;
            delete newItem.assay_list;
            return newItem;
          });
          const workSheet = XLSX.utils.json_to_sheet(response);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            workBook,
            workSheet,
            'exp-para-etiquetagem',
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
          XLSX.writeFile(workBook, 'Exp. para etiquetagem.xlsx');
        } else {
          setLoading(false);
          Swal.fire(
            'Não existem registros para serem exportados, favor checar.',
          );
        }
      });
    setLoading(false);
  };

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }

  async function handlePagination(page: any): Promise<void> {
    await callingApi(filter, page); // handle pagination globly
  }

  function updateFieldFactory(
    title: string,
    name: string,
    full: boolean = false,
  ) {
    return (
      <div className={`w-${full ? 'full' : '1/2'} h7`}>
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          style={{ background: '#e5e7eb' }}
          disabled
          required
          id={title}
          name={title}
          value={experimentGroup[title]}
        />
      </div>
    );
  }

  function nameGroupFieldFactory(title: string, name: string) {
    return (
      <div
        className="w-full h7" // style={{ minWidth: 230 }}
      >
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          required
          id={title}
          name={title}
          onChange={formik.handleChange}
          value={formik.values.name}
        />
      </div>
    );
  }

  async function deleteConfirmItem(item: any, multipleDelete: boolean) {
    setIsMultipleDelete(multipleDelete);
    setItemSelectedDelete(item);

    if (multipleDelete) {
      if (selectedCheckBox?.length <= 0) {
        return Swal.fire('Selecione os experimentos para excluir.');
      }
    }

    setIsOpenModalConfirm(true);
  }

  async function deleteItem() {
    setLoading(true);
    setIsOpenModalConfirm(false);

    const { status, message } = await experimentService.update({
      id: itemSelectedDelete?.id,
      experimentGroupId: null,
      status: 'SORTEADO',
      userId: userLogado.id,
    });
    if (status === 200) {
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

  async function deleteMultipleItems() {
    // pegar os ids selecionados no estado selectedCheckBox
    const selectedCheckBoxIds = selectedCheckBox.map((i: any) => i.id);

    if (selectedCheckBox?.length <= 0) {
      return Swal.fire('Selecione os experimentos para excluir.');
    }

    setLoading(true);

    // enviar para a api a lista de ids
    const { status, message } = await experimentService.update({
      idList: selectedCheckBoxIds,
      experimentGroupId: null,
      status: 'SORTEADO',
      newGroupId: experimentGroupId,
      userId: userLogado.id,
    });
    if (status === 200) {
      setLoading(false);
      handlePagination(currentPage);
      // router.reload();
    } else {
      Swal.fire({
        html: message,
        width: '800',
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    validateAddExperiment();
    handlePagination(0);
  }, []);

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  async function validateAddExperiment() {
    const { response } = await experimentGroupService.getAll({
      id: experimentGroupId,
    });
    if (response[0].status === 'ETIQ. NÃO INICIADA') {
      setExperimentAdd(false);
    }
    setExperimentAdd(true);
  }

  function selectableFilter(rowData: any) {
    if (
      rowData?.status === 'ETIQ. EM ANDAMENTO'
      || rowData?.status === 'ETIQ. FINALIZADA'
    ) {
      return false;
    }

    return true;
  }

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Seleção expe. para etiquetagem</title>
      </Head>

      <ModalConfirmation
        isOpen={isOpenModalConfirm}
        text={`Tem certeza que deseja deletar ${
          isMultipleDelete
            ? 'os items selecionados?'
            : `o item ${itemSelectedDelete?.experimentName}?`
        }`}
        onPress={isMultipleDelete ? deleteMultipleItems : deleteItem}
        onCancel={() => setIsOpenModalConfirm(false)}
      />

      <Content contentHeader={tabsEtiquetagemMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >
          <form
            className="w-full bg-white shadow-md rounded p-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="w-full flex justify-between items-start gap-5 mt-1">
              {nameGroupFieldFactory('name', 'Grupo de etiquetagem')}
              {updateFieldFactory('experimentAmount', 'Qtde exp')}
              {updateFieldFactory('tagsToPrint', 'Total etiq a imp')}
              {updateFieldFactory('tagsPrinted', 'Total etiq imp')}
              {updateFieldFactory('totalTags', 'Total etiq')}
              {updateFieldFactory('status', 'Status', true)}

              <div className="h-7 w-full flex gap-3 justify-end mt-6">
                <div className="w-40">
                  <Button
                    type="submit"
                    value="Atualizar"
                    bgColor="bg-blue-600"
                    textColor="white"
                    icon={<RiOrganizationChart size={18} />}
                    onClick={() => {
                      setLoading(true);
                    }}
                  />
                </div>
                <div className="w-40">
                  <Button
                    type="button"
                    value="Voltar"
                    bgColor="bg-red-600"
                    textColor="white"
                    icon={<IoMdArrowBack size={18} />}
                    onClick={() => router.back()}
                  />
                </div>
              </div>
            </div>
          </form>

          {/* overflow-y-scroll */}
          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={experiments}
              options={{
                showTitle: false,
                maxBodyHeight: 'calc(100vh - 355px)',
                headerStyle: {
                  zIndex: 1,
                  position: 'sticky',
                  top: 0,
                },
                showSelectAllCheckbox: true,
                selection: true,
                selectionProps: (rowData: any) => {
                  const selectable = selectableFilter(rowData);
                  rowData.tableData.disabled = !selectable;
                  return {
                    disabled: !selectable,
                  };
                },
                // selectionProps: (rowData: any) => ({
                //   disabled:
                //     rowData.status === "ETIQ. EM ANDAMENTO" ||
                //     rowData.status === "ETIQ. FINALIZADA",
                // }),
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
              }}
              // localization={{
              //   body: {
              //     emptyDataSourceMessage: tableMessage ? 'Nenhum experimento encontrado!' : 'ATENÇÃO, VOCÊ PRECISA APLICAR O FILTRO PARA VER OS REGISTROS.',
              //   },
              // }}
              onChangeRowsPerPage={() => {}}
              onSelectionChange={setSelectedCheckBox}
              components={{
                Toolbar: () => (
                  <div
                    className="w-full
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
                    <div className="flex">
                      <div className="h-12 w-52">
                        <Button
                          title="Adicionar Exp. ao grupo"
                          value="Adicionar Exp. ao grupo"
                          textColor="white"
                          onClick={() => {
                            router.push(
                              `/operacao/etiquetagem/relacionar-experimento?experimentGroupId=${experimentGroupId}`,
                            );
                          }}
                          bgColor={
                            experimentGroup?.status === 'ETIQ. EM ANDAMENTO'
                              ? 'bg-gray-400'
                              : 'bg-blue-600'
                          }
                          disabled={
                            experimentGroup?.status === 'ETIQ. EM ANDAMENTO'
                          }
                        />
                      </div>
                      <div className="h-12 w-12 ml-2">
                        <Button
                          title="Excluir grupo"
                          type="button"
                          // onClick={deleteMultipleItems}
                          onClick={() => deleteConfirmItem(null, true)}
                          bgColor="bg-red-600"
                          textColor="white"
                          icon={<BsTrashFill size={20} />}
                        />
                      </div>
                    </div>

                    <strong className="flex text-blue-600">
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
                          title="Exportar planilha de tratamentos"
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
  query,
}: any) => {
  const { token } = req.cookies;
  const { safraId } = req.cookies;
  const experimentGroupId = query.id;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `experimentGroupId=${experimentGroupId}&safraId=${safraId}&grid=${true}`;

  const filterApplication = `experimentGroupId=${experimentGroupId}&safraId=${safraId}&grid=${true}`;

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'asc';

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const { publicRuntimeConfig } = getConfig();
  const baseUrlExperiments = `${publicRuntimeConfig.apiUrl}/experiment`;

  const param = `&experimentGroupId=${experimentGroupId}&safraId=${safraId}`;

  const urlParametersExperiments: any = new URL(baseUrlExperiments);
  urlParametersExperiments.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allExperiments = [], total: totalItems = 0 } = await fetch(
    urlParametersExperiments.toString(),
    requestOptions,
  ).then((response) => response.json());

  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/experiment-group`;
  const experimentGroup = await fetch(
    `${baseUrlShow}/${experimentGroupId}`,
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allExperiments,
      experimentGroup,
      totalItems,
      itensPerPage,
      experimentGroupId,
      filterApplication,
      safraId,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
