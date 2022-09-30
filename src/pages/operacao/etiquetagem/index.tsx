/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useRef, useEffect, useState } from "react";
import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { BsTrashFill } from "react-icons/bs";
import { RiCloseCircleFill, RiFileExcel2Line } from "react-icons/ri";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { AiOutlinePrinter } from "react-icons/ai";
import { IGenerateProps } from "../../../interfaces/shared/generate-props.interface";

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
} from "../../../components";
import { UserPreferenceController } from "../../../controllers/user-preference.controller";
import {
  experimentGroupService,
  userPreferencesService,
} from "../../../services";
import * as ITabs from "../../../shared/utils/dropdown";
import {
  IExperimentGroupFilter,
  IExperimentsGroup,
} from "../../../interfaces/listas/operacao/etiquetagem/etiquetagem.interface";
import { IReturnObject } from "../../../interfaces/shared/Import.interface";
import { tableGlobalFunctions } from "../../../helpers";

export default function Listagem({
  allExperimentGroup,
  totalItems,
  itensPerPage,
  safraId,
  filterApplication,
  pageBeforeEdit,
  filterBeforeEdit,
  cultureId,
  typeOrderServer,
  orderByserver,
}: // eslint-disable-next-line no-use-before-define
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsEtiquetagemMenu = tabsOperation.map((i) =>
    i.titleTab === "ETIQUETAGEM"
      ? { ...i, statusTab: true }
      : { ...i, statubsTab: false }
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.etiquetagem || {
    id: 0,
    table_preferences:
      "id,name,experimentAmount,tagsToPrint,tagsPrinted,totalTags,status,action",
  };

  const tableRef = useRef<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );

  const [experimentGroup, setExperimentGroup] = useState<IExperimentsGroup[]>(
    () => allExperimentGroup
  );
  const [currentPage, setCurrentPage] = useState<number>(pageBeforeEdit);
  const [orderList, setOrder] = useState<number>(1);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: "CamposGerenciados[]",
      title: "Nome do grupo de exp.",
      value: "name",
      defaultChecked: () => camposGerenciados.includes("name"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Qtde. exp.",
      value: "experimentAmount",
      defaultChecked: () => camposGerenciados.includes("experimentAmount"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Etiq. a imprimir",
      value: "tagsToPrint",
      defaultChecked: () => camposGerenciados.includes("tagsToPrint"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Etiq. impressas",
      value: "tagsPrinted",
      defaultChecked: () => camposGerenciados.includes("tagsPrinted"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Total etiquetas",
      value: "totalTags",
      defaultChecked: () => camposGerenciados.includes("totalTags"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Status grupo exp.",
      value: "status",
      defaultChecked: () => camposGerenciados.includes("status"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Ação",
      value: "action",
      defaultChecked: () => camposGerenciados.includes("action"),
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<IGenerateProps[]>(() => [
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

  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>("");
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const router = useRouter();
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  // const take: number = itensPerPage;
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  // const pathExtra=`skip=${currentPage * Number(take)}&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}`;

  const formik = useFormik<IExperimentGroupFilter>({
    initialValues: {
      // filterExperimentGroup: checkValue('filterExperimentGroup'),
      // filterQuantityExperiment: checkValue('filterQuantityExperiment'),
      // filterTagsToPrint: checkValue('filterTagsToPrint'),
      // filterTagsPrinted: checkValue('filterTagsPrinted'),
      // filterTotalTags: checkValue('filterTotalTags'),
      // filterStatus: checkValue('filterStatus'),
      filterExperimentGroup: checkValue("filterExperimentGroup"),
      filterQuantityExperiment: checkValue("filterQuantityExperiment"),
      filterTagsToPrint: checkValue("filterTagsToPrint"),
      filterTagsPrinted: checkValue("filterTagsPrinted"),
      filterTotalTags: checkValue("filterTotalTags"),
      filterStatus: checkValue("filterStatus"),
      filterQtdExpFrom: checkValue("filterQtdExpFrom"),
      filterQtdExpTo: checkValue("filterQtdExpTo"),
      filterTotalEtiqImprimirFrom: checkValue("filterTotalEtiqImprimirFrom"),
      filterTotalEtiqImprimirTo: checkValue("filterTotalEtiqImprimirTo"),
      filterTotalEtiqImpressasFrom: checkValue("filterTotalEtiqImpressasFrom"),
      filterTotalEtiqImpressasTo: checkValue("filterTotalEtiqImpressasTo"),
      filterTotalEtiqFrom: checkValue("filterTotalEtiqFrom"),
      filterTotalEtiqTo: checkValue("filterTotalEtiqTo"),
    },
    onSubmit: async ({
      filterExperimentGroup,
      filterQuantityExperiment,
      filterTagsToPrint,
      filterTagsPrinted,
      filterTotalTags,
      filterQtdExpTo,
      filterQtdExpFrom,
      filterTotalEtiqImprimirTo,
      filterTotalEtiqImprimirFrom,
      filterTotalEtiqImpressasTo,
      filterTotalEtiqImpressasFrom,
      filterTotalEtiqTo,
      filterTotalEtiqFrom,
      //filterStatus,
    }) => {
      const filterStatus = statusFilterSelected?.join(",");
      const parametersFilter = `&filterExperimentGroup=${filterExperimentGroup}&filterQuantityExperiment=${filterQuantityExperiment}&filterTagsToPrint=${filterTagsToPrint}&filterTagsPrinted=${filterTagsPrinted}&filterTotalTags=${filterTotalTags}&filterStatus=${filterStatus}&safraId=${safraId}&id_culture=${cultureId}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
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
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any) {
    setCookies("filterBeforeEdit", parametersFilter);
    setCookies("filterBeforeEditTypeOrder", typeOrder);
    setCookies("filterBeforeEditOrderBy", orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    // setCookies("filtersParams", parametersFilter);

    setCookies("filtersParams", parametersFilter);
    await experimentGroupService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400) {
        setExperimentGroup(response.response);
        setTotalItems(response.total);
      }
    });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  useEffect(() => {
    setCookies("filtersParams-test-rr", filtersParams);
  }, [filtersParams]);

  async function handleOrder(column: string, order: number): Promise<void> {
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

    // await experimentGroupService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then(({ status, response }) => {
    //     if (status === 200) {
    //       setExperimentGroup(response);
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

    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
  }

  async function deleteItem(id: number) {
    const { status, message } = await experimentGroupService.deleted(id);
    if (status === 200) {
      router.reload();
    } else {
      Swal.fire({
        html: message,
        width: "800",
      });
    }
  }

  function headerTableFactory(name: string, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button
            type="button"
            className="font-medium text-gray-900"
            onClick={() => handleOrder(title, orderList)}
          >
            {name}
          </button>
        </div>
      ),
      field: title,
      sorting: true,
    };
  }

  function actionTableFactory() {
    return {
      title: <div className="flex items-center">Ação</div>,
      field: "action",
      sorting: false,
      width: 0,
      render: (rowData: any) => (
        <div className="flex gap-2">
          <div className="h-10 w-10">
            <Button
              title={`Editar ${rowData.name}`}
              type="button"
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                setCookies("filterBeforeEditTypeOrder", typeOrder);
                setCookies("filterBeforeEditOrderBy", orderBy);
                setCookies("filtersParams", filtersParams);
                setCookies("lastPage", "atualizar");
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
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                setCookies("filterBeforeEditTypeOrder", typeOrder);
                setCookies("filterBeforeEditOrderBy", orderBy);
                setCookies("filtersParams", filtersParams);
                setCookies("lastPage", "parcelas");
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
              title={`Excluir ${rowData.name}`}
              type="button"
              onClick={() => deleteItem(rowData.id)}
              rounder="rounded-full"
              bgColor="bg-red-600"
              textColor="white"
              icon={<BsTrashFill size={20} />}
            />
          </div>
        </div>
      ),
    };
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(",");
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item) => {
      if (columnOrder[item] === "name") {
        tableFields.push(headerTableFactory("Nome do grupo de exp.", "name"));
      }
      if (columnOrder[item] === "experimentAmount") {
        tableFields.push(headerTableFactory("Qtde. exp.", "experimentAmount"));
      }
      if (columnOrder[item] === "tagsToPrint") {
        tableFields.push(headerTableFactory("Etiq. a imprimir", "tagsToPrint"));
      }
      if (columnOrder[item] === "tagsPrinted") {
        tableFields.push(headerTableFactory("Etiq. impressas", "tagsPrinted"));
      }
      if (columnOrder[item] === "totalTags") {
        tableFields.push(headerTableFactory("Total etiquetas", "totalTags"));
      }
      if (columnOrder[item] === "status") {
        tableFields.push(headerTableFactory("Status grupo exp.", "status"));
      }
      if (columnOrder[item] === "action") {
        tableFields.push(actionTableFactory());
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
      localStorage.setItem("user", JSON.stringify(userLogado));
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
    await experimentGroupService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workBook,
          workSheet,
          "Grupos do experimento"
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
        XLSX.writeFile(workBook, "Grupos do experimento.xlsx");
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

  function filterFieldFactory(
    title: string,
    name: string,
    small: boolean = false
  ) {
    return (
      <div className={small ? "h-7 w-1/3 ml-2" : "h-7 w-1/2 ml-2"}>
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

  async function handleSubmit(event: any) {
    event.preventDefault();
    const inputValue: any = (
      document.getElementById("inputName") as HTMLInputElement
    )?.value;
    const { response }: IReturnObject = await experimentGroupService.getAll({
      filterExperimentGroup: inputValue,
      safraId,
    });
    if (response?.length > 0) {
      Swal.fire("Grupo já cadastrado");
    } else {
      const { status: createStatus, response: newGroup }: IReturnObject =
        await experimentGroupService.create({
          name: inputValue,
          safraId: Number(safraId),
          createdBy: userLogado.id,
        });
      if (createStatus !== 200) {
        Swal.fire("Erro ao cadastrar grupo");
      } else {
        router.push(`/operacao/etiquetagem/atualizar?id=${newGroup.id}`);
      }
    }
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de grupos de experimento</title>
      </Head>

      <ModalComponent
        isOpen={isOpenModal}
        onPress={(e: any) => handleSubmit(e)}
        onCancel={() => setIsOpenModal(false)}
      >
        <form className="flex flex-col">
          <div className="flex flex-col px-4  justify-between">
            <header className="flex flex-col mt-2">
              <h2 className="mb-2 text-blue-600 text-xl font-medium">
                Cadastrar grupo
              </h2>
            </header>
            <h2 style={{ marginTop: 25, marginBottom: 5 }}>Nome do grupo</h2>
            <Input
              type="text"
              placeholder="Nome do grupo"
              id="inputName"
              name="inputName"
            />
          </div>
        </form>
      </ModalComponent>

      {/* <Modal
        isOpen={isOpenModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => { setIsOpenModal(!isOpenModal); }}
        overlayClassName="fixed inset-0 flex bg-transparent justify-center items-center bg-white/75"
        className="flex
          flex-col
          w-full
          h-64
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
              setIsOpenModal(!isOpenModal);
            }}
          >
            <RiCloseCircleFill size={35} className="fill-red-600 hover:fill-red-800" />
          </button>

          <div className="flex flex-col px-4  justify-between">
            <header className="flex flex-col mt-2">
              <h2 className="mb-2 text-blue-600 text-xl font-medium">Cadastrar grupo</h2>
            </header>
            <div style={{ height: 25 }} />
            <h2 style={{ marginBottom: 5 }}>Nome do grupo</h2>
            <Input
              type="text"
              placeholder="Nome do grupo"
              id="inputName"
              name="inputName"
            />
          </div>
          <div className="flex justify-end py-11">
            <div className="h-10 w-40">
              <button
                type="submit"
                value="Cadastrar"
                className="w-full h-full ml-auto mt-6 bg-green-600 text-white px-8 rounded-lg text-sm hover:bg-green-800"
                onClick={(e) => handleSubmit(e)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </form>
      </Modal> */}

      <Content contentHeader={tabsEtiquetagemMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar grupos">
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
                    "filterExperimentGroup",
                    "Nome do grupo de exp."
                  )}
                  {/* {filterFieldFactory(
                    "filterQuantityExperiment",
                    "Qtde. exp.",
                    true
                  )} */}
                  {/* {filterFieldFactory(
                    "filterTagsToPrint",
                    "Total etiq. a imprimir"
                  )} */}
                  {/* {filterFieldFactory(
                    "filterTagsPrinted",
                    "Total etiq. impressas"
                  )} */}
                  {/* {filterFieldFactory(
                    "filterTotalTags",
                    "Total etiquetas",
                    true
                  )} */}
                  {/* {filterFieldFactory("filterStatus", "Status", true)} */}

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Qtde. exp.
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterQtdExpFrom"
                        name="filterQtdExpFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterQtdExpTo"
                        name="filterQtdExpTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Etiq. a imprimir
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterTotalEtiqImprimirFrom"
                        name="filterTotalEtiqImprimirFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterTotalEtiqImprimirTo"
                        name="filterTotalEtiqImprimirTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Etiq. impressas
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterTotalEtiqImpressasFrom"
                        name="filterTotalEtiqImpressasFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterTotalEtiqImpressasTo"
                        name="filterTotalEtiqImpressasTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Total etiquetas
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterTotalEtiqFrom"
                        name="filterTotalEtiqFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterTotalEtiqTo"
                        name="filterTotalEtiqTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status grupo exp.
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
                      onClick={() => {}}
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
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={experimentGroup}
              options={{
                selectionProps: (rowData: any) =>
                  isOpenModal && { disabled: rowData },
                showTitle: false,
                headerStyle: {
                  zIndex: 0,
                },
                rowStyle: { background: "#f9fafb", height: 35 },
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
                        onClick={() => {
                          setIsOpenModal(!isOpenModal);
                        }}
                        bgColor="bg-blue-600"
                      />
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
                        onClick={() => setCurrentPage(currentPage - 1)}
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
  // const PreferencesControllers = new UserPreferenceController();
  // const itensPerPage = await (
  //   await PreferencesControllers.getConfigGerais()
  // )?.response[0]?.itens_per_page;

  // const pageBeforeEdit = req.cookies.pageBeforeEdit
  //   ? req.cookies.pageBeforeEdit
  //   : 0;

  // const { token } = req.cookies;
  // const { safraId } = req.cookies;
  // const { cultureId } = req.cookies;
  // const { publicRuntimeConfig } = getConfig();
  // const baseUrlExperimentGroup = `${publicRuntimeConfig.apiUrl}/experiment-group`;

  // const filterBeforeEdit = req.cookies.filterBeforeEdit
  //   ? req.cookies.filterBeforeEdit
  //   : `safraId=${safraId}&id_culture=${cultureId}`;
  // //Last page
  // const lastPageServer = req.cookies.lastPage
  // ? req.cookies.lastPage
  // : "No";

  // // if(lastPageServer == undefined || lastPageServer == "No"){
  // //   removeCookies('filterBeforeEdit', { req, res });
  // //   removeCookies('pageBeforeEdit', { req, res });
  // //   removeCookies("filterBeforeEditTypeOrder", { req, res });
  // //   removeCookies("filterBeforeEditOrderBy", { req, res });
  // //   removeCookies("lastPage", { req, res });
  // // }

  // //RR
  // const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
  // ? req.cookies.filterBeforeEditTypeOrder
  // : "desc";

  // //RR
  // const orderByserver = req.cookies.filterBeforeEditOrderBy
  // ? req.cookies.filterBeforeEditOrderBy
  // : "name";

  // const filterApplication = req.cookies.filterBeforeEdit || `safraId=${safraId}&id_culture=${cultureId}`;

  // // removeCookies('filterBeforeEdit', { req, res });
  // // removeCookies('pageBeforeEdit', { req, res });

  // // //RR
  // // removeCookies("filterBeforeEditTypeOrder", { req, res });
  // // removeCookies("filterBeforeEditOrderBy", { req, res });
  // // removeCookies("lastPage", { req, res });

  // const param = `&safraId=${safraId}&id_culture=${cultureId}`;

  // const urlExperimentGroup: any = new URL(baseUrlExperimentGroup);
  // urlExperimentGroup.search = new URLSearchParams(param).toString();
  // const requestOptions = {
  //   method: 'GET',
  //   credentials: 'include',
  //   headers: { Authorization: `Bearer ${token}` },
  // } as RequestInit | undefined;

  // const { response: allExperimentGroup = [], total: totalItems = 0 } = await fetch(
  //   urlExperimentGroup.toString(),
  //   requestOptions,
  // ).then((response) => response.json());

  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage =
    (await (
      await PreferencesControllers.getConfigGerais()
    )?.response[0]?.itens_per_page) ?? 10;

  const { token } = req.cookies;
  const { cultureId } = req.cookies;

  const idSafra = Number(req.cookies.safraId);
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `idSafra=${idSafra}&id_culture=${cultureId}`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `idSafra=${idSafra}&id_culture=${cultureId}`;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : "No";

  // if(lastPageServer == undefined || lastPageServer == "No"){
  //   removeCookies('filterBeforeEdit', { req, res });
  //   removeCookies('pageBeforeEdit', { req, res });
  //   removeCookies("filterBeforeEditTypeOrder", { req, res });
  //   removeCookies("filterBeforeEditOrderBy", { req, res });
  //   removeCookies("lastPage", { req, res });
  // }

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "desc";

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "";

  // removeCookies('filterBeforeEdit', { req, res });
  // removeCookies('pageBeforeEdit', { req, res });
  // removeCookies("filterBeforeEditTypeOrder", { req, res });
  // removeCookies("filterBeforeEditOrderBy", { req, res });
  // removeCookies("lastPage", { req, res });

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
  const { response: allExperimentGroup, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions
  ).then((response) => response.json());

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
      cultureId,
      orderByserver,
      typeOrderServer,
    },
  };
};
