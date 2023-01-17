/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { IoMdArrowBack } from "react-icons/io";
// import { TbArrowsDownUp } from 'react-icons/tb';
import { useRouter } from "next/router";

import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiArrowUpDownLine } from "react-icons/ri";

import { RequestInit } from "next/dist/server/web/spec-extension/request";
import Swal from "sweetalert2";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  ModalConfirmation,
  FieldItemsPerPage,
} from "../../../../../components";
import {
  loteService,
  replaceTreatmentService,
  userPreferencesService,
} from "../../../../../services";
import { UserPreferenceController } from "../../../../../controllers/user-preference.controller";
import ITabs from "../../../../../shared/utils/dropdown";
import { functionsUtils } from "../../../../../shared/utils/functionsUtils";
import headerTableFactoryGlobal from "../../../../../shared/utils/headerTableFactory";
import ComponentLoading from "../../../../../components/Loading";

interface IFilter {
  filterYear: string;
  filterYearFrom: string;
  filterYearTo: string;
  filterCodLoteFrom: string;
  filterCodLoteTo: string;
  filterNcaTo: string;
  filterNcaFrom: string;
  filterFase: string;
  filterPesoFrom: string;
  filterPesoTo: string;
  filterSeedsFrom: string;
  filterSeedsTo: string;
  filterPeso: string;
  filterSeeds: string;
  filterGenotipo: string;
  filterMainName: string;
  filterGmrFrom: string;
  filterGmrTo: string;
  filterBgmFrom: string;
  filterBgmTo: string;
  filterCodTec: string;
  filterNameTec: string;
  orderBy: string;
  typeOrder: string;
}

export interface LoteGenotipo {
  id: number;
  id_culture: number;
  genealogy: string;
  name: string;
  volume: number;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allLote: LoteGenotipo[];
  totalItems: number;
  idSafra: number;
  itensPerPage: number;
  filterApplication: object | any;
}

