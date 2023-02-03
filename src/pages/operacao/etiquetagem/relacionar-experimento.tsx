/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef } from "react";
import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { IoMdArrowBack } from "react-icons/io";
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import {
  RiArrowUpDownLine,
  RiCloseCircleFill,
  RiFileExcel2Line,
} from "react-icons/ri";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import readXlsxFile from "read-excel-file";
import {
  ITreatment,
  ITreatmentFilter,
  ITreatmentGrid,
} from "../../../interfaces/listas/ensaio/genotype-treatment.interface";
import { IGenerateProps } from "../../../interfaces/shared/generate-props.interface";
import ComponentLoading from "../../../components/Loading";

import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  ModalConfirmation,
  Select,
  FieldItemsPerPage,
  SelectMultiple,
} from "../../../components";
import { UserPreferenceController } from "../../../controllers/user-preference.controller";
import {
  experimentService,
  importService,
  userPreferencesService,
} from "../../../services";
import * as ITabs from "../../../shared/utils/dropdown";
import { functionsUtils } from "../../../shared/utils/functionsUtils";
import { IReturnObject } from "../../../interfaces/shared/Import.interface";
// import { fetchWrapper } from "../../../helpers";
import { IExperiments } from "../../../interfaces/listas/experimento/experimento.interface";
import { tableGlobalFunctions } from "../../../helpers";
import headerTableFactoryGlobal from "../../../shared/utils/headerTableFactory";

