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
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { RiCloseCircleFill, RiFileExcel2Line } from "react-icons/ri";
import { IoReloadSharp } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import { HiArrowNarrowRight } from "react-icons/hi";
import { ITreatment } from "../../../interfaces/listas/ensaio/genotype-treatment.interface";
import { IGenerateProps } from "../../../interfaces/shared/generate-props.interface";

import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  FieldItemsPerPage,
  SelectMultiple,
} from "../../../components";
import LoadingComponent from "../../../components/Loading";
import { UserPreferenceController } from "../../../controllers/user-preference.controller";
import {
  experimentGenotipeService,
  experimentGroupService,
  userPreferencesService,
} from "../../../services";
import * as ITabs from "../../../shared/utils/dropdown";
import { IReturnObject } from "../../../interfaces/shared/Import.interface";
import { fetchWrapper } from "../../../helpers";

interface IFilter {
  filterFoco: string;
  filterTypeAssay: string;
  filterNameTec: string;
  filterCodTec: string;
  filterGli: string;
  filterExperimentName: string;
  filterLocal: string;
  filterRepetitionFrom: string | any;
  filterRepetitionTo: string | any;
  filterStatus: string;
  filterNtFrom: string;
  filterNtTo: string;
  filterNpeFrom: string;
  filterNpeTo: string;
  filterGenotypeName: string;
  filterNca: string;
  orderBy: object | any;
  typeOrder: object | any;
}

