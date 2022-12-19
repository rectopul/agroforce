/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { BsTrashFill } from "react-icons/bs";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { UserPreferenceController } from "../../../../controllers/user-preference.controller";
import { userPreferencesService } from "../../../../services";
import { experimentService } from "../../../../services/experiment.service";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  SelectMultiple,
  ModalConfirmation,
  FieldItemsPerPage,
} from "../../../../components";
import ITabs from "../../../../shared/utils/dropdown";
import { tableGlobalFunctions } from "../../../../helpers";
import headerTableFactoryGlobal from "../../../../shared/utils/headerTableFactory";
import ComponentLoading from "../../../../components/Loading";

interface IFilter {
  filterFoco: string;
  filterTypeAssay: string;
  filterGli: string;
  filterExperimentName: string;
  filterTecnologia: string;
  filterCodTec: string;
  filterPeriod: string;
  filterDelineamento: string;
  filterRepetition: string;
  filterRepetitionFrom: string | any;
  filterRepetitionTo: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface IExperimento {
  id: number;
  experiment_name: string;
  year: number;
  rotulo: string;
  foco: string;
  ensaio: string;
  cod_tec: number;
  epoca: number;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allExperiments: IExperimento[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  idSafra: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string;
  orderByserver: any | string;
  cultureId: number | any;
}

export default function Listagem({
  allExperiments,
  totalItems,
  itensPerPage,
  filterApplication,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer,
  orderByserver,
  cultureId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns("listas");

  tabsDropDowns.map((tab) =>
    tab.titleTab === "EXPERIMENTOS"
      ? (tab.statusTab = true)
      : (tab.statusTab = false)
  );

  const tableRef = useRef<any>(null);

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.experimento || {
    id: 0,
    table_preferences:
      "id,foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,status,action",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const router = useRouter();
  const [experimentos, setExperimento] = useState<IExperimento[]>(
    () => allExperiments
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit)
  );
  const [filter, setFilter] = useState<any>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: "CamposGerenciados[]", title: "Foco", value: "foco" },
    { name: "CamposGerenciados[]", title: "Ensaio", value: "type_assay" },
    { name: "CamposGerenciados[]", title: "GLI", value: "gli" },
    {
      name: "CamposGerenciados[]",
      title: "Nome experimento",
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
    { name: "CamposGerenciados[]", title: "Ação", value: "action" },
  ]);

  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);
  const [itemSelectedDelete, setItemSelectedDelete] = useState<any>(null);

  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>("");
  const [colorStar, setColorStar] = useState<string>("");
  const [order, setOrderParams] = useState<string>("");

  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
    orderBy == "tecnologia" ? "assay_list.tecnologia.cod_tec" : orderBy
  }&typeOrder=${typeOrder}`;

  const [filtersParams, setFiltersParams] = useState<any>(filterBeforeEdit); // Set filter Parameter

  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
    {
      name: "StatusCheckbox",
      title: "IMPORTADO ",
      value: "IMPORTADO",
      defaultChecked: () => camposGerenciados.includes("IMPORTADO"),
    },
    {
      name: "StatusCheckbox",
      title: "SORTEADO",
      value: "SORTEADO",
      defaultChecked: () => camposGerenciados.includes("SORTEADO"),
    },
    {
      name: "StatusCheckbox",
      title: "ETIQ. NÃO INICIADA",
      value: "ETIQ. NÃO INICIADA",
      defaultChecked: () => camposGerenciados.includes("ETIQ. NÃO INICIADA"),
    },
    {
      name: "StatusCheckbox",
      title: "ETIQ. EM ANDAMENTO",
      value: "ETIQ. EM ANDAMENTO",
      defaultChecked: () => camposGerenciados.includes("ETIQ. EM ANDAMENTO"),
    },
    {
      name: "StatusCheckbox",
      title: "ETIQ. FINALIZADA",
      value: "ETIQ. FINALIZADA",
      defaultChecked: () => camposGerenciados.includes("ETIQ. FINALIZADA"),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>([]);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterFoco: checkValue("filterFoco"),
      filterTypeAssay: checkValue("filterTypeAssay"),
      filterGli: checkValue("filterGli"),
      filterExperimentName: checkValue("filterExperimentName"),
      filterTecnologia: checkValue("filterTecnologia"),
      filterCodTec: checkValue("filterCodTec"),
      filterPeriod: checkValue("filterPeriod"),
      filterDelineamento: checkValue("filterDelineamento"),
      filterRepetition: checkValue("filterRepetition"),
      filterRepetitionTo: checkValue("filterRepetitionTo"),
      filterRepetitionFrom: checkValue("filterRepetitionFrom"),
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterGli,
      filterExperimentName,
      filterTecnologia,
      filterCodTec,
      filterPeriod,
      filterDelineamento,
      filterRepetition,
      filterRepetitionTo,
      filterRepetitionFrom,
    }) => {
      const allCheckBox: any = document.querySelectorAll(
        "input[name='StatusCheckbox']"
      );
      let selecionados = "";
      for (let i = 0; i < allCheckBox.length; i += 1) {
        if (allCheckBox[i].checked) {
          selecionados += `${allCheckBox[i].value},`;
        }
      }
      // const filterStatus = selecionados.substr(0, selecionados.length - 1);
      const filterExperimentStatus = statusFilterSelected
        ?.join(",")
        ?.toLowerCase();

      const parametersFilter = `filterRepetitionTo=${filterRepetitionTo}&filterRepetitionFrom=${filterRepetitionFrom}&filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterGli=${filterGli}&filterExperimentName=${filterExperimentName}&filterTecnologia=${filterTecnologia}&filterPeriod=${filterPeriod}&filterRepetition=${filterRepetition}&filterDelineamento=${filterDelineamento}&idSafra=${idSafra}&filterCodTec=${filterCodTec}&filterExperimentStatus=${filterExperimentStatus}&id_culture=${cultureId}`;

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any) {
    setCookies("filterBeforeEdit", parametersFilter);
    setCookies("filterBeforeEditTypeOrder", typeOrder);
    setCookies("filterBeforeEditOrderBy", orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies("filtersParams", parametersFilter);

    setLoading(true);

    await experimentService
      .getAll(parametersFilter)
      .then((response) => {
        if (
          response.status === 200 ||
          (response.status === 400 && response.total == 0)
        ) {
          setExperimento(response.response);
          setTotalItems(response.total);
          tableRef.current?.dataManager.changePageSize(
            response.total >= take ? take : response.total
          );
        }
      })
      .catch((_) => {
        setLoading(false);
      });

    setLoading(false);
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleOrder(
    column: string,
    order: string | any,
    name: any
  ): Promise<void> {
    // // Manage orders of colunms
    // const parametersFilter = await fetchWrapper.handleOrderGlobal(
    //   column,
    //   order,
    //   filter,
    //   'experimento',
    // );

    // setOrderParams(parametersFilter);

    // const value = await fetchWrapper.skip(currentPage, parametersFilter);

    // await experimentService.getAll(value).then(({ status, response }: any) => {
    //   if (status === 200) {
    //     setExperimento(response);
    //     setFiltersParams(parametersFilter);
    //   }
    // });

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
    const { typeOrderG, columnG, orderByG, arrowOrder } =
      await tableGlobalFunctions.handleOrderG(column, order, orderList);

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
  //     sorting: true,
  //   };
  // }

  // function idHeaderFactory() {
  //   return {
  //     title: (
  //       <div className="flex items-center">
  //         {arrowOrder}
  //       </div>
  //     ),
  //     field: 'id',
  //     width: 0,
  //     sorting: false,
  //     render: () => (
  //       colorStar === '#eba417'
  //         ? (
  //           <div className="h-7 flex">
  //             <div>
  //               <button
  //                 type="button"
  //                 className="w-full h-full flex items-center justify-center border-0"
  //                 onClick={() => setColorStar('')}
  //               >
  //                 <AiTwotoneStar size={20} color="#eba417" />
  //               </button>
  //             </div>
  //           </div>
  //         )
  //         : (
  //           <div className="h-7 flex">
  //             <div>
  //               <button
  //                 type="button"
  //                 className="w-full h-full flex items-center justify-center border-0"
  //                 onClick={() => setColorStar('#eba417')}
  //               >
  //                 <AiTwotoneStar size={20} />
  //               </button>
  //             </div>
  //           </div>
  //         )
  //     ),
  //   };
  // }

  async function deleteConfirmItem(item: any) {
    setItemSelectedDelete(item);
    setIsOpenModalConfirm(true);
  }

  async function deleteItem() {
    setIsOpenModalConfirm(false);
    setLoading(true);

    // eslint-disable-next-line max-len
    const { status, message } = await await experimentService.deleted({
      id: itemSelectedDelete?.id,
      userId: userLogado.id,
    });
    if (status === 200) {
      handlePagination();
      setLoading(false);
    } else {
      Swal.fire({
        html: message,
        width: "800",
      });
    }
  }

  function statusHeaderFactory() {
    return {
      title: "Ação",
      field: "action",
      sorting: false,
      searchable: false,
      render: (rowData: any) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.experimentName}`}
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                setCookies("filterBeforeEditTypeOrder", typeOrder);
                setCookies("filterBeforeEditOrderBy", orderBy);
                setCookies("filtersParams", filtersParams);
                setCookies("lastPage", "atualizar");
                setCookies("takeBeforeEdit", take);
                setCookies("itensPage", itensPerPage);
                router.push(
                  `/listas/experimentos/experimento/atualizar?id=${rowData.id}`
                );
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div style={{ width: 5 }} />
          <div>
            <Button
              title={`Deletar ${rowData.experimentName}`}
              icon={<BsTrashFill size={14} />}
              onClick={() => deleteConfirmItem(rowData)}
              disabled={
                rowData.status != "IMPORTADO" && rowData.status != "SORTEADO"
              }
              bgColor={
                rowData.status != "IMPORTADO" && rowData.status != "SORTEADO"
                  ? "bg-gray-600"
                  : "bg-red-600"
              }
              textColor="white"
            />
          </div>
        </div>
      ),
    };
  }

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
  //     field: 'tecnologia',
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

  function columnsOrder(columnsCampos: any): any {
    const columnCampos: any = columnsCampos.split(",");
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((_, index) => {
      if (columnCampos[index] === "foco") {
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
      if (columnCampos[index] === "type_assay") {
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
      if (columnCampos[index] === "gli") {
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
      if (columnCampos[index] === "tecnologia") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Tecnologia",
            title: "tecnologia",
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData?.assay_list?.tecnologia?.cod_tec} ${rowData?.assay_list?.tecnologia?.name}`}
              </div>
            ),
          })
        );
      }
      if (columnCampos[index] === "experimentName") {
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
      if (columnCampos[index] === "period") {
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
      if (columnCampos[index] === "delineamento") {
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
      if (columnCampos[index] === "repetitionsNumber") {
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
      if (columnCampos[index] === "status") {
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
      if (columnCampos[index] === "action") {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox']");
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
        .then((response) => {
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
    await experimentService
      .getAll(filter)
      .then(({ status, response, message }: any) => {
        if (status === 200) {
          response.map((item: any) => {
            const newItem = item;
            newItem.SAFRA = item.assay_list?.safra?.safraName;
            newItem.FOCO = item.assay_list?.foco.name;
            newItem.TIPO_DE_ENSAIO = item.assay_list?.type_assay.name;
            newItem.TECNOLOGIA = item.assay_list?.tecnologia.name;
            newItem.GLI = item.assay_list?.gli;
            newItem.NOME_DO_EXPERIMENTO = item?.experimentName;
            newItem.BGM = item.assay_list?.bgm;
            newItem.STATUS_ENSAIO = item.assay_list?.status;
            newItem.PLANTIO = newItem.local?.name_local_culture;
            newItem.DELINEAMENTO = item.delineamento?.name;
            newItem.REPETIÇÃO = item.delineamento?.repeticao;
            newItem.DENSIDADE = item?.density;
            newItem.NÚMERO_DE_REPETIÇÕES = item.repetitionsNumber;
            newItem.ÉPOCA = item?.period;
            newItem.ORDEM_SORTEIO = item?.orderDraw;
            newItem.NLP = item?.nlp;
            newItem.CLP = item?.clp;
            newItem.EEL = item?.eel;
            newItem.OBSERVAÇÕES = item?.comments;
            newItem.COUNT_NT = newItem.countNT;
            newItem.NPE_QT = newItem.npeQT;

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
          XLSX.utils.book_append_sheet(workBook, workSheet, "experimentos");

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
          XLSX.writeFile(workBook, "Experimentos.xlsx");
        } else {
          setLoading(false);
          Swal.fire(
            "Não existem registros para serem exportados, favor checar."
          );
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
    // // manage using comman function
    // const { parametersFilter, currentPages } = await fetchWrapper.handlePaginationGlobal(currentPage, take, filtersParams);

    // await experimentService.getAll(`${parametersFilter}&idSafra=${idSafra}`).then(({ status, response }: any) => {
    //   if (status === 200) {
    //     setExperimento(response);
    //     // setFiltersParams(parametersFilter);
    //     // setTotalItems(response.total); //Set new total records
    //     // setCurrentPage(currentPages); //Set new current page
    //     setTimeout(removestate, 10000); // Remove State
    //   }
    // });
    await callingApi(filter); // handle pagination globly
  }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams
    );
    return parameter;
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
    // localStorage.removeItem('orderSorting');
  }, [currentPage]);

  function filterFieldFactory(title: any, name: any) {
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
          defaultValue={checkValue(title)}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  return (
    <>
      {loading && <ComponentLoading text="" />}

      <Head>
        <title>Listagem de experimentos</title>
      </Head>

      <ModalConfirmation
        isOpen={isOpenModalConfirm}
        text={`Tem certeza que deseja deletar o item ${itemSelectedDelete?.experimentName}?`}
        onPress={deleteItem}
        onCancel={() => setIsOpenModalConfirm(false)}
      />

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main
          className="h-full w-full
                        flex flex-col
                        items-start
                        gap-4
                        "
        >
          <AccordionFilter title="Filtrar experimentos">
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
                                        pb-8
                                        "
                >
                  {filterFieldFactory("filterFoco", "Foco")}
                  {filterFieldFactory("filterTypeAssay", "Ensaio")}
                  {filterFieldFactory("filterGli", "GLI")}
                  {filterFieldFactory(
                    "filterExperimentName",
                    "Nome experimento"
                  )}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Cod Tec
                    </label>
                    <div className="flex">
                      <Input
                        size={7}
                        placeholder="Cod Tec"
                        id="filterCodTec"
                        name="filterCodTec"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="w-full h-full
                                        flex
                                        justify-center
                                        pb-0
                                        "
                >
                  {filterFieldFactory("filterTecnologia", "Nome Tec")}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Época
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="Época"
                        id="filterPeriod"
                        name="filterPeriod"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

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
                        style={{ marginLeft: 8 }}
                        type="number"
                        placeholder="Até"
                        id="filterRepetitionTo"
                        name="filterRepetitionTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status EXP
                    </label>
                    <SelectMultiple
                      data={statusFilter.map((i: any) => i.title)}
                      values={statusFilterSelected}
                      onChange={(e: any) => setStatusFilterSelected(e)}
                    />
                  </div>

                  {/* <div className="h-10 w-full ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status do Experimento
                    </label> */}
                  {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {statusFilter.map((generate, index) => (
                        <CheckBox
                          key={index}
                          name={generate.name}
                          title={generate.title?.toString()}
                          value={generate.value}
                          defaultChecked={false}
                        />
                      ))}
                    </div> */}
                  {/* <AccordionFilter>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {(provided) => (
                            <ul
                              className="w-1/2 h-full characters"
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
                      type="submit"
                      onClick={() => {
                        setLoading(true);
                      }}
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

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={experimentos}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 0,
                },
                rowStyle: { background: "#f9fafb", height: 35 },
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
                    {/* <div className="h-12">
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="experimento/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div> */}

                    <div />
                    <strong className="text-blue-600">
                      Total registrado: {itemsTotal}
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
                                                String(generate.value)
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
                          title="Exportar planilha de experimentos"
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
                        onClick={() => setCurrentPage(0)}
                        bgColor="bg-blue-600"
                        textColor="white"
                        icon={<MdFirstPage size={18} />}
                        disabled={currentPage < 1}
                      />
                      <Button
                        onClick={() => {
                          setCurrentPage(currentPage - 1);
                        }}
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
                            onClick={() => setCurrentPage(index)}
                            value={`${currentPage + 1}`}
                            bgColor="bg-blue-600"
                            textColor="white"
                            disabled
                          />
                        ))}
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        bgColor="bg-blue-600 RR"
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
  const { token } = req.cookies;
  const { cultureId } = req.cookies;

  const idSafra = Number(req.cookies.safraId);
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : "No";

  if (lastPageServer == undefined || lastPageServer == "No") {
    removeCookies("filterBeforeEdit", { req, res });
    removeCookies("pageBeforeEdit", { req, res });
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("lastPage", { req, res });
    removeCookies("itensPage", { req, res });
  }

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `idSafra=${idSafra}&id_culture=${cultureId}`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `idSafra=${idSafra}&id_culture=${cultureId}`;

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "asc";

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "";

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });
  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("takeBeforeEdit", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("lastPage", { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/experiment`;

  const param = `skip=0&take=${itensPerPage}&idSafra=${idSafra}&id_culture=${cultureId}`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;
  const { response: allExperiments = [], total: totalItems = 0 } = await fetch(
    urlParameters.toString(),
    requestOptions
  ).then((response) => response.json());

  return {
    props: {
      allExperiments,
      totalItems,
      itensPerPage,
      filterApplication,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
      cultureId,
    },
  };
};