interface IFilter {
  filterFoco: string;
  filterTypeAssay: string;
  filterGli: string;
  filterExperimentName: string;
  filterTecnologia: string;
  filterCod: string;
  filterPeriod: string;
  filterDelineamento: string;
  filterRepetition: string;
  filterRepetitionFrom: string | any;
  filterRepetitionTo: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export default function Listagem({
  allExperiments,
  totalItems,
  itensPerPage,
  experimentGroupId,
  filterApplication,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
  idCulture,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsEtiquetagemMenu = tabsOperation.map((i: any) =>
    i.titleTab === "ETIQUETAGEM" ? { ...i, statusTab: true } : i
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.experimento || {
    id: 0,
    table_preferences:
      "id,foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,status,action",
  };

  const tableRef = useRef<any>(null);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const [experiments, setExperiments] = useState<ITreatment[] | any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tableMessage, setMessage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == "desc" ? 1 : 2
  );
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Foco", value: "foco" },
    { name: "CamposGerenciados[]", title: "Ensaio", value: "type_assay" },
    { name: "CamposGerenciados[]", title: "GLI", value: "gli" },
    {
      name: "CamposGerenciados[]",
      title: "Nome do experimento",
      value: "experimentName",
    },
    { name: "CamposGerenciados[]", title: "Tecnologia", value: "tecnologia" },
    { name: "CamposGerenciados[]", title: "Época", value: "period" },
    {
      name: "CamposGerenciados[]",
      title: "Delineamento",
      value: "delineamento",
    },
    { name: "CamposGerenciados[]", title: "Rep", value: "repetitionsNumber" },
    { name: "CamposGerenciados[]", title: "Status EXP", value: "status" },
    // { name: "CamposGerenciados[]", title: "Ação", value: "action" },
  ]);

  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    {
      name: "StatusCheckbox",
      title: "IMPORTADO ",
      value: "importado",
      defaultChecked: () => camposGerenciados.includes("importado"),
    },
    {
      name: "StatusCheckbox",
      title: "SORTEADO",
      value: "sorteado",
      defaultChecked: () => camposGerenciados.includes("sorteado"),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>([]);

  // const [orderBy, setOrderBy] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] =
    useState<boolean>(false);
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const [rowsSelected, setRowsSelected] = useState([]);
  const router = useRouter();

  const formik = useFormik<IFilter>({
    initialValues: {
      filterFoco: "",
      filterTypeAssay: "",
      filterGli: "",
      filterExperimentName: "",
      filterTecnologia: "",
      filterCod: "",
      filterPeriod: "",
      filterDelineamento: "",
      filterRepetition: "",
      filterRepetitionTo: "",
      filterRepetitionFrom: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterGli,
      filterExperimentName,
      filterTecnologia,
      filterCod,
      filterPeriod,
      filterDelineamento,
      filterRepetition,
    }) => {
      if (!functionsUtils?.isNumeric(filterPeriod)) {
        return Swal.fire("O campo Época não pode ter ponto ou vírgula.");
      }

      const allCheckBox: any = document.querySelectorAll(
        "input[name='StatusCheckbox']"
      );
      let selecionados = "";
      for (let i = 0; i < allCheckBox.length; i += 1) {
        if (allCheckBox[i].checked) {
          selecionados += `${allCheckBox[i].value},`;
        }
      }

      const parametersFilter = `filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterGli=${filterGli}&filterExperimentName=${filterExperimentName}&filterTecnologia=${filterTecnologia}&filterCod=${filterCod}&filterPeriod=${filterPeriod}&filterRepetition=${filterRepetition}&filterDelineamento=${filterDelineamento}&idSafra=${idSafra}&filterExperimentStatus=SORTEADO`;

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

    setCookies("filterBeforeEdit", parametersFilter);
    setCookies("filterBeforeEditTypeOrder", typeOrder);
    setCookies("filterBeforeEditOrderBy", orderBy);

    //parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies("filtersParams", parametersFilter);

    console.log('experimentService.getAll(parametersFilter)', parametersFilter);
    
    await experimentService
      .getAll(parametersFilter)
      .then((response) => {
        if (
          response.status === 200 ||
          (response.status === 400 && response.total === 0)
        ) {
          setExperiments(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total
          );
        }
        setLoading(false);
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleOrder(
    column: string,
    order: number,
    name: any
  ): Promise<void> {
    setLoading(true);
    // let typeOrder: any;
    // let parametersFilter: any;
    // if (order === 1) {
    //   typeOrder = "asc";
    // } else if (order === 2) {
    //   typeOrder = "desc";
    // } else {
    //   typeOrder = "";
    // }
    // setOrderBy(column);
    // setOrderType(typeOrder);
    // if (filter && typeof filter !== "undefined") {
    //   if (typeOrder !== "") {
    //     parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
    //   } else {
    //     parametersFilter = filter;
    //   }
    // } else if (typeOrder !== "") {
    //   parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    // } else {
    //   parametersFilter = filter;
    // }

    // await experimentService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then(({ status, response }: IReturnObject) => {
    //     if (status === 200) {
    //       setExperiments(response);
    //     }
    //   });

    // if (orderList === 2) {
    //   setOrder(0);
    // } else {
    //   setOrder(orderList + 1);
    // }

    // Gobal manage orders
    const { typeOrderG, columnG, orderByG, arrowOrder } =
      await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(columnG);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    typeOrderG !== "" ? (typeOrderG == "desc" ? setOrder(1) : setOrder(2)) : "";
    setArrowOrder(arrowOrder);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
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
  //           {`${rowData.assay_list.tecnologia.cod_tec} ${rowData.assay_list.tecnologia.name}`}
  //         </div>
  //       </div>
  //     ),
  //   };
  // }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(",");
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((index: any) => {
      if (columnOrder[index] === "foco") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Foco",
            title: "assay_list.foco.name",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnOrder[index] === "type_assay") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Ensaio",
            title: "assay_list.type_assay.name",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnOrder[index] === "gli") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "GLI",
            title: "assay_list.gli",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnOrder[index] === "tecnologia") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Tecnologia",
            title: "assay_list.tecnologia.cod_tec",
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.assay_list.tecnologia.cod_tec} ${rowData.assay_list.tecnologia.name}`}
              </div>
            ),
          })
        );
      }
      if (columnOrder[index] === "experimentName") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Nome experimento",
            title: "experimentName",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnOrder[index] === "period") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Época",
            title: "period",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnOrder[index] === "delineamento") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Delineamento",
            title: "delineamento.name",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnOrder[index] === "repetitionsNumber") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Rep",
            title: "repetitionsNumber",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnOrder[index] === "status") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Status EXP",
            title: "status",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
    });
    return tableFields;
  }

  const columns = orderColumns(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = "";
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
        .then((response: any) => {
          userLogado.preferences.experimento = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
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
      localStorage.setItem("user", JSON.stringify(userLogado));
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
      .then(({ status, response }: IReturnObject) => {
        if (status === 200) {
          const newData = response.map((item: any) => {
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
          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            workBook,
            workSheet,
            "seleção-expe.-para-etiquetagem"
          );

          // Buffer
          XLSX.write(workBook, {
            bookType: "xlsx", // xlsx
            type: "buffer",
          });
          // Binary
          XLSX.write(workBook, {
            bookType: "xlsx", // xlsx
            type: "binary",
          });
          // Download
          XLSX.writeFile(workBook, "Seleção expe. para etiquetagem.xlsx");
        } else {
          setLoading(false);
          Swal.fire(
            "Não existem registros para serem exportados, favor checar."
          );
        }
      });
    setLoading(false);
  };

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(page: any): Promise<void> {
    await callingApi(filter, page); // handle pagination globly
  }

  function filterFieldFactory(title: string, name: string) {
    return (
      <div className="h-7 w-1/2 ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  async function handleSubmit() {
    setLoading(true);
    const experimentsSelected = rowsSelected.map(
      (item: IExperiments) => item.id
    );
    const { status }: IReturnObject = await experimentService.update({
      idList: experimentsSelected,
      experimentGroupId: Number(experimentGroupId),
    });
    if (status !== 200) {
      Swal.fire("Erro ao associar experimentos");
      setLoading(false);
    } else {
      router.back();
    }
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      <Head>
        <title>Seleção expe. para etiquetagem</title>
      </Head>

      {loading && <ComponentLoading text="" />}

      <ModalConfirmation
        isOpen={isOpenModal}
        text={`Você tem certeza de que quer associar ${rowsSelected?.length} experimentos a esse grupo?`}
        onPress={handleSubmit}
        onCancel={() => setIsOpenModal(false)}
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
          <AccordionFilter
            title="Filtrar dados de etiquetagem"
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
                                        pb-8
                                        "
                >
                  {filterFieldFactory("filterFoco", "Foco")}
                  {filterFieldFactory("filterTypeAssay", "Ensaio")}
                  {filterFieldFactory("filterGli", "GLI")}
                  {filterFieldFactory(
                    "filterExperimentName",
                    "Nome Experimento"
                  )}
                  {filterFieldFactory("filterCod", "Cod Tec")}
                </div>

                <div
                  className="w-full h-full
                                        flex
                                        justify-center
                                        pb-2
                                        "
                >
                  {filterFieldFactory("filterTecnologia", "Nome Tecnologia")}
                  {filterFieldFactory("filterPeriod", "Época")}
                  {filterFieldFactory("filterDelineamento", "Delineamento")}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Rep
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterRepetitionFrom"
                        name="filterRepetitionFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterRepetitionTo"
                        name="filterRepetitionTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 40 }} />
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

          {/* overflow-y-scroll */}
          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={experiments}
              options={{
                selection: true,
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 465 : 320
                }px)`,
                headerStyle: {
                  zIndex: 1,
                },
                rowStyle: { background: "#f9fafb", height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
              }}
              onSelectionChange={setRowsSelected}
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
                    <div className="flex">
                      <div className="h-12 w-74 mr-2">
                        <Button
                          title="Salvar grupo de experimento"
                          value="Salvar grupo de experimento"
                          textColor="white"
                          onClick={() => {
                            setIsOpenModal(true);
                          }}
                          bgColor="bg-blue-600"
                          icon={<RiArrowUpDownLine size={20} />}
                        />
                      </div>
                      <div className="h-12 w-28 ml-0">
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

                    <strong className="text-blue-600">
                      Total registrado: {itemsTotal}
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
                                                generate.value
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
                Pagination: (props) =>
                  (
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
                        .fill("")
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
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 10;
  
  // (await (
  //   await PreferencesControllers.getConfigGerais()
  // )?.response[0]?.itens_per_page) ?? 5;
  
  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : "No";

  if (lastPageServer == undefined || lastPageServer == "No") {
    removeCookies("filterBeforeEdit", { req, res });
    removeCookies("pageBeforeEdit", { req, res });
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("lastPage", { req, res });
  }

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : "";

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "desc";

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "assay_list.foco.name";

  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;
  const { experimentGroupId } = query;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlExperimento = `${publicRuntimeConfig.apiUrl}/experiment`;

  const filterApplication =
    req.cookies.filterBeforeEdit ||
    `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}&filterExperimentStatus=SORTEADO`;

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });

  const param = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}&filterExperimentStatus=SORTEADO`;

  const urlParametersExperiment: any = new URL(baseUrlExperimento);
  urlParametersExperiment.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allExperiments = [], total: totalItems = 0 } = await fetch(
    urlParametersExperiment.toString(),
    requestOptions
  ).then((response) => response.json());

  // const allExperiments = []
  // const totalItems = 0

  return {
    props: {
      allExperiments,
      totalItems,
      experimentGroupId,
      itensPerPage,
      filterApplication,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
      idCulture,
      orderByserver, // RR
      typeOrderServer, // RR
    },
  };
};