export default function Listagem({
  allLote,
  totalItems,
  idSafra,
  idCulture,
  itensPerPage,
  filterApplication,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const router = useRouter();
  const Router = router.query;

  const tableRef = useRef<any>(null);
  const tabsDropDowns = TabsDropDowns("listas");

  tabsDropDowns.map((tab) =>
    tab.titleTab ===
    (Router?.value === "experiment" ? "EXPERIMENTOS" : "ENSAIO")
      ? (tab.statusTab = true)
      : (tab.statusTab = false)
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const checkedTreatments = JSON.parse(
    localStorage.getItem("checkedTreatments") as string
  );
  const treatmentsOptionSelected = JSON.parse(
    localStorage.getItem("treatmentsOptionSelected") as string
  );

  const preferences = userLogado.preferences.lote || {
    id: 0,
    table_preferences:
      "safra,year,cod_lote,ncc,fase,peso,quant_sementes,name_genotipo,name_main,gmr,bgm,tecnologia,action",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );

  // const [lotes, setLotes] = useState<LoteGenotipo[]>(() => allLote);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameReplace, setNameReplace] = useState<any>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [orderList, setOrder] = useState<number>(1);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] =
    useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: "CamposGerenciados[]", title: "Safra", value: "safra" },
    { name: "CamposGerenciados[]", title: "Ano Lote", value: "year" },
    { name: "CamposGerenciados[]", title: "Cod Lote", value: "cod_lote" },
    { name: "CamposGerenciados[]", title: "NCA", value: "ncc" },
    { name: "CamposGerenciados[]", title: "Fase", value: "fase" },
    { name: "CamposGerenciados[]", title: "Peso", value: "peso" },
    {
      name: "CamposGerenciados[]",
      title: "Qtn sementes",
      value: "quant_sementes",
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome genotipo",
      value: "name_genotipo",
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome principal",
      value: "name_main",
    },
    { name: "CamposGerenciados[]", title: "GMR_Gen", value: "gmr" },
    { name: "CamposGerenciados[]", title: "BGM_Gen", value: "bgm" },
    {
      name: "CamposGerenciados[]",
      title: "Tec_Gen",
      value: "tecnologia",
    },
    { name: "CamposGerenciados[]", title: "Substituir", value: "action" },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
  const [fieldOrder, setFieldOrder] = useState<any>("");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isReplaceGenotypeId, setIsReplaceGenotypeId] = useState<any>(null);
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterYear: "",
      filterYearFrom: "",
      filterYearTo: "",
      filterCodLoteFrom: "",
      filterCodLoteTo: "",
      filterNcaTo: "",
      filterNcaFrom: "",
      filterFase: "",
      filterPesoFrom: "",
      filterPesoTo: "",
      filterSeedsFrom: "",
      filterSeedsTo: "",
      filterPeso: "",
      filterSeeds: "",
      filterGenotipo: "",
      filterMainName: "",
      filterGmrFrom: "",
      filterGmrTo: "",
      filterBgmFrom: "",
      filterBgmTo: "",
      filterCodTec: "",
      filterNameTec: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterYear,
      filterYearFrom,
      filterYearTo,
      filterCodLoteFrom,
      filterCodLoteTo,
      filterNcaFrom,
      filterNcaTo,
      filterFase,
      filterPesoFrom,
      filterPesoTo,
      filterSeedsFrom,
      filterSeedsTo,
      filterGenotipo,
      filterMainName,
      filterGmrFrom,
      filterGmrTo,
      filterBgmFrom,
      filterBgmTo,
      filterCodTec,
      filterNameTec,
    }) => {
      if (!functionsUtils?.isNumeric(filterSeedsFrom)) {
        return Swal.fire("O campo Qnt Sementes não pode ter ponto ou vírgula.");
      }
      if (!functionsUtils?.isNumeric(filterSeedsTo)) {
        return Swal.fire("O campo Qnt Sementes não pode ter ponto ou vírgula.");
      }

      const tempParams: any = [];
      if (treatmentsOptionSelected == "nca") {
        checkedTreatments.forEach((item: any) => {
          if (item.idGenotipo) {
            tempParams.push(item.idGenotipo);
          }
        });
      }
      const parametersFilter = `filterStatus=${1}&idCulture=${idCulture}&id_safra=${idSafra}&filterYear=${filterYear}&filterCodLoteTo=${filterCodLoteTo}&filterCodLoteFrom=${filterCodLoteFrom}&filterNcaFrom=${filterNcaFrom}&filterNcaTo=${filterNcaTo}&filterFase=${filterFase}&filterGenotipo=${filterGenotipo}&filterMainName=${filterMainName}&filterCodTec=${filterCodTec}&filterNameTec=${filterNameTec}&filterYearTo=${filterYearTo}&filterYearFrom=${filterYearFrom}&filterPesoTo=${filterPesoTo}&filterPesoFrom=${filterPesoFrom}&filterSeedsTo=${filterSeedsTo}&filterSeedsFrom=${filterSeedsFrom}&filterGmrTo=${filterGmrTo}&filterGmrFrom=${filterGmrFrom}&filterBgmTo=${filterBgmTo}&filterBgmFrom=${filterBgmFrom}`;

      setLoading(true);

      await replaceTreatmentService
        .getAll(
          `${parametersFilter}&skip=0&take=${take}&checkedTreatments=${tempParams}`
        )
        .then(({ response, total: allTotal }) => {
          setFilter(parametersFilter);
          setLotes(response);
          setTotalItems(allTotal);
          setCurrentPage(0);
          setLoading(false);
          tableRef?.current?.dataManager?.changePageSize(
            allTotal >= take ? take : allTotal
          );
          setLoading(false);
        })
        .catch((_) => {
          setLoading(false);
        });
    },
  });

  async function handleOrder(
    column: string,
    order: string | any,
    name: any
  ): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = "asc";
    } else if (order === 2) {
      typeOrder = "desc";
    } else {
      typeOrder = "";
    }
    setOrderBy(column);
    setOrderType(typeOrder);
    if (filter && typeof filter !== "undefined") {
      if (typeOrder !== "") {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== "") {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    } else {
      parametersFilter = filter;
    }

    await seperate(parametersFilter);

    // await loteService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setLotes(response.response);
    //     }
    //   });

    if (orderList === 2) {
      setOrder(0);
      setArrowOrder(<AiOutlineArrowDown />);
    } else {
      setOrder(orderList + 1);
      if (orderList === 1) {
        setArrowOrder(<AiOutlineArrowUp />);
      } else {
        setArrowOrder("");
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
    // setFieldOrder(columnG);
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
  //     sorting: false,
  //   };
  // }

  const { value } = router.query;

  async function openModal(id: number, genotipoName: string, nccName: number) {
    if (treatmentsOptionSelected === "genotipo") {
      setNameReplace(genotipoName);
    } else {
      setNameReplace(nccName);
    }
    setIsReplaceGenotypeId(id);
    setIsOpenModal(true);
  }

  async function replaceTreatmentButton(id: number) {
    const { message } = await replaceTreatmentService.replace({
      id,
      checkedTreatments,
      value,
    });
    Swal.fire({
      html: message,
      width: "800",
    });

    if (value == "ensaios") {
      router.back();
    } else if (value == "experiment") {
      router.push("/listas/experimentos/parcelas-experimento");
    }
  }

  function replaceFactory(name: string, title: string) {
    return {
      title: <div className="flex items-center">{name}</div>,
      field: title,
      sorting: false,
      width: 0,
      render: (rowData: any) => (
        <div className="h-10 w-10">
          <Button
            title="Substituir genótipo/nca"
            type="button"
            onClick={() => {
              openModal(
                rowData.id,
                rowData.genotipo.name_genotipo,
                rowData.ncc
              );
            }}
            rounder="rounded-full"
            bgColor="bg-green-600"
            textColor="white"
            icon={<RiArrowUpDownLine size={20} />}
          />
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
  //     field: "tecnologia",
  //     width: 0,
  //     sorting: true,
  //     render: (rowData: any) => (
  //       <div className="h-10 flex">
  //         <div>
  //           {`${rowData.genotipo.tecnologia.cod_tec} ${rowData.genotipo.tecnologia.name}`}
  //         </div>
  //       </div>
  //     ),
  //   };
  // }

  function columnsOrder(columnsCampos: string) {
    const columnCampos: string[] = columnsCampos.split(",");
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === "safra") {
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
      if (columnCampos[index] === "year") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Ano Lote",
            title: "year",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "cod_lote") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Cod Lote",
            title: "cod_lote",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "ncc") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "NCA",
            title: "ncc",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "fase") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Fase",
            title: "fase",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "peso") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Peso",
            title: "peso",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "quant_sementes") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Qtn sementes",
            title: "quant_sementes",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "name_genotipo") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Nome genótipo",
            title: "genotipo.name_genotipo",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "name_main") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Nome principal",
            title: "genotipo.name_main",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "gmr") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "GMR_Gen",
            title: "genotipo.gmr",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "bgm") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "BGM_Gen",
            title: "genotipo.bgm",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "tecnologia") {
        tableFields.push(
          headerTableFactoryGlobal({
            type: "int",
            name: "Tec_Gen",
            title: "genotipo.tecnologia.cod_tec",
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>
                {`${rowData.genotipo.tecnologia.cod_tec} ${rowData.genotipo.tecnologia.name}`}
              </div>
            ),
          })
        );
      }
      if (columnCampos[index] === "action") {
        tableFields.push(replaceFactory("Substituir", "action"));
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

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
          module_id: 12,
        })
        .then((response) => {
          userLogado.preferences.lote = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      userLogado.preferences.lote = {
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

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }

  async function handlePagination(page: any): Promise<void> {
    let parametersFilter;
    await seperate(parametersFilter, page);
  }

  async function seperate(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    //const skip = currentPage * Number(take);
    const skip = page * Number(take);

    const tempParams: any = [];

    if (treatmentsOptionSelected == "nca") {
      checkedTreatments.forEach((item: any) => {
        if (item.idGenotipo) {
          tempParams.push(item.idGenotipo);
        }
      });
    }

    if (orderType) {
      parametersFilter = `skip=${skip}&take=${take}&checkedTreatments=${tempParams}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}&checkedTreatments=${tempParams}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }

    await replaceTreatmentService
      .getAll(parametersFilter)
      .then(({ status, response, total }) => {
        if (status === 200) {
          setLotes(response);
          setTotalItems(total);
          setLoading(false);
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  function filterFieldFactory(title: any, name: any, small: boolean = false) {
    return (
      // <div className="h-10 w-full ml-2" style={small ? { maxWidth: 65 } : {}}>
      <div className={`h-10 w-${small ? "1/3" : "full"} ml-2`}>
        <label className="block text-gray-900 text-sm mb-1">{name}</label>
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

  useEffect(() => {
    handlePagination(0);
    handleTotalPages();
  }, []);

  return (
    <>
      <Head>
        <title>Listagem de substituição</title>
      </Head>

      {loading && <ComponentLoading text="" />}

      <ModalConfirmation
        isOpen={isOpenModal}
        text={`Você tem certeza de que quer substituir os ${checkedTreatments?.length} ${treatmentsOptionSelected}(s) selecionados por ${nameReplace}?`}
        onPress={() => replaceTreatmentButton(isReplaceGenotypeId)}
        onCancel={() => setIsOpenModal(false)}
      />

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main className="h-full w-full flex flex-col items-start gap-4 overflow-y-hidden">
          <AccordionFilter
            title={
              treatmentsOptionSelected === "genotipo"
                ? "Filtrar Genótipo/NCA"
                : "Filtrar lotes"
            }
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
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
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-2
                "
                >
                  <div className="h-10 w-1/3 ml-2">
                    <label className="block text-gray-900 text-sm mb-1">
                      Ano Lote
                    </label>
                    <Input
                      type="number"
                      placeholder="Ano Lote"
                      id="filterYear"
                      name="filterYear"
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Cod Lote
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterCodLoteFrom"
                        name="filterCodLoteFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterCodLoteTo"
                        name="filterCodLoteTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NCA
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterNcaFrom"
                        name="filterNcaFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNcaTo"
                        name="filterNcaTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  {filterFieldFactory("filterFase", "Fase", true)}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Peso
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterPesoFrom"
                        name="filterPesoFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterPesoTo"
                        name="filterPesoTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Qnt Sementes
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterSeedsFrom"
                        name="filterSeedsFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterSeedsTo"
                        name="filterSeedsTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  {filterFieldFactory("filterGenotipo", "Nome genótipo")}
                </div>

                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-0
                  mt-4
                "
                >
                  {filterFieldFactory("filterMainName", "Nome principal")}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      GMR_Gen
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterGmrFrom"
                        name="filterGmrFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterGmrTo"
                        name="filterGmrTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      BGM_Gen
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterBgmFrom"
                        name="filterBgmFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterBgmTo"
                        name="filterBgmTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  {filterFieldFactory("filterCodTec", "Cod tec_Gen")}

                  {filterFieldFactory("filterNameTec", "Nome tec_Gen")}

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div className="h-7 w-32 mt-6 ml-2">
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
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={lotes}
              options={{
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 460 : 320
                }px)`,
                headerStyle: {
                  zIndex: 1,
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
                    <div className="flex flex-col items-center justify-center h-7 w-32">
                      <Button
                        type="button"
                        value="Voltar"
                        bgColor="bg-red-600"
                        textColor="white"
                        icon={<IoMdArrowBack size={18} />}
                        onClick={() => {
                          router.back();
                        }}
                      />
                    </div>

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
                                                generate.value as string
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
                      {/* <div className="h-12 flex items-center justify-center w-full">
                        <Button icon={<RiSettingsFill size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { }} href="lote/importar-planilha/config-planilha" />
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
                        onClick={() => handlePagination(pages)}
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
  const itensPerPage =
    (await (
      await PreferencesControllers.getConfigGerais()
    )?.response[0]?.itens_per_page) ?? 10;

  const { token } = req.cookies;
  const { checked }: any = query;
  const idSafra = req.cookies.safraId;
  const idCulture = req.cookies.cultureId;

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });

  const param = `skip=0&take=${itensPerPage}&treatmentChecked=${checked}`;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/replace-treatment`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const filterApplication = `filterStatus=1&idCulture=${idCulture}`;
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allLote, total: totalItems } = await fetch(
    `${urlParameters}`,
    requestOptions
  ).then((response) => response.json());

  return {
    props: {
      allLote,
      totalItems,
      idSafra,
      idCulture,
      itensPerPage,
      filterApplication,
    },
  };
};
