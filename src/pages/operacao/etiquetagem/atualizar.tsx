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
import { RiFileExcel2Line } from 'react-icons/ri';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { IoMdArrowBack } from 'react-icons/io';
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

export default function Listagem({
  experimentGroup,
  experimentGroupId,
  itensPerPage,
  filterApplication,
  safraId,
  filterBeforeEdit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsEtiquetagemMenu = tabsOperation.map((i: any) => (i.titleTab === 'ETIQUETAGEM' ? { ...i, statusTab: true } : i));

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
  const [orderList, setOrder] = useState<number>(0);
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);

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
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const router = useRouter();
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  // const take: number = itensPerPage;
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [selectedCheckBox, setSelectedCheckBox] = useState([]);

  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);
  const [itemSelectedDelete, setItemSelectedDelete] = useState<any>(null);

  async function handleOrder(
    column: string,
    order: number,
    name: any,
  ): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }
    setOrderBy(column);
    setOrderType(typeOrder);
    if (filter && typeof filter !== 'undefined') {
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

    await experimentService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then(({ status, response }: any) => {
        if (status === 200) {
          setExperiments(response);
        }
      });

    if (orderList === 2) {
      setOrder(0);
    } else {
      setOrder(orderList + 1);
    }

    setFieldOrder(name);
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

  // function tecnologiaHeaderFactory(name: string, title: string) {
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
  //     field: "tecnologia",
  //     width: 0,
  //     sorting: true,
  //     render: (rowData: any) => (
  //       <div className="h-10 flex">
  //         <div>
  //           {`${rowData?.assay_list?.tecnologia?.cod_tec} ${rowData?.assay_list?.tecnologia?.name}`}
  //         </div>
  //       </div>
  //     ),
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
              disabled={
                rowData.status === 'ETIQ. EM ANDAMENTO'
                || rowData.status === 'ETIQ. FINALIZADA'
              }
              title={`Excluir ${rowData.name}`}
              type="button"
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
    await experimentService.getAll(filter).then(({ status, response }: any) => {
      if (status === 200) {
        response.map((item: any) => {
          const newItem = item;
          newItem.CULTURA = item.assay_list?.safra?.culture?.name;
          newItem.SAFRA = item.assay_list?.safra?.safraName;
          newItem.FOCO = item.assay_list?.foco.name;
          newItem.TIPO_DE_ENSAIO = item.assay_list?.type_assay.name;
          newItem.TECNOLOGIA = `${item.assay_list?.tecnologia.cod_tec} ${item.assay_list?.tecnologia.name}`;
          newItem.GLI = item.assay_list?.gli;
          newItem.NOME_DO_EXPERIMENTO = item?.experimentName;
          newItem.BGM = item.assay_list?.bgm;
          newItem.STATUS_ENSAIO = item.assay_list?.status;
          newItem.PLANTIO = newItem.local?.name_local_culture;
          newItem.DELINEAMENTO = item.delineamento?.name;
          newItem.DENSIDADE = item?.density;
          newItem.REP = item.repetitionsNumber;
          newItem.ÉPOCA = item?.period;
          newItem.ORDEM_SORTEIO = item?.orderDraw;
          newItem.NLP = item?.nlp;
          newItem.CLP = item?.clp;
          newItem.OBSERVAÇÕES = item?.comments;
          newItem.COUNT_NT = newItem.countNT;
          newItem.NPE_QT = newItem.npeQT;

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
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Experimentos');

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
        XLSX.writeFile(workBook, 'Experimentos.xlsx');
      } else {
        setLoading(false);
        Swal.fire('Não existem registros para serem exportados, favor checar.');
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

  async function handlePagination(): Promise<void> {
    const skip = currentPage * Number(take);
    let parametersFilter;
    if (orderType) {
      parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }

    await experimentService
      .getAll(parametersFilter)
      .then(({ status, response, total: newTotal }: any) => {
        if (status === 200) {
          setExperiments(response);
          setTotalItems(newTotal);
        }
      });
  }

  function updateFieldFactory(title: string, name: string) {
    return (
      <div className="w-full h7">
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
      <div className="h7" style={{ minWidth: 230 }}>
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

  async function deleteConfirmItem(item: any) {
    setItemSelectedDelete(item);
    setIsOpenModalConfirm(true);
    setLoading(false);
  }

  async function deleteItem() {
    setIsOpenModalConfirm(false);
    setLoading(true);

    const { status, message } = await experimentService.update({
      id: itemSelectedDelete?.id,
      experimentGroupId: null,
      userId: userLogado.id,
    });
    if (status === 200) {
      handlePagination();
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

    // enviar para a api a lista de ids

    // const { status, message } = await experimentService.update({
    //   id,
    //   experimentGroupId: null,
    // });
    // if (status === 200) {
    //   router.reload();
    // } else {
    //   Swal.fire({
    //     html: message,
    //     width: "800",
    //   });
    // }
    setLoading(false);
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

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
        text={`Tem certeza que deseja deletar o item ${itemSelectedDelete?.name}?`}
        onPress={deleteItem}
        onCancel={() => setIsOpenModalConfirm(false)}
      />

      <Content contentHeader={tabsEtiquetagemMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <form
            className="w-full bg-white shadow-md rounded p-4"
            onSubmit={() => {}}
          >
            <div className="w-full flex justify-between items-start gap-5 mt-1">
              {nameGroupFieldFactory('name', 'Grupo de etiquetagem')}
              {updateFieldFactory('experimentAmount', 'Qtde exp')}
              {updateFieldFactory('tagsToPrint', 'Total etiq a imp')}
              {updateFieldFactory('tagsPrinted', 'Total etiq imp')}
              {updateFieldFactory('totalTags', 'Total etiq')}
              {updateFieldFactory('status', 'Status')}

              <div className="h-7 w-full flex gap-3 justify-end mt-6">
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
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={experiments}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 0,
                },
                showSelectAllCheckbox: false,
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
                          bgColor="bg-blue-600"
                        />
                      </div>
                      <div className="h-12 w-12 ml-2">
                        <Button
                          title="Excluir grupo"
                          type="button"
                          onClick={deleteMultipleItems}
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
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';
  const { token } = req.cookies;
  const { safraId } = req.cookies;
  const experimentGroupId = query.id;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlExperiments = `${publicRuntimeConfig.apiUrl}/experiment`;

  const filterApplication = `experimentGroupId=${experimentGroupId}&safraId=${safraId}`
    || `&experimentGroupId=${experimentGroupId}&safraId=${safraId}`;

  // removeCookies("filterBeforeEdit", { req, res });
  // removeCookies("pageBeforeEdit", { req, res });

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
      experimentGroupId,
      experimentGroup,
      totalItems,
      itensPerPage,
      filterApplication,
      safraId,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