export default function Listagem({
  allExperiments,
  totalItems,
  experimentGroup,
  itensPerPage,
  experimentGroupId,
  filterApplication,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const router = useRouter();

  const tabsEtiquetagemMenu = tabsOperation.map((i: any) =>
    i.titleTab === "ETIQUETAGEM"
      ? { ...i, statusTab: true }
      : { ...i, statusTab: false }
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.parcelas || {
    id: 0,
    table_preferences:
      "id,foco,type_assay,tecnologia,gli,experiment,local,repetitionsNumber,status,NT,npe,name_genotipo,nca,action",
  };

  const tableRef = useRef<any>(null);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const [parcelas, setParcelas] = useState<ITreatment[] | any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tableMessage, setMessage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(1);
  const [afterFilter, setAfterFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number>(0);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: "CamposGerenciados[]",
      title: "Foco",
      value: "foco",
      defaultChecked: () => camposGerenciados.includes("foco"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Ensaio",
      value: "type_assay",
      defaultChecked: () => camposGerenciados.includes("type_assay"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome da tecnologia",
      value: "tecnologia",
      defaultChecked: () => camposGerenciados.includes("tecnologia"),
    },
    {
      name: "CamposGerenciados[]",
      title: "GLI",
      value: "gli",
      defaultChecked: () => camposGerenciados.includes("gli"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome experimento",
      value: "experiment",
      defaultChecked: () => camposGerenciados.includes("experiment"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Lugar de plantio",
      value: "local",
      defaultChecked: () => camposGerenciados.includes("local"),
    },
    {
      name: "CamposGerenciados[]",
      title: "REP.",
      value: "rep",
      defaultChecked: () => camposGerenciados.includes("rep"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Status da parcela",
      value: "status",
      defaultChecked: () => camposGerenciados.includes("status"),
    },
    {
      name: "CamposGerenciados[]",
      title: "NT",
      value: "nt",
      defaultChecked: () => camposGerenciados.includes("nt"),
    },
    {
      name: "CamposGerenciados[]",
      title: "NPE",
      value: "npe",
      defaultChecked: () => camposGerenciados.includes("npe"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome do genótipo",
      value: "name_genotipo",
      defaultChecked: () => camposGerenciados.includes("name_genotipo"),
    },
    {
      name: "CamposGerenciados[]",
      title: "NCA",
      value: "nca",
      defaultChecked: () => camposGerenciados.includes("nca"),
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
      title: "IMPRESSO",
      value: "importado",
      defaultChecked: () => camposGerenciados.includes("importado"),
    },
    {
      name: "StatusCheckbox",
      title: "EM ETIQUETAGEM",
      value: "sorteado",
      defaultChecked: () => camposGerenciados.includes("sorteado"),
    },
  ]);
  const [statusFilterSelected, setStatusFilterSelected] = useState<any>([]);

  const [statusImp, setStatusImp] = useState<IGenerateProps[]>(() => [
    {
      name: "StatusCheckbox",
      title: "EM ETIQUETAGEM ",
      value: "etiquetagem",
      defaultChecked: () => camposGerenciados.includes("etiquetagem"),
    },
    {
      name: "StatusCheckbox",
      title: "ETIQUETAGEM FINALIZADA",
      value: "finalizada",
      defaultChecked: () => camposGerenciados.includes("finalizada"),
    },
  ]);
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [validateNcaOne, setValidateNcaOne] = useState<string>("bg-gray-300");
  const [validateNcaTwo, setValidateNcaTwo] = useState<string>("bg-gray-300");
  const [totalMatch, setTotalMatch] = useState<number>(0);
  const [genotypeNameOne, setGenotypeNameOne] = useState<string>("");
  const [genotypeNameTwo, setGenotypeNameTwo] = useState<string>("");
  const [ncaOne, setNcaOne] = useState<string>("");
  const [ncaTwo, setNcaTwo] = useState<string>("");
  const [groupNameOne, setGroupNameOne] = useState<string>("");
  const [groupNameTwo, setGroupNameTwo] = useState<string>("");
  const [doubleVerify, setDoubleVerify] = useState<boolean>(false);
  const [parcelasToPrint, setParcelasToPrint] = useState<any>([]);
  const [dismiss, setDismiss] = useState<boolean>();
  const [writeOffId, setWriteOffId] = useState<number>();
  const [writeOffNca, setWriteOffNca] = useState<number>();
  const [rowsSelected, setRowsSelected] = useState([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterFoco: "",
      filterTypeAssay: "",
      filterNameTec: "",
      filterCodTec: "",
      filterGli: "",
      filterExperimentName: "",
      filterLocal: "",
      filterRepetitionFrom: "",
      filterRepetitionTo: "",
      filterStatus: "",
      filterNtFrom: "",
      filterNtTo: "",
      filterNpeFrom: "",
      filterNpeTo: "",
      filterGenotypeName: "",
      filterNca: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterNameTec,
      filterCodTec,
      filterGli,
      filterExperimentName,
      filterLocal,
      filterRepetitionFrom,
      filterRepetitionTo,
      //filterStatus,
      filterNtFrom,
      filterNtTo,
      filterNpeFrom,
      filterNpeTo,
      filterGenotypeName,
      filterNca,
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
      //const filterStatusT = selecionados.substr(0, selecionados.length - 1);
      const filterStatus = statusFilterSelected?.join(",");

      // Call filter with there parameter
      const parametersFilter = await fetchWrapper.handleFilterParameter(
        "parcelas",
        filterFoco,
        filterTypeAssay,
        filterNameTec,
        filterCodTec,
        filterGli,
        filterExperimentName,
        filterLocal,
        filterRepetitionFrom,
        filterRepetitionTo,
        filterStatus,
        filterNtFrom,
        filterNtTo,
        filterNpeFrom,
        filterNpeTo,
        filterGenotypeName,
        filterNca,
        idSafra
      );

      setFiltersParams(parametersFilter);
      setFilter(parametersFilter);
      setCookies("filterBeforeEdit", filter);

      await experimentGenotipeService
        .getAll(`${parametersFilter}&skip=0&take=${take}`)
        .then((response) => {
          setFilter(parametersFilter);
          setParcelas(response.response);
          setTotalItems(response.total);
          setCurrentPage(0);
          tableRef.current.dataManager.changePageSize(
            itemsTotal >= take ? take : itemsTotal
          );
        });
    },
  });

  async function handleOrder(column: string, order: number): Promise<void> {
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

    await experimentGenotipeService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then(({ status, response }: IReturnObject) => {
        if (status === 200) {
          setParcelas(response);
        }
      });

    if (orderList === 2) {
      setOrder(0);
    } else {
      setOrder(orderList + 1);
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

  function tecnologiaHeaderFactory(name: string, title: string) {
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
      field: "tecnologia",
      width: 0,
      sorting: true,
      render: (rowData: any) => (
        <div className="h-10 flex">
          <div>
            {`${rowData.tecnologia.cod_tec} ${rowData.tecnologia.name}`}
          </div>
        </div>
      ),
    };
  }

  function actionTableFactory() {
    return {
      title: <div className="flex items-center">Ação</div>,
      field: "action",
      sorting: false,
      width: 0,
      render: (rowData: any) =>
        rowData.status === "IMPRESSO" ? (
          <div className="h-7 flex">
            <div className="h-7" />
            <div style={{ width: 5 }} />
            <div>
              <Button
                icon={<HiArrowNarrowRight size={14} />}
                title={`Dar baixa na parcela ${rowData.id}`}
                onClick={() => {
                  setDismiss(true);
                  setIsOpenModal(true);
                  setWriteOffNca(rowData.nca);
                  setWriteOffId(rowData.id);
                }}
                bgColor="bg-red-600"
                textColor="white"
              />
            </div>
          </div>
        ) : (
          <div />
        ),
    };
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(",");
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((index: any) => {
      if (columnOrder[index] === "foco") {
        tableFields.push(headerTableFactory("Foco", "foco.name"));
      }
      if (columnOrder[index] === "type_assay") {
        tableFields.push(headerTableFactory("Ensaio", "type_assay.name"));
      }
      if (columnOrder[index] === "tecnologia") {
        tableFields.push(tecnologiaHeaderFactory("Tecnologia", "tecnologia"));
      }
      if (columnOrder[index] === "gli") {
        tableFields.push(headerTableFactory("GLI", "gli"));
      }
      if (columnOrder[index] === "experiment") {
        tableFields.push(
          headerTableFactory("Nome experimento", "experiment.experimentName")
        );
      }
      if (columnOrder[index] === "local") {
        tableFields.push(
          headerTableFactory(
            "Lugar de plantio",
            "experiment.local.name_local_culture"
          )
        );
      }
      if (columnOrder[index] === "rep") {
        tableFields.push(headerTableFactory("REP.", "rep"));
      }
      if (columnOrder[index] === "status") {
        tableFields.push(headerTableFactory("Status da parcela", "status"));
      }
      if (columnOrder[index] === "nt") {
        tableFields.push(headerTableFactory("NT.", "nt"));
      }
      if (columnOrder[index] === "npe") {
        tableFields.push(headerTableFactory("NPE.", "npe"));
      }
      if (columnOrder[index] === "name_genotipo") {
        tableFields.push(
          headerTableFactory("Nome do genótipo", "genotipo.name_genotipo")
        );
      }
      if (columnOrder[index] === "nca") {
        tableFields.push(headerTableFactory("NCA", "nca"));
      }
      if (columnOrder[index] === "action") {
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
          module_id: 30,
        })
        .then((response: any) => {
          userLogado.preferences.parcelas = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      userLogado.preferences.parcelas = {
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
    await experimentGenotipeService
      .getAll(filter)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((item: any) => {
            const newItem: any = {};

            newItem.FOCO = item.foco.name;
            newItem.ENSAIO = item.type_assay.name;
            newItem.TECNOLOGIA = item.tecnologia.name;
            newItem.GLI = item.gli;
            newItem.EXPERIMENTO = item.experiment.experimentName;
            newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
            newItem.REP = item.rep;
            newItem.STATUS = item.status;
            newItem.NT = item.nt;
            newItem.NPE = item.npe;
            newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
            newItem.NCA = item.nca;

            delete newItem.id;
            return newItem;
          });
          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, "Parcelas");

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
          XLSX.writeFile(workBook, "Parcelas.xlsx");
        }
      });
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
      parametersFilter = `skip=${skip}&take=${take}&experimentGroupId=${experimentGroupId}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}&experimentGroupId=${experimentGroupId}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await experimentGenotipeService
      .getAll(parametersFilter)
      .then(({ status, response }: IReturnObject) => {
        if (status === 200) {
          setParcelas(response);
        }
      });
  }

  function filterFieldFactory(title: string, name: string) {
    return (
      <div className="h-7 w-full ml-2">
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

  async function cleanState() {
    setDoubleVerify(false);
    setNcaOne("");
    setGenotypeNameOne("");
    setNcaTwo("");
    setGenotypeNameTwo("");
    setGroupNameOne("");
    setGroupNameTwo("");
    setTotalMatch(0);
    setDismiss(false);
    setWriteOffNca(0);
    setWriteOffId(0);
    setValidateNcaOne("bg-gray-300");
    setValidateNcaTwo("bg-gray-300");
    setParcelasToPrint([]);
    setIsOpenModal(!isOpenModal);
  }

  async function handleSubmit() {
    const inputCode: any = (
      document.getElementById("inputCode") as HTMLInputElement
    )?.value;
    let countNca = 0;
    parcelas.map((item: any) => {
      if (item.nca === inputCode) {
        setParcelasToPrint((current: any) => [...current, item.id]);
        countNca += 1;
        setGenotypeNameOne(item.name_genotipo);
        setNcaOne(item.nca);
      }
    });
    const { response } = await experimentGroupService.getAll({
      id: experimentGroupId,
    });
    let colorVerify = "";
    if (countNca > 0) {
      colorVerify = "bg-green-600";
      setGroupNameOne(response[0]?.name);
      setValidateNcaOne("bg-green-600");
    } else {
      colorVerify = "bg-red-600";
      setValidateNcaOne("bg-red-600");
    }
    setTotalMatch(countNca);
    if (colorVerify === "bg-green-600") {
      (document.getElementById("inputCode") as HTMLInputElement).value = "";
      setDoubleVerify(true);
    } else {
      setDoubleVerify(false);
    }
  }

  async function verifyAgain() {
    const inputCode: any = (
      document.getElementById("inputCode") as HTMLInputElement
    )?.value;
    let countNca = 0;
    let secondNca = "";

    parcelas.map((item: any) => {
      if (item.nca === inputCode) {
        setGenotypeNameTwo(item.name_genotipo);
        secondNca = item.nca;
        setNcaTwo(item.nca);
        countNca += 1;
      }
    });

    const { response } = await experimentGroupService.getAll({
      id: experimentGroupId,
    });

    let colorVerify = "";

    if (countNca > 0 && secondNca === ncaOne) {
      colorVerify = "bg-green-600";
      setGroupNameTwo(response[0]?.name);
      setValidateNcaTwo("bg-green-600");
    } else {
      colorVerify = "bg-red-600";
      setValidateNcaTwo("bg-red-600");
    }
    setTotalMatch(countNca);

    if (colorVerify === "bg-green-600") {
      setIsLoading(true);

      await experimentGenotipeService.update({
        idList: parcelasToPrint,
        status: "IMPRESSO",
        userId: userLogado.id,
      });
      cleanState();

      const parcelsByNCA = parcelas.filter((i: any) => i.nca === inputCode);
      const parcels = parcelsByNCA.map((i: any) => ({
        ...i,
        envelope: i?.type_assay?.envelope?.filter(
          (x: any) => x.id_safra === idSafra
        )[0]?.seeds,
      }));
      if (parcels) {
        localStorage.setItem("parcelasToPrint", JSON.stringify(parcels));
        router.push("imprimir");
      }
    }

    setIsLoading(false);
  }

  async function writeOff() {
    const inputCode: any = (
      document.getElementById("inputCode") as HTMLInputElement
    )?.value;
    if (!doubleVerify) {
      let colorVerify = "";
      if (inputCode === writeOffNca) {
        colorVerify = "bg-green-600";
        setValidateNcaOne("bg-green-600");
      } else {
        colorVerify = "bg-red-600";
        setValidateNcaOne("bg-red-600");
      }
      if (colorVerify === "bg-green-600") {
        (document.getElementById("inputCode") as HTMLInputElement).value = "";
        setDoubleVerify(true);
      } else {
        setDoubleVerify(false);
      }
    } else {
      let colorVerify = "";
      if (inputCode === writeOffNca) {
        colorVerify = "bg-green-600";
        setValidateNcaTwo("bg-green-600");
      } else {
        colorVerify = "bg-red-600";
        setValidateNcaTwo("bg-red-600");
      }
      if (colorVerify === "bg-green-600") {
        await experimentGenotipeService.update({
          idList: [writeOffId],
          status: "EM ETIQUETAGEM",
          userId: userLogado.id,
        });
        cleanState();
      }
    }
  }

  async function validateInput() {
    const inputCode: any = (
      document.getElementById("inputCode") as HTMLInputElement
    )?.value;
    if (inputCode.length === 12) {
      if (dismiss) {
        writeOff();
      } else if (doubleVerify) {
        verifyAgain();
      } else {
        handleSubmit();
      }
    }
  }

  async function reprint() {
    setIsLoading(true);

    const idList = rowsSelected.map((item: any) => item.id);

    await experimentGenotipeService.update({
      idList,
      status: "IMPRESSO",
      userId: userLogado.id,
    });

    const parcels = rowsSelected.map((i: any) => ({
      ...i,
      envelope: i?.type_assay?.envelope?.filter(
        (x: any) => x.id_safra == idSafra
      )[0]?.seeds,
    }));
    if (parcels?.length > 0) {
      localStorage.setItem("parcelasToPrint", JSON.stringify(parcels));
      router.push("imprimir");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de parcelas</title>
      </Head>

      {isLoading && (
        <LoadingComponent text="Gerando etiquetas para impressão..." />
      )}

      <Modal
        isOpen={isOpenModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onRequestClose={() => {
          setIsOpenModal(!isOpenModal);
        }}
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
          <header className="flex flex-col mt-2">
            <h2 className="mb-2 text-blue-600 text-xl font-medium">
              {`Total NCA encontrado(s) no grupo: ${totalMatch}`}
            </h2>
          </header>
          <button
            type="button"
            className="flex absolute top-4 right-3 justify-end"
            onClick={cleanState}
          >
            <RiCloseCircleFill
              size={35}
              className="fill-red-600 hover:fill-red-800"
            />
          </button>

          <div className="w-44">
            <Input
              type="text"
              placeholder="Código de barras (NCA)"
              disabled={
                validateNcaOne === "bg-red-600" ||
                validateNcaTwo === "bg-red-600"
              }
              id="inputCode"
              name="inputCode"
              maxLength={12}
              onChange={validateInput}
            />
          </div>

          <div className="flex flex-1 mt-5">
            <div className="flex flex-1">
              <div className="bg-blue-600 w-1 h-34 mr-2" />
              <div>
                <div className={`${validateNcaOne} h-6 w-20 rounded-xl mb-2`} />
                <p className="font-bold text-xs">NCA</p>
                <p className="h-4 font-bold text-xs text-blue-600">{ncaOne}</p>
                <p className="font-bold text-xs mt-1">Nome do genótipo</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {genotypeNameOne}
                </p>
                <p className="font-bold text-xs mt-1">Nome do grupo de exp.</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {groupNameOne}
                </p>
              </div>
            </div>
            <div className="flex flex-1">
              <div className="bg-blue-600 w-1 h-34 mr-2" />
              <div>
                <div className={`${validateNcaTwo} h-6 w-20 rounded-xl mb-2`} />
                <p className="font-bold text-xs">NCA</p>
                <p className="h-4 font-bold text-xs text-blue-600">{ncaTwo}</p>
                <p className="font-bold text-xs mt-1">Nome do genótipo</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {genotypeNameTwo}
                </p>
                <p className="font-bold text-xs mt-1">Nome do grupo de exp.</p>
                <p className="h-4 font-bold text-xs text-gray-300">
                  {groupNameTwo}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-end py-0">
            <div className="h-10 w-40">
              <Button
                title="Cancelar"
                value="Cancelar"
                textColor="white"
                disabled={
                  !(
                    validateNcaOne === "bg-red-600" ||
                    validateNcaTwo === "bg-red-600"
                  )
                }
                onClick={cleanState}
                bgColor="bg-red-600"
              />
            </div>
            <div className="h-10 w-40 ml-2">
              <Button
                title="Imprimir"
                value="Imprimir"
                textColor="white"
                onClick={() => router.push("imprimir")}
                bgColor="bg-green-600"
              />
            </div>
          </div> */}
        </form>
      </Modal>

      <Content contentHeader={tabsEtiquetagemMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar parcelas">
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
                  {filterFieldFactory("filterCod", "Cód. Tecnologia")}
                  {filterFieldFactory("filterTecnologia", "Nome Tecnologia")}
                  {filterFieldFactory("filterGli", "GLI")}
                  {filterFieldFactory(
                    "filterExperimentName",
                    "Nome experimento"
                  )}
                  {filterFieldFactory("filterLocal", "Lugar de plantio")}
                </div>

                <div
                  className="w-full h-full
                                        flex
                                        justify-center
                                        pb-2
                                        "
                >
                  <div className="h-6 w-full ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Repetição
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterRepetitionFrom"
                        name="filterRepetitionFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterRepetitionTo"
                        name="filterRepetitionTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-full ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status da parcela
                    </label>
                    <SelectMultiple
                      data={statusFilter.map((i: any) => i.title)}
                      values={statusFilterSelected}
                      onChange={(e: any) => setStatusFilterSelected(e)}
                    />
                  </div>

                  {/* <div className="h-10 w-full ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status da parcela
                    </label>
                    <AccordionFilter>
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                          {(provided) => (
                            <ul
                              className="w-1/2 h-full characters"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {statusImp.map((generate, index) => (
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
                    </AccordionFilter>
                  </div> */}

                  <div className="h-6 w-full ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NT
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterNtFrom"
                        name="filterNtFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNtTo"
                        name="filterNtTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="h-6 w-full ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      NPE
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterNpeFrom"
                        name="filterNpeFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterNpeTo"
                        name="filterNpeTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  {filterFieldFactory("filterGenotypeName", "Nome do genotipo")}
                  {filterFieldFactory("filterNca", "NCA")}

                  <FieldItemsPerPage
                    widthClass="w-full"
                    selected={take}
                    onChange={setTake}
                  />

                  <div style={{ width: 50 }} />
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
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={parcelas}
              options={{
                showSelectAllCheckbox: false,
                selection: true,
                selectionProps: (rowData: any) => ({
                  disabled: rowData.status !== "IMPRESSO",
                }),
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

                    <div className="h-12 w-32 ml-0">
                      <Button
                        title="Ação"
                        value="Ação"
                        textColor="white"
                        onClick={() =>
                          rowsSelected?.length > 0
                            ? reprint()
                            : setIsOpenModal(true)
                        }
                        bgColor="bg-blue-600"
                      />
                    </div>

                    <strong className="text-blue-600">
                      Qte. exp: {experimentGroup.experimentAmount}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq. a imp.: {experimentGroup.tagsToPrint}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq. imp.: {experimentGroup.tagsPrinted}
                    </strong>

                    <strong className="text-blue-600">
                      Total etiq.: {experimentGroup.totalTags}
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
    : "";
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;
  const { id: experimentGroupId } = query;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlParcelas = `${publicRuntimeConfig.apiUrl}/experiment-genotipe`;

  const filterApplication =
    req.cookies.filterBeforeEdit ||
    `&id_culture=${idCulture}&id_safra=${idSafra}`;
  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });

  const param = `&id_culture=${idCulture}&id_safra=${idSafra}&experimentGroupId=${experimentGroupId}`;

  const urlParametersParcelas: any = new URL(baseUrlParcelas);
  urlParametersParcelas.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allParcelas = [], total: totalItems = 0 } = await fetch(
    urlParametersParcelas.toString(),
    requestOptions
  ).then((response) => response.json());

  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/experiment-group`;
  const experimentGroup = await fetch(
    `${baseUrlShow}/${experimentGroupId}`,
    requestOptions
  ).then((response) => response.json());

  return {
    props: {
      allParcelas,
      totalItems,
      experimentGroupId,
      experimentGroup,
      itensPerPage,
      filterApplication,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
