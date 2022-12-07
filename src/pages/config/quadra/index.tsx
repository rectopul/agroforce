/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
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
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiSettingsFill } from "react-icons/ri";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { removeCookies, setCookies } from "cookies-next";
import experiment from "src/pages/api/experiment";
import { number } from "yup";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ButtonToogleConfirmation,
} from "../../../components";
import { quadraService, userPreferencesService } from "../../../services";
import { UserPreferenceController } from "../../../controllers/user-preference.controller";
import ITabs from "../../../shared/utils/dropdown";
import { tableGlobalFunctions } from "../../../helpers";
import headerTableFactoryGlobal from "../../../shared/utils/headerTableFactory";
import ComponentLoading from "../../../components/Loading";

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

  tabsDropDowns.map((tab) =>
    tab.titleTab === "QUADRAS"
      ? (tab.statusTab = true)
      : (tab.statusTab = false)
  );

  const tableRef = useRef<any>(null);

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.quadras || {
    id: 0,
    table_preferences:
      "id,local_preparo,cod_quadra,linha_p,esquema,allocation,action",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const router = useRouter();
  const [quadra, setQuadra] = useState<IQuadra[]>(() => quadras);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit)
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    {
      name: "CamposGerenciados[]",
      title: "Local preparo",
      value: "local_preparo",
    },
    {
      name: "CamposGerenciados[]",
      title: "Código quadra",
      value: "cod_quadra",
    },
    { name: "CamposGerenciados[]", title: "Linha P", value: "linha_p" },
    { name: "CamposGerenciados[]", title: "Esquema", value: "esquema" },
    { name: "CamposGerenciados[]", title: "Status", value: "allocation" },
    { name: "CamposGerenciados[]", title: "Ação", value: "action" },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>("");
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>("");
  const filtersStatusItem = [
    { id: 2, name: "Todos" },
    { id: 1, name: "Ativos" },
    { id: 0, name: "Inativos" },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split("");

  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const [fieldOrder, setFieldOrder] = useState<any>(null);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterSearch: checkValue("filterSearch"),
      filterSchema: checkValue("filterSchema"),
      filterPTo: checkValue("filterPTo"),
      filterPFrom: checkValue("filterPFrom"),
      filterPreparation: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterStatus,
      filterSearch,
      filterSchema,
      filterPTo,
      filterPFrom,
      filterPreparation,
    }) => {
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

    await quadraService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setQuadra(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
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

  async function handleStatus(data: IQuadra): Promise<void> {
    const parametersFilter = `filterStatus=${1}&cod_quadra=${
      data.cod_quadra
    }&local_preparo=${data.local.name_local_culture}`;

    await quadraService.getAll(parametersFilter).then(async ({ status }) => {
      if (status === 200 && data.status === 1) {
        Swal.fire("Foco já ativado");
        return;
      }
      await quadraService.update({
        id: data?.id,
        status: data.status === 0 ? 1 : 0,
      });

      handlePagination();
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
    name: any
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

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: "id",
      width: 0,
      sorting: false,
      render: () =>
        colorStar === "#eba417" ? (
          <div className="h-9 flex">
            <div>
              <button
                type="button"
                className="w-full h-full flex items-center justify-center border-0"
                onClick={() => setColorStar("")}
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
                onClick={() => setColorStar("#eba417")}
              >
                <AiTwotoneStar size={20} />
              </button>
            </div>
          </div>
        ),
    };
  }

  function statusHeaderFactory() {
    return {
      title: "Ação",
      field: "action",
      sorting: false,
      searchable: false,
      filterPlaceholder: "Filtrar por status",
      render: (rowData: IQuadra) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              bgColor="bg-blue-600"
              textColor="white"
              title={`Editar ${rowData.cod_quadra}`}
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                setCookies("filterBeforeEditTypeOrder", typeOrder);
                setCookies("filterBeforeEditOrderBy", orderBy);
                setCookies("filtersParams", filtersParams);
                setCookies("lastPage", "atualizar");
                router.push(`/config/quadra/atualizar?id=${rowData.id}`);
              }}
            />
          </div>
          <div style={{ width: 5 }} />
          <ButtonToogleConfirmation
            data={rowData}
            text="a quadra"
            keyName="name"
            onPress={handleStatus}
          />
        </div>
      ),
    };
  }

  function columnsOrder(columnsCampos: any): any {
    const columnCampos: any = columnsCampos.split(",");
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((_, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === "cod_quadra") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Código quadra",
            title: "cod_quadra",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "comp_p") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Comp P",
            title: "comp_p",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "linha_p") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Linha P",
            title: "linha_p",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "esquema") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Esquema",
            title: "esquema",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "divisor") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Divisor",
            title: "divisor",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "local_plantio") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Local plantio",
            title: "local_plantio",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "local_preparo") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Local preparo",
            title: "local.name_local_culture",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "allocation") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Status",
            title: "allocation",
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
      localStorage.setItem("user", JSON.stringify(userLogado));
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
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    setLoading(true);
    await quadraService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((row: any) => {
          if (row.status === 0) {
            row.status = "Inativo" as any;
          } else {
            row.status = "Ativo" as any;
          }

          row.COD_QUADRA = row.cod_quadra;
          row.LOCAL = row.local?.name_local_culture;
          row.ESQUEMA = row.esquema;
          row.LARG_Q = row.larg_q;
          row.COMP_P = row.comp_p;
          row.LINHA_P = row.linha_p;
          row.COMP_C = row.comp_c;
          row.TIRO_FIXO = row.tiro_fixo;
          row.DISPARO_FIXO = row.disparo_fixo;
          row.STATUS_ALOCADO = row.allocation;
          row.STATUS = row.status;

          delete row.cod_quadra;
          delete row.local;
          delete row.esquema;
          delete row.larg_q;
          delete row.comp_p;
          delete row.linha_p;
          delete row.q;
          delete row.comp_c;
          delete row.tiro_fixo;
          delete row.disparo_fixo;
          delete row.status;
          delete row.id;
          delete row.safra;
          delete row.tableData;
          delete row.local_plantio;
          delete row.allocation;
          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "quadra");

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
        XLSX.writeFile(workBook, "Quadras.xlsx");
      } else {
        Swal.fire(response);
      }
    });
    setLoading(false);
  };

  const [idArray, setIdArray] = useState([]);

  const downloadExcelSintetico = async (): Promise<void> => {
    await quadraService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const experimentArray: any = [];
        const object: any = {};
        const experimentObject: any = {
          id: "",
          safra: "",
          experimentName: "",
          npei: "",
          npef: "",
          ntparcelas: "",
          locpreparo: "",
          qm: "",
        };

        const data = response.map((tow: any) => {
          tow.cod = tow.cod_quadra;
          // tow.local = tow.name_local;
          experimentObject.locpreparo = tow.local.name_local_culture;
          object.qm = tow.cod;
          // const localMap = tow.local;

          const allocatedMap = tow.AllocatedExperiment.map((a: any) => {
            experimentObject.npei = a.npei;
            experimentObject.npef = a.npef;
            experimentObject.ntparcelas = a.parcelas;
            experimentArray.push(experimentObject);
            return a;
          });
          const experimentMap = tow.experiment.map((e: any) => {
            object.id = e.id;
            experimentObject.safra = e.safra.safraName;
            experimentObject.experimentName = e.experimentName;
            return e;
          });
          experimentArray.push(object);
          experimentArray.push(experimentObject);
          return tow;
        });
        const newData = experimentArray.map((row: any) => {
          row.ID_EXPERIMENTO = row.id;
          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "quadra");

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
        XLSX.writeFile(workBook, "Sintética.xlsx");
      } else {
        Swal.fire(response);
      }
    });
  };

  const dowloadExcelAnalytics = async () => {
    await quadraService
      .getAll(`${filter}&allocation=${"IMPORTADO"}`)
      .then(({ status, response }) => {
        if (status === 200) {
          const lines: any = [];
          response.forEach(async (block: any) => {
            await block.experiment?.forEach(async (experiment: any) => {
              await experiment.experiment_genotipe?.forEach(
                (parcela: any, index: number) => {
                  lines.push({
                    ID_EXPERIMENTO: experiment?.id,
                    SAFRA: experiment?.safra?.safraName,
                    EXPE: experiment?.experimentName,
                    NPEI: parcela?.npe,
                    NPEF: parcela?.npe,
                    NTPARC: 1,
                    LOCALPREP: block.local?.name_local_culture,
                    QM: block.cod_quadra,
                    SEQ: block.AllocatedExperiment[index]?.seq,
                    FOCO: experiment?.assay_list?.foco?.name,
                    ENSAIO: experiment?.assay_list?.type_assay?.name,
                    GLI: experiment?.assay_list?.gli,
                    CODLOCAL_EXP: experiment?.local?.name_local_culture,
                    EPOCA: experiment?.period,
                    TECNOLOGIA: experiment?.assay_list?.tecnologia?.name,
                    BGM: experiment?.bgm,
                    REP: experiment?.repetitionsNumber,
                    STATUS_EXP: experiment?.status,
                    CÓDIGO_GENOTIPO: parcela?.genotipo?.name_genotipo,
                    STATUS_PARCELA: parcela?.status,
                  });
                }
              );
            });
          });

          const workSheet = XLSX.utils.json_to_sheet(lines);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, "quadra");

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
          XLSX.writeFile(workBook, "Analítico.xlsx");
        } else {
          Swal.fire("Nenhuma quadra alocada");
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
    //   parametersFilter = `${parametersFilter}&${filter}&${cultureId}`;
    // }
    // await quadraService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setQuadra(response.response);
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
  }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem de quadras</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar quadras">
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
                      defaultValue={checkValue("filterSearch")}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Linha P
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="int"
                        placeholder="De"
                        id="filterPFrom"
                        name="filterPFrom"
                        onChange={formik.handleChange}
                        defaultValue={checkValue("filterPFrom")}
                      />
                      <Input
                        type="int"
                        placeholder="Até"
                        id="filterPTo"
                        name="filterPTo"
                        onChange={formik.handleChange}
                        defaultValue={checkValue("filterPTo")}
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
                      defaultValue={checkValue("filterSchema")}
                    />
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
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
              data={quadra}
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
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage =
    (await (
      await PreferencesControllers.getConfigGerais()
    )?.response[0]?.itens_per_page) ?? 15;

  const { token } = req.cookies;
  const cultureId: number = Number(req.cookies.cultureId);
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
  }

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : "filterStatus=1";

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "desc";

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "local.name_local_culture";

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : "filterStatus=1";

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });

  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("lastPage", { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: "GET",
    credentials: "include",
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
