/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import MaterialTable from "material-table";
import { SiMicrogenetics } from "react-icons/si";
import Swal from "sweetalert2";

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
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import {
  userPreferencesService,
  dividersService,
  quadraService,
  experimentService,
  experimentGenotipeService,
} from "../../../services";
import { UserPreferenceController } from "../../../controllers/user-preference.controller";
import {
  Button,
  Content,
  Input,
  AccordionFilter,
  CheckBox,
} from "../../../components";
import * as ITabs from "../../../shared/utils/dropdown";

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allDividers: any[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  idQuadra: number;
  quadra: any;
}

const generatePropsDividers = [
  // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
  { name: "CamposGerenciados[]", title: "Divisor", value: "divisor" },
  { name: "CamposGerenciados[]", title: "Sem metro", value: "sem_metros" },
  { name: "CamposGerenciados[]", title: "T4I", value: "t4_i" },
  { name: "CamposGerenciados[]", title: "T4F", value: "t4_f" },
  { name: "CamposGerenciados[]", title: "DI", value: "di" },
  { name: "CamposGerenciados[]", title: "DF", value: "df" },
];

const generatePropsExperiments = [
  // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
  { name: "CamposGerenciados[]", title: "Seq", value: "seq" },
  {
    name: "CamposGerenciados[]",
    title: "Nome do experimento",
    value: "experimentName",
  },
  { name: "CamposGerenciados[]", title: "NPEI", value: "npe_i" },
  { name: "CamposGerenciados[]", title: "NPEF.", value: "npe_f" },
  { name: "CamposGerenciados[]", title: "Nº Parcelas", value: "parcelas" },
];

const generatePropsParcels = [
  // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
  {
    name: "CamposGerenciados[]",
    title: "Experimento",
    value: "experimentName",
  },
  { name: "CamposGerenciados[]", title: "Nome do Genótipo", value: "genotipo" },
  {
    name: "CamposGerenciados[]",
    title: "Status T",
    value: "status_t",
  },
  { name: "CamposGerenciados[]", title: "Fase", value: "fase" },
  { name: "CamposGerenciados[]", title: "Tecnologia", value: "tecnologia" },
  { name: "CamposGerenciados[]", title: "SC", value: "sc" },
  { name: "CamposGerenciados[]", title: "NPE", value: "npe" },
  { name: "CamposGerenciados[]", title: "NC", value: "nc" },
  { name: "CamposGerenciados[]", title: "R", value: "rep" },
  { name: "CamposGerenciados[]", title: "Plantio", value: "plantio" },
];

const generatePropsPlanting = [
  // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
  {
    name: "CamposGerenciados[]",
    title: "T4",
    value: "t4",
  },
  { name: "CamposGerenciados[]", title: "Tratorista", value: "tratorista" },
  {
    name: "CamposGerenciados[]",
    title: "Disparador A",
    value: "disp_a",
  },
  { name: "CamposGerenciados[]", title: "Disparador B", value: "disp_b" },
  { name: "CamposGerenciados[]", title: "Olheiro", value: "olheiro" },
  { name: "CamposGerenciados[]", title: "Responsável", value: "responsible" },
];

const dividersCampos = "id,divisor,sem_metros,t4_i,t4_f,di,df";
const experimentsCampos = "seq,experimentName,npe_i,npe_f,parcelas";
const parcelsCampos =
  "experimentName,genotipo,status_t,fase,tecnologia,sc,npe,nc,rep,plantio";
const plantingCampos = "t4,tratorista,disp_a,disp_b,olheiro,responsible";

