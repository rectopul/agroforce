import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from "react-icons/ai";
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { Router, useRouter } from "next/router";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiSettingsFill } from "react-icons/ri";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { removeCookies, setCookies } from "cookies-next";
import { npeService, userPreferencesService } from "../../../services";
import { UserPreferenceController } from "../../../controllers/user-preference.controller";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
} from "../../../components";
import * as ITabs from "../../../shared/utils/dropdown";
import { tableGlobalFunctions } from "../../../helpers";
import headerTableFactoryGlobal from "../../../shared/utils/headerTableFactory";
import ComponentLoading from "../../../components/Loading";

interface INpeProps {
  id: number | any;
  local: number;
  safra: number;
  foco: number;
  type_assay: number;
  ogm: number;
  epoca: number;
  npei: number;
  npef: number;
  consumedQT: number;
  prox_npe: number;
  status?: number;
  created_by: number;
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
  filterNpeTo: string | any;
  filterNpeFrom: string | any;
  filterNpeFinalTo: string | any;
  filterNpeFinalFrom: string | any;
  filterGrpTo: string | any;
  filterGrpFrom: string | any;
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
  filterBeforeEdit: object | any;
  filterApplication: object | any;
  id_safra: number | any;
  cultureId: number | any;
  orderByserver: string | any;
  typeOrderServer: string | any;
}

export default function Listagem({
  allNpe,
  itensPerPage,
  filterApplication,
  totalItems,
  filterBeforeEdit,
  id_safra,
  cultureId,
  orderByserver,
  typeOrderServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsOperationMenu = tabsOperation.map((i) =>
    i.titleTab === "AMBIENTE"
      ? { ...i, statusTab: true }
      : { ...i, statubsTab: false }
  );

  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.npe || {
    id: 0,
    table_preferences:
      "id,local,safra,foco,ensaio,tecnologia,epoca,npei,npef,grp",
  };

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const [filtersParams, setFiltersParams] = useState<any>(filterBeforeEdit); // Set filter Parameter
  const [npe, setNPE] = useState(allNpe);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [selectedNPE, setSelectedNPE] = useState<INpeProps[]>([]);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: "CamposGerenciados[]",
      title: "Lugar de cultura",
      value: "local",
      defaultChecked: () => camposGerenciados.includes("local"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Safra ",
      value: "safra",
      defaultChecked: () => camposGerenciados.includes("safra"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Foco ",
      value: "foco",
      defaultChecked: () => camposGerenciados.includes("foco"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Ensaio ",
      value: "ensaio",
      defaultChecked: () => camposGerenciados.includes("ensaio"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Tecnologia",
      value: "tecnologia",
      defaultChecked: () => camposGerenciados.includes("tecnologia"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Época",
      value: "epoca",
      defaultChecked: () => camposGerenciados.includes("epoca"),
    },
    {
      name: "CamposGerenciados[]",
      title: "NPE Inicial ",
      value: "npei_i",
      defaultChecked: () => camposGerenciados.includes("npei_i"),
    },
    {
      name: "CamposGerenciados[]",
      title: "NPE Final",
      value: "npef",
      defaultChecked: () => camposGerenciados.includes("npef"),
    },
    {
      name: "CamposGerenciados[]",
      title: "GRP",
      value: "grp",
      defaultChecked: () => camposGerenciados.includes("grp"),
    },
  ]);

  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;
  // const pathExtra = `skip=${currentPage * Number(take)}&take=${take}`;

  const filters = [
    { id: 2, name: "Todos" },
    { id: 1, name: "Ativos" },
    { id: 0, name: "Inativos" },
    { id: 3, name: "Sorteado" },
  ];

  const filterStatus = filterApplication.split("");

  const formik = useFormik<any>({
    initialValues: {
      filterStatus: filterStatus[13],
      filterLocal: checkValue("filterLocal"),
      filterSafra: checkValue("filterSafra"),
      filterFoco: checkValue("filterFoco"),
      filterEnsaio: checkValue("filterEnsaio"),
      filterTecnologia: checkValue("filterTecnologia"),
      filterEpoca: checkValue("filterEpoca"),
      filterNPE: checkValue("filterNPE"),
      filterCodTecnologia: checkValue("filterCodTecnologia"),
      orderBy: "",
      typeOrder: "",
      filterNpeTo: checkValue("filterNpeTo"),
      filterNpeFrom: checkValue("filterNpeFrom"),
      filterNpeFinalTo: checkValue("filterNpeFinalTo"),
      filterNpeFinalFrom: checkValue("filterNpeFinalFrom"),
      filterGrpTo: checkValue("filterGrpTo"),
      filterGrpFrom: checkValue("filterGrpFrom"),
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
      filterGrpTo,
      filterGrpFrom,
    }) => {
      // &filterSafra=${filterSafra}
      const parametersFilter = `filterStatus=${filterStatus}&filterCodTecnologia=${filterCodTecnologia}&filterGrpTo=${filterGrpTo}&filterGrpFrom=${filterGrpFrom}&filterLocal=${filterLocal}&filterFoco=${filterFoco}&filterEnsaio=${filterEnsaio}&filterTecnologia=${filterTecnologia}&filterEpoca=${filterEpoca}&filterNPE=${filterNPE}&filterNpeTo=${filterNpeTo}&filterNpeFrom=${filterNpeFrom}&filterNpeFinalTo=${filterNpeFinalTo}&filterNpeFinalFrom=${filterNpeFinalFrom}&safraId=${id_safra}`;
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

    await npeService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setNPE(response.response);
          setTotalItems(response.total);
          tableRef?.current?.dataManager?.changePageSize(
            response.total >= take ? take : response.total
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

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(",");
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item: any) => {
      if (columnCampos[item] === "local") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Lugar de cultura",
            title: "local.name_local_culture",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "safra") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Safra",
            title: "safra.safraName",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "foco") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Foco",
            title: "foco.name",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "ensaio") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Ensaio",
            title: "type_assay.name",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "tecnologia") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Tecnologia",
            title: "tecnologia.cod_tec",
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.tecnologia.cod_tec} ${rowData.tecnologia.name}`}
              </div>
            ),
          })
        );
      }
      if (columnCampos[item] === "epoca") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Época",
            title: "epoca",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "npei_i") {
        tableFields.push(
          headerTableFactoryGlobal({
            type: "int",
            name: "NPE Inicial",
            title: "npei_i",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "npef") {
        tableFields.push(
          headerTableFactoryGlobal({
            type: "int",
            name: "NPE Final",
            title: "npef",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "grp") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "GRP",
            title: "group.group",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
    });
    return tableFields;
  }

  const columns = colums(camposGerenciados);

  async function handleOrder(
    column: string,
    order: string | any,
    name: any
  ): Promise<void> {
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
      localStorage.setItem("user", JSON.stringify(userLogado));
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
    if (!filterApplication.includes("paramSelect")) {
      filterApplication += `&paramSelect=${camposGerenciados}`;
    }

    await npeService.getAll(filter).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: any) => {
          if (row.status === 0) {
            row.status = "Inativo";
          } else {
            row.status = "Ativo";
          }
          row.LOCAL = row.local.name_local_culture;
          row.SAFRA = row.safra.safraName;
          row.FOCO = row.foco.name;
          row.TIPO_ENSAIO = row.type_assay.name;
          row.TECNOLOGIA = row.tecnologia.name;
          row.ÉPOCA = row.epoca;
          row.NPEI = row.npei;
          row.NPEF = row.npef;
          row.NPEQT = row.npeQT;
          row.NEXT_NPE = row.nextNPE;
          row.STATUS = row.status;

          delete row.local;
          delete row.safra;
          delete row.foco;
          delete row.type_assay;
          delete row.tecnologia;
          delete row.epoca;
          delete row.npei;
          delete row.npef;
          delete row.npeQT;
          delete row.nextNPE;
          delete row.status;
          delete row.avatar;
          delete row.id;

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "npe");

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
        XLSX.writeFile(workBook, "NPE.xlsx");
      } else {
        setLoading(false);
        Swal.fire("Não existem registros para serem exportados, favor checar.");
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

  function handleSelectionRow(data: any) {
    const selectedRow = data?.map((e: any) => ({
      ...e,
      tableData: { id: e.tableData.id, checked: false },
    }));
    setSelectedNPE(selectedRow);
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  const handleRowSelection = (rowData: any) => {
    if (selectedNPE?.includes(rowData)) {
      rowData.tableData.checked = false;
      setSelectedNPE(selectedNPE.filter((item: any) => item != rowData));
    } else {
      rowData.tableData.checked = true;
      setSelectedNPE([...selectedNPE, rowData]);
    }
  };

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem dos Ambientes</title>
      </Head>
      <Content contentHeader={tabsOperationMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar ambientes">
            <div className="w-full flex gap-0">
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
                  pb-6
                "
                >
                  {/* <div className="h-6 w-1/3 ml-1">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatus[13]}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div> */}

                  {filterFieldFactory("filterLocal", "Lugar de cultura")}

                  {filterFieldFactory("filterFoco", "Foco")}

                  {filterFieldFactory("filterEnsaio", "Ensaio")}

                  {filterFieldFactory("filterCodTecnologia", "Cod Tec")}

                  {filterFieldFactory("filterTecnologia", "Nome Tec")}
                </div>

                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pt-4
                "
                >
                  {filterFieldFactory("filterEpoca", "Época")}

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NPE Inicial
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterNpeFrom"
                        name="filterNpeFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNpeTo"
                        name="filterNpeTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NPE Final
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterNpeFinalFrom"
                        name="filterNpeFinalFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNpeFinalTo"
                        name="filterNpeFinalTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      GRP
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterGrpFrom"
                        name="filterGrpFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterGrpTo"
                        name="filterGrpTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 15 }}>
                    <Button
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

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={npe}
              onRowClick={(evt, selectedRow: any) => {
                handleRowSelection(selectedRow);
              }}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: "#f9fafb", height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
                selection: true,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
              }}
              onSelectionChange={handleSelectionRow}
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
                    <div className="h-12">
                      <Button
                        title="Gerar sorteio"
                        value="Gerar sorteio"
                        bgColor={
                          selectedNPE?.length <= 0
                            ? "bg-gray-400"
                            : "bg-blue-600"
                        }
                        textColor="white"
                        disabled={selectedNPE.length <= 0}
                        onClick={() => {
                          selectedNPE.sort((a, b) => a.prox_npe - b.prox_npe);
                          localStorage.setItem(
                            "selectedNPE",
                            JSON.stringify(selectedNPE)
                          );
                          setCookies('pageBeforeEdit', currentPage?.toString());
                          setCookies('filterBeforeEdit', filter);
                          setCookies('filterBeforeEditTypeOrder', typeOrder);
                          setCookies('filterBeforeEditOrderBy', orderBy);
                          setCookies('filtersParams', filtersParams);
                          setCookies('lastPage', 'atualizar');
                          setCookies('takeBeforeEdit', take);
                          setCookies('itensPage', itensPerPage);
                          router.push({
                            pathname: "/operacao/ambiente/experimento",
                          });
                        }}
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
                          title="Exportar planilha de NPE"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                        {/* <Button
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => { }}
                          href="npe/importar-planilha/config-planilha"
                        /> */}
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
                        onClick={() => setCurrentPage(currentPage - 10)}
                        bgColor="bg-blue-600"
                        textColor="white"
                        icon={<MdFirstPage size={18} />}
                        disabled={currentPage <= 1}
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
                        bgColor="bg-blue-600 testing"
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
  const id_safra: any = req.cookies.safraId;
  const { cultureId } = req.cookies;

  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : "No";

  if (lastPageServer == undefined || lastPageServer == "No") {
    removeCookies("filterBeforeEdit", { req, res });
    removeCookies("pageBeforeEdit", { req, res });
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("lastPage", { req, res });
  }

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `filterStatus=1&safraId=${id_safra}`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1&safraId=${id_safra}`;

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'asc';

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/npe`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1&safraId=${id_safra}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allNpe = [], total: totalItems = 0 } = await fetch(
    urlParameters.toString(),
    requestOptions
  ).then((response) => response.json());

  console.log('filterBeforeEdit');
  console.log(filterBeforeEdit);
  console.log('filterBeforeEdit');
  console.log(filterBeforeEdit);

  return {
    props: {
      allNpe,
      totalItems,
      itensPerPage,
      filterBeforeEdit,
      filterApplication,
      id_safra,
      cultureId,
      orderByserver,
      typeOrderServer,
    },
  };
};