export default function AtualizarQuadra({
  allDividers,
  totalItems,
  itensPerPage,
  filterApplication,
  idQuadra,
  quadra,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) =>
    tab.titleTab === "QUADRAS"
      ? (tab.statusTab = true)
      : (tab.statusTab = false)
  );

  const router = useRouter();

  const formik = useFormik<any>({
    initialValues: {
      id: quadra.id,
      cod_quadra: quadra.cod_quadra,
      id_culture: quadra.id_culture,
      id_safra: quadra.id_safra,
      local: quadra.local?.name_local_culture,
      local_plantio: quadra.local_plantio,
      larg_q: quadra.larg_q,
      comp_p: quadra.comp_p,
      linha_p: quadra.linha_p,
      comp_c: quadra.comp_c,
      esquema: quadra.esquema,
      tiro_fixo: quadra.tiro_fixo,
      disparo_fixo: quadra.disparo_fixo,
      q: quadra.q,
    },
    onSubmit: async (values) => {
      await quadraService
        .update({
          id: values.id,
          cod_quadra: values.cod_quadra,
          id_culture: values.id_culture,
          id_safra: values.id_safra,
          local: values.local.name_local_culture,
          local_plantio: values.local_plantio,
          larg_q: values.larg_q,
          comp_p: values.comp_p,
          linha_p: values.linha_p,
          comp_c: values.comp_c,
          esquema: values.esquema,
          q: values.q,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire("Quadra atualizado com sucesso!");
            router.back();
          } else {
            Swal.fire(response.message);
          }
        });
    },
  });

  const userLogado = JSON.parse(localStorage.getItem("user") as string);

  const [preferences, setPreferences] = useState<any>(
    userLogado.preferences.dividers || {
      id: 0,
      table_preferences: dividersCampos,
    }
  );
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(
    generatePropsDividers
  );
  const [table, setTable] = useState<string>("dividers");
  const [columns, setColumns] = useState([]);

  const [data, setData] = useState<any[]>(allDividers);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  function headerTableFactory(name: any, title: string) {
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
      sorting: false,
    };
  }

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: "id",
      width: 0,
      sorting: false,
      render: () =>
        colorStar === "#eba417" ? (
          <div className="h-10 flex">
            <div>
              <button
                type="button"
                className="w-full h-full flex items-center justify-center border-0"
                onClick={() => setColorStar("")}
              >
                <AiTwotoneStar size={25} color="#eba417" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-10 flex">
            <div>
              <button
                type="button"
                className="w-full h-full flex items-center justify-center border-0"
                onClick={() => setColorStar("#eba417")}
              >
                <AiTwotoneStar size={25} />
              </button>
            </div>
          </div>
        ),
    };
  }

  function updateFieldFactory(title: string, name: string) {
    return (
      <div className="w-2/4 h-7">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          style={{ background: "#e5e7eb" }}
          disabled
          required
          id={title}
          name={title}
          value={formik.values[title]}
        />
      </div>
    );
  }

  async function handleOrder(
    column: string,
    order: string | any
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
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_quadra=${idQuadra}`;
    } else {
      parametersFilter = filter;
    }

    switch (table) {
      case "dividers": {
        await dividersService
          .getAll(`${parametersFilter}&skip=0&take=${take}`)
          .then((response) => {
            if (response.status === 200) {
              setData(response.response);
            }
          });
        break;
      }
      case "experiments": {
        await experimentService
          .getAll(`${parametersFilter}&skip=0&take=${take}`)
          .then((response) => {
            if (response.status === 200) {
              setData(response.response);
            }
          });
        break;
      }
      case "parcels": {
        await experimentGenotipeService
          .getAll(`${parametersFilter}&skip=0&take=${take}`)
          .then((response) => {
            if (response.status === 200) {
              setData(response.response);
            }
          });
        break;
      }
      case "planting": {
        setData([]);
        break;
      }
      default: {
        await dividersService
          .getAll(`${parametersFilter}&skip=0&take=${take}`)
          .then((response) => {
            if (response.status === 200) {
              setData(response.response);
            }
          });
      }
    }

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
  }

  function dividersColumnsOrder(columnsCampos: string) {
    const columnCampos: string[] = columnsCampos.split(",");
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === "divisor") {
        tableFields.push(headerTableFactory("Divisor", "divisor"));
      }
      if (columnCampos[index] === "sem_metros") {
        tableFields.push(headerTableFactory("Sem metro", "sem_metros"));
      }
      if (columnCampos[index] === "t4_i") {
        tableFields.push(headerTableFactory("T4I", "t4_i"));
      }
      if (columnCampos[index] === "t4_f") {
        tableFields.push(headerTableFactory("T4F", "t4_f"));
      }
      if (columnCampos[index] === "di") {
        tableFields.push(headerTableFactory("DI", "di"));
      }
      if (columnCampos[index] === "df") {
        tableFields.push(headerTableFactory("DF", "df"));
      }
    });
    return tableFields;
  }

  function experimentsColumnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(",");
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      if (columnOrder[index] === "seq") {
        tableFields.push(headerTableFactory("SEQ", "seq"));
      }
      if (columnOrder[index] === "experimentName") {
        tableFields.push(
          headerTableFactory("Experimento Planejado", "experimentName")
        );
      }
      if (columnOrder[index] === "npe_i") {
        tableFields.push(headerTableFactory("NPEI", "npe_i"));
      }
      if (columnOrder[index] === "npe_f") {
        tableFields.push(headerTableFactory("NPEF", "npe_f"));
      }
      if (columnOrder[index] === "parcelas") {
        tableFields.push(headerTableFactory("Nº Parcelas", "parcelas"));
      }
    });
    return tableFields;
  }

  function parcelsColumnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(",");
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      if (columnOrder[index] === "experimentName") {
        tableFields.push(headerTableFactory("Experimento", "experimentName"));
      }
      if (columnOrder[index] === "genotipo") {
        tableFields.push(headerTableFactory("Nome do Genótipo", "genotipo"));
      }
      if (columnOrder[index] === "status_t") {
        tableFields.push(headerTableFactory("Status T", "status_t"));
      }
      if (columnOrder[index] === "fase") {
        tableFields.push(headerTableFactory("Fase", "fase"));
      }
      if (columnOrder[index] === "tecnologia") {
        tableFields.push(headerTableFactory("Tecnologia", "tecnologia"));
      }
      if (columnOrder[index] === "sc") {
        tableFields.push(headerTableFactory("SC", "sc"));
      }
      if (columnOrder[index] === "npe") {
        tableFields.push(headerTableFactory("NPE", "npe"));
      }
      if (columnOrder[index] === "nc") {
        tableFields.push(headerTableFactory("NC", "nc"));
      }
      if (columnOrder[index] === "rep") {
        tableFields.push(headerTableFactory("R", "rep"));
      }
      if (columnOrder[index] === "plantio") {
        tableFields.push(headerTableFactory("Plantio", "plantio"));
      }
    });
    return tableFields;
  }

  function plantingColumnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(",");
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      if (columnOrder[index] === "t4") {
        tableFields.push(headerTableFactory("T4", "t4"));
      }
      if (columnOrder[index] === "tratorista") {
        tableFields.push(headerTableFactory("Tratorista", "tratorista"));
      }
      if (columnOrder[index] === "disp_a") {
        tableFields.push(headerTableFactory("Disparador A", "disp_a"));
      }
      if (columnOrder[index] === "disp_b") {
        tableFields.push(headerTableFactory("Disparador B", "disp_b"));
      }
      if (columnOrder[index] === "olheiro") {
        tableFields.push(headerTableFactory("Olheiro", "olheiro"));
      }
      if (columnOrder[index] === "responsible") {
        tableFields.push(headerTableFactory("Responsável", "responsible"));
      }
    });
    return tableFields;
  }

  function generateColumns() {
    switch (table) {
      case "dividers": {
        return dividersColumnsOrder(camposGerenciados);
      }
      case "experiments": {
        return experimentsColumnsOrder(camposGerenciados);
      }
      case "parcels": {
        return parcelsColumnsOrder(camposGerenciados);
      }
      case "planting": {
        return plantingColumnsOrder(camposGerenciados);
      }
      default: {
        return dividersColumnsOrder(camposGerenciados);
      }
    }
  }

  function generateProps() {
    switch (table) {
      case "dividers": {
        return setGeneratesProps(generatePropsDividers);
      }
      case "experiments": {
        return setGeneratesProps(generatePropsExperiments);
      }
      case "parcels": {
        return setGeneratesProps(generatePropsParcels);
      }
      case "planting": {
        return setGeneratesProps(generatePropsPlanting);
      }
      default: {
        return setGeneratesProps(generatePropsDividers);
      }
    }
  }

  function onChangeTable(table: string) {
    const preferencesDividers = userLogado.preferences.dividers || {
      id: 0,
      table_preferences: dividersCampos,
    };
    const preferencesExperiments = userLogado.preferences.experiments || {
      id: 0,
      table_preferences: experimentsCampos,
    };
    const preferencesParcels = userLogado.preferences.parcels || {
      id: 0,
      table_preferences: parcelsCampos,
    };
    const preferencesPlanting = userLogado.preferences.planting || {
      id: 0,
      table_preferences: plantingCampos,
    };

    switch (table) {
      case "dividers":
        setPreferences(preferencesDividers);
        setCamposGerenciados(preferencesDividers.table_preferences);
        break;
      case "experiments":
        setPreferences(preferencesExperiments);
        setCamposGerenciados(preferencesExperiments.table_preferences);
        break;
      case "parcels":
        setPreferences(preferencesParcels);
        setCamposGerenciados(preferencesParcels.table_preferences);
        break;
      case "planting":
        setPreferences(preferencesPlanting);
        setCamposGerenciados(preferencesPlanting.table_preferences);
        break;
      default:
        break;
    }

    setTable(table);
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

    let module_id: any = null;
    switch (table) {
      case "dividers":
        module_id = 18;
        break;
      case "experiments":
        module_id = 18;
        break;
      case "parcels":
        module_id = 18;
        break;
      case "planting":
        module_id = 18;
        break;
      default:
        break;
    }

    //envia campos para api
    //salvar o preferences no localstorage
    //salva no estado preferences
    //set os campos gerenciados

    if (preferences.id === 0) {
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id,
        })
        .then((response) => {
          userLogado.preferences[table] = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };

          //preferences.id = response.response.id;
          setPreferences({
            id: response.response.id,
            table_preferences: campos,
          });
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      setPreferences({ ...preferences, table_preferences: campos });

      userLogado.preferences[table] = {
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

    //setPreferences({ ...preferences, table_preferences: campos });
    // localStorage.setItem(
    //   "user",
    //   JSON.stringify({
    //     ...userLogado,
    //     preferences: {
    //       ...userLogado.preferences,
    //       [table]: {
    //         ...preferences,
    //         table_preferences: campos,
    //       },
    //     },
    //   })
    // );

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
    switch (table) {
      case "dividers": {
        const { response } = await dividersService.getAll(filterApplication);
        const newData = response.map((row: any) => {
          delete row.id;
          delete row.quadra;

          return {
            ...row,
            status: row.status === 0 ? "Inativo" : "Ativo",
          };
        });

        console.log({ response });

        return generateSpreadSheet(newData);
      }
      case "experiments": {
        return generateSpreadSheet([]);
      }
      case "parcels": {
        return generateSpreadSheet([]);
      }
      case "planting": {
        return generateSpreadSheet([]);
      }
      default: {
        return;
      }
    }

    // await dividersService
    //   .getAll(filterApplication)
    //   .then(({ status, response }) => {
    //     if (status === 200) {
    //       const newData = response.map((row: any) => {
    //         if (row.status === 0) {
    //           row.status = "Inativo";
    //         } else {
    //           row.status = "Ativo";
    //         }

    //         delete row.id;
    //         delete row.quadra;

    //         return row;
    //       });

    //       const workSheet = XLSX.utils.json_to_sheet(newData);
    //       const workBook = XLSX.utils.book_new();
    //       XLSX.utils.book_append_sheet(workBook, workSheet, "dividers");

    //       // Buffer
    //       XLSX.write(workBook, {
    //         bookType: "xlsx", // xlsx
    //         type: "buffer",
    //       });
    //       // Binary
    //       XLSX.write(workBook, {
    //         bookType: "xlsx", // xlsx
    //         type: "binary",
    //       });
    //       // Download
    //       XLSX.writeFile(workBook, "divisores.xlsx");
    //     }
    //   });
  };

  function generateSpreadSheet(data: any) {
    if (data?.length > 0) {
      const workSheet = XLSX.utils.json_to_sheet(data);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, table);

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
      XLSX.writeFile(workBook, `${table}.xlsx`);
    } else {
      Swal.fire("Não existe nenhum registro para gerar a planilha.");
    }
  }

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

    switch (table) {
      case "dividers": {
        await dividersService.getAll(parametersFilter).then((response) => {
          if (response.status === 200) {
            setData(response.response);
          }
          setTotalItems(response.total);
        });
        break;
      }
      case "experiments": {
        await experimentService.getAll(parametersFilter).then((response) => {
          if (response.status === 200) {
            setData(response.response);
          }
          setTotalItems(response.total);
        });
        break;
      }
      case "parcels": {
        await experimentGenotipeService
          .getAll(parametersFilter)
          .then((response) => {
            if (response.status === 200) {
              setData(response.response);
            }
            setTotalItems(response.total);
          });
        break;
      }
      case "planting": {
        setData([]);
        //setTotalItems(response.total);
        break;
      }
      default: {
        await dividersService.getAll(parametersFilter).then((response) => {
          if (response.status === 200) {
            setData(response.response);
          }
        });
      }
    }
  }

  useEffect(() => {
    setColumns(generateColumns());
    generateProps();
  }, [table, camposGerenciados]);

  useEffect(() => {
    handlePagination();
  }, [table]);

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Atualizar quadra</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-4"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-xl">Atualizar quadra</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-1">
            {updateFieldFactory("cod_quadra", "Código Quadra")}

            <div className="w-2/4 h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Local Preparo
              </label>
              <Input
                style={{ background: "#e5e7eb" }}
                disabled
                required
                id="local"
                name="local"
                value={quadra.local?.name_local_culture}
              />
            </div>

            {updateFieldFactory("esquema", "Esquema")}

            {updateFieldFactory("local_plantio", "Local realizado")}

            {updateFieldFactory("q", "Q")}

            {updateFieldFactory("cruza", "Status quadra")}
          </div>
          <div className="w-full flex justify-between items-start gap-5 mt-8">
            {updateFieldFactory("larg_q", "Largura Q")}

            {updateFieldFactory("comp_p", "Comp P.")}

            {updateFieldFactory("linha_p", "Linha P.")}

            {updateFieldFactory("comp_c", "Comp C.")}

            {updateFieldFactory("tiro_fixo", "Tiro fixo")}

            {updateFieldFactory("disparo_fixo", "Disparo fixo")}

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
              <div className="w-40">
                <Button
                  // type="submit"
                  value="Mapa"
                  bgColor="bg-blue-600"
                  disabled
                  textColor="white"
                  icon={<SiMicrogenetics size={18} />}
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
        </form>

        <main className="w-full flex flex-col items-start gap-8">
          <div style={{ marginTop: "1%" }} className="w-full h-full">
            <MaterialTable
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={data}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: "#f9fafb", height: 35 },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
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
                    <div
                      className="flex
                    items-center"
                    >
                      <div className="h-12">
                        <Button
                          title="DIVISORES"
                          value="DIVISORES"
                          bgColor={
                            table === "dividers" ? "bg-blue-600" : "bg-gray-600"
                          }
                          textColor="white"
                          onClick={() => onChangeTable("dividers")}
                          // icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>
                      <div style={{ width: 10 }} />
                      <div className="h-12">
                        <Button
                          title="EXPERIMENTOS"
                          value="EXPERIMENTOS"
                          bgColor={
                            table === "experiments"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                          }
                          textColor="white"
                          onClick={() => onChangeTable("experiments")}
                          // icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>
                      <div style={{ width: 10 }} />
                      <div className="h-12">
                        <Button
                          title="PARCELAS"
                          value="PARCELAS"
                          bgColor={
                            table === "parcels" ? "bg-blue-600" : "bg-gray-600"
                          }
                          textColor="white"
                          onClick={() => onChangeTable("parcels")}
                          // icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>
                      <div style={{ width: 10 }} />
                      <div className="h-12">
                        <Button
                          title="PLANTIO"
                          value="PLANTIO"
                          bgColor={
                            table === "planting" ? "bg-blue-600" : "bg-gray-600"
                          }
                          textColor="white"
                          onClick={() => onChangeTable("planting")}
                          // icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>
                    </div>
                    <div className="h-12" />
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

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de divisores"
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
                        onClick={() => setCurrentPage(pages)}
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage =
    (await (
      await PreferencesControllers.getConfigGerais()
    )?.response[0]?.itens_per_page) ?? 10;

  const { token } = context.req.cookies;

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;
  const requestOptions: RequestInit | undefined = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiQuadra = await fetch(
    `${baseUrl}/${context.query.id}`,
    requestOptions
  );
  const quadra = await apiQuadra.json();

  const baseUrlDividers = `${publicRuntimeConfig.apiUrl}/dividers`;

  const param = `skip=0&take=${itensPerPage}`;
  const urlParameters: any = new URL(baseUrlDividers);
  urlParameters.search = new URLSearchParams(param).toString();
  const idQuadra = Number(context.query.id);

  const filterApplication = `id_quadra=${idQuadra}`;

  const { response: allDividers, total: totalItems } = await fetch(
    `${baseUrlDividers}?id_quadra=${idQuadra}`,
    requestOptions
  ).then((response) => response.json());

  return {
    props: {
      quadra,
      allDividers,
      totalItems,
      itensPerPage,
      filterApplication,
      idQuadra,
    },
  };
};
