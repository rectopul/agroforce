/* eslint-disable array-callback-return */
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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiCloseCircleFill, RiFileExcel2Line } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Modal from "react-modal";
import { BsTrashFill } from "react-icons/bs";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { experimentGenotipeService } from "src/services/experiment-genotipe.service";
import { setDatasets } from "react-chartjs-2/dist/utils";
import { GiUndergroundCave } from "react-icons/gi";
import { UserPreferenceController } from "../../../../controllers/user-preference.controller";
import {
  genotypeTreatmentService,
  npeService,
  sequenciaDelineamentoService,
  userPreferencesService,
} from "../../../../services";
import { experimentService } from "../../../../services/experiment.service";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
} from "../../../../components";
import LoadingComponent from "../../../../components/Loading";
import ITabs from "../../../../shared/utils/dropdown";
import headerTableFactoryGlobal from "../../../../shared/utils/headerTableFactory";
import handleError from "../../../../shared/utils/handleError";
import { prisma } from '../../../api/db/db';

interface IFilter {
  filterFoco: string;
  filterTypeAssay: string;
  filterGli: string;
  filterExperimentName: string;
  filterTecnologia: string;
  filterPeriod: string;
  filterDelineamento: string;
  filterRepetition: string;
  orderBy: object | any;
  typeOrder: object | any;
}

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

export interface IExperimento {
  id: number;
  experiment_name: string;
  year: number;
  rotulo: string;
  foco: string;
  ensaio: string;
  cod_tec: number;
  epoca: number;
  npeQT: number;
  npef: number;
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
}

export default function Listagem({
  itensPerPage,
  filterApplication,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs;

  const tableRef = useRef<any>(null);
  const tabsOperationMenu = tabsOperation.map((i) =>
    i.titleTab === "AMBIENTE" ? { ...i, statusTab: true } : i
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.experimento || {
    id: 0,
    table_preferences:
      "id,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,countNT,npeQT",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const router = useRouter();
  const [experimentos, setExperimento] = useState<IExperimento[]>([]);
  const [experimentosNew, setExperimentoNew] = useState<IExperimento[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  // const [currentPage, setCurrentPage] = useState<number>(
  //   Number(pageBeforeEdit)
  // );
  const [filter, setFilter] = useState<any>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(0);

  const [orderList, setOrder] = useState<number>(0);
  const [lastExperimentNPE, setLastExperimentNPE] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [SortearDisable, setSortearDisable] = useState<boolean>(false);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
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
    {
      name: "CamposGerenciados[]",
      title: "Qtd Genótipos",
      value: "countNT",
    },
    {
      name: "CamposGerenciados[]",
      title: "NPE Inicial",
      value: "repetitionsNumber",
    },
    {
      name: "CamposGerenciados[]",
      title: "NPE Final",
      value: "repetitionsNumber",
    },
    { name: "CamposGerenciados[]", title: "QT NPE", value: "npeQT" },
  ]);

  const [colorStar, setColorStar] = useState<string>("");
  const [NPESelectedRow, setNPESelectedRow] = useState<any>(null);
  
  const [npeUsedFrom, setNpeUsedFrom] = useState<number>(0);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [fieldOrder, setFieldOrder] = useState<any>(null);
  const [npeData, setNpeData] = useState<any>(null);

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [selectedNPE, setSelectedNPE] = useState<any[]>(
    JSON.parse(localStorage.getItem("selectedNPE") as string)
  );

  const [allNPERecords, setAllNPERecords] = useState<any[]>([]);
  const [isNccAvailable, setIsNccAvailable] = useState<boolean>(true);
  const [isOverLap, setIsOverLap] = useState<boolean>(false);
  // @todo: Solução paliativa para mostrar ambientes com erro, no multi-sorteio, remover;
  const [NPEFirstOverlapRow, setNPEFirstOverlapRow] = useState<any>(null);
  
  const [data, setData] = useState<any[]>([]);
  // let selectedNPE = JSON.parse(localStorage.getItem('selectedNPE') as string);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterFoco: "",
      filterTypeAssay: "",
      filterGli: "",
      filterExperimentName: "",
      filterTecnologia: "",
      filterPeriod: "",
      filterDelineamento: "",
      filterRepetition: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterFoco,
      filterTypeAssay,
      filterGli,
      filterExperimentName,
      filterTecnologia,
      filterPeriod,
      filterDelineamento,
      filterRepetition,
    }) => {
      const parametersFilter = `filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterGli=${filterGli}&filterExperimentName=${filterExperimentName}&filterTecnologia=${filterTecnologia}&filterPeriod=${filterPeriod}&filterRepetition=${filterRepetition}&filterDelineamento=${filterDelineamento}&idSafra=${idSafra}`;
      setFilter(parametersFilter);
      setCookies("filterBeforeEdit", filter);
      await experimentService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response) => {
          setFilter(parametersFilter);
          setExperimento(response.response);
          setTotalItems(response.total);
          setCurrentPage(0);
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

    await experimentService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then(({ status, response }: any) => {
        if (status === 200) {
          setExperimento(response);
        }
      });

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
    setFieldOrder(name);
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

  async function deleteItem(id: number) {
    const { status, message } = await experimentService.deleted(id);
    if (status === 200) {
      router.reload();
    } else {
      Swal.fire({
        html: message,
        width: "800",
      });
    }
  }

  function statusHeaderFactory() {
    return {
      title: "Ações",
      field: "action",
      sorting: false,
      searchable: false,
      render: (rowData: IExperimento) => (
        <div className="h-10 flex">
          <div className="h-10">
            <Button
              icon={<BiEdit size={16} />}
              title={`Atualizar ${rowData.experiment_name}`}
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                router.push(
                  `/listas/experimentos/experimento/atualizar?id=${rowData.id}`
                );
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div>
            <Button
              icon={<BsTrashFill size={16} />}
              onClick={() => deleteItem(rowData.id)}
              bgColor="bg-red-600"
              textColor="white"
            />
          </div>
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
            title: "assay_list.tecnologia.name",
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div>{`${rowData?.assay_list?.tecnologia?.cod_tec} ${rowData?.assay_list?.tecnologia?.name}`}</div>
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
    });

    tableFields.push(
      headerTableFactoryGlobal({
        name: "Qtd Genótipos",
        title: "countNT",
        orderList,
        fieldOrder,
        handleOrder,
      })
    );

    tableFields.push(
      headerTableFactoryGlobal({
        name: "NPE Inicial",
        title: "npei",
        orderList,
        fieldOrder,
        handleOrder,
      })
    );

    tableFields.push(
      headerTableFactoryGlobal({
        name: "NPE Final",
        title: "npefView",
        orderList,
        fieldOrder,
        handleOrder,
      })
    );

    tableFields.push(
      headerTableFactoryGlobal({
        name: "QT NPE",
        title: "npeQT",
        orderList,
        fieldOrder,
        handleOrder,
      })
    );

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
    const excelFilters = `${filterApplication}&paramSelect=${camposGerenciados}`;
    // if (!filterApplication.includes('paramSelect')) {
    //   filterApplication +=
    // }

    await experimentService
      .getAll(excelFilters)
      .then(({ status, response, message }: any) => {
        if (status === 200) {
          response.map((item: any) => {
            const newItem = item;
            if (item.assay_list) {
              newItem.gli = item.assay_list.gli;
              newItem.foco = item.assay_list.foco.name;
              newItem.type_assay = item.assay_list.type_assay.name;
              newItem.tecnologia = item.assay_list.tecnologia.name;
            }
            if (item.delineamento) {
              newItem.repeticao = item.delineamento.repeticao;
              newItem.delineamento = item.delineamento.name;
            }
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
          Swal.fire(
            "Não existem registros para serem exportados, favor checar."
          );
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

  async function handlePagination(page: any): Promise<void> {
    setCurrentPage(page);

    if (NPESelectedRow) {
      const skip = currentPage * Number(take);
      setExperimentoNew(experimentos.slice(skip, skip + take));
    }
  }

  // useLayoutEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-10 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-2">
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

  const columnNPE = [
    { title: "Local", field: "local.name_local_culture" },
    { title: "Safra", field: "safra.safraName" },
    { title: "Foco", field: "foco.name" },
    { title: "Ensaio", field: "type_assay.name" },
    { title: "Tecnologia", field: "tecnologia.name" },
    { title: "Época", field: "epoca" },
    { title: "NPE Inicial", field: "prox_npe" },
    { title: "NPE Final", field: "npefView" },
    { title: "NPE Requisitada", field: "npeRequisitada" },
    { title: "NPE Disponível", field: "npeQT" },
  ];

  const handleNPERowSelection = (rowData: any) => {
    if (NPESelectedRow?.tableData.id !== rowData.tableData.id) {
      rowData.tableData.checked = false;
    } else {
      rowData.tableData.checked = true;
    }
  };

  async function getExperiments(): Promise<void> {
    selectedNPE.map(async (env: any) => {
      let tempFilter = `idSafra=${env?.safraId}&idLocal=${env?.localId}&Foco=${env?.foco.id}&Epoca=${env?.epoca}&Tecnologia=${env?.tecnologia.cod_tec}&TypeAssay=${env?.type_assay.id}&Status=IMPORTADO&excel=true`;
      if (filter) {
        tempFilter = `${tempFilter}&${filter}`;
      }

      let orderBy1 = "orderDraw";
      let typeOrder1 = "asc";
      
      let orderBy2 = "assay_list.gli";
      let typeOrder2 = "asc";
      
      const orderBy = [orderBy1, orderBy2];
      const typeOrder = [typeOrder1, typeOrder2];
      
      tempFilter = `${tempFilter}&orderBy=${orderBy1}&typeOrder=${typeOrder1}&orderBy=${orderBy2}&typeOrder=${typeOrder2}`;
      tempFilter = `${tempFilter}&orderBy=&typeOrder=`;
      
      let count1 = 0;

      await experimentService
        .getAll(tempFilter)
        .then(({ status, response, total }) => {
          let i = 0;

          response.length > 0 ? (i = env.prox_npe) : (i = env.npef);
          let count = 0;
          response.map((p: any) => {
            p.npei = i;

            p.seq_delineamento?.map((sd: any) => {
              p.npef = i;
              i = p.npef + 1;
              // npeRequisitada
              env.npeRequisitada++;
              
              i >= env.nextNPE.npei_i && npeUsedFrom == 0
                ? setNpeUsedFrom(env.nextNPE.npei_i)
                : "";
            });

            p.npeQT = p.npef - p.npei + 1;
            env.npef = i - 1;
            env.npefView = i - 1;

            p.npefView = p.npef;
            
            console.log('p.npeQT', p.npeQT);

            // enable disable button && isNCCAvailable
            p.assay_list?.genotype_treatment?.map((exp: any) => {
              if (
                exp.lote == null ||
                exp.lote?.ncc == "" ||
                exp.lote?.ncc == null ||
                exp.lote?.ncc == undefined
              ) {
                // setSortearDisable(true);
                ++count;
              }
            });
          });
          
          console.log('env.npef', env.npef, 'env.nextNPE.npei_i', env.nextNPE.npei_i);
          
          console.log('response.experiments', response);
          

          /**
           * No caso temos o ENV1 com NPEI = 101 e NPEF = 101 e NPEI_I = 101 e PROX_NPE = 101
           * Quando calculamos os experimentos + seq_delineamento
           * No caso temos o ENV2 com NPEI = 151 e NPEF = 151 e NPEI_I = 151 e PROX_NPE = 151
           * EDITA o ENV2 para PROX_NPE: 190
           * No caso temos o ENV2 com NPEI = 151 e NPEF = 190 e NPEI_I = 190 e PROX_NPE = 190
           **/
          if (env.npef >= env.nextNPE.npei_i) {
            ++count1; // conta o número de sobreposições
          }

          // se tiver zero experimentos o npef é igual ao npei
          // IMPORTANTE: essa mudança no npef só é feita após a verificação de sobreposição;
          if(response.length === 0) {
            env.npef = env.prox_npe;
            env.npefView = env.prox_npe;
          }
          
          const temp = {
            env,
            data: response,
            isNccAvailable: true,
            isOverLap: false,
          };
          temp.env = env;
          temp.data = response;
          temp.isOverLap = false;

          if (count1 > 0) {
            temp.isOverLap = true; // indica se houve sobreposição no env atual com o proximo env
          } else {
            temp.isOverLap = false;
          }

          if (count > 0) {
            temp.isNccAvailable = false;
          } else {
            temp.isNccAvailable = true;
          }

          console.log('contagem de lotes sem NCC dos tratamentos de genótipos (count)', count, '<<genotype_treatment>>');
          console.log('contagem de sobreposições (count1): ', count1);
          console.log('temp.isOverLap: ', temp.isOverLap);
          
          setAllNPERecords((prev) => [...prev, temp]);
          count = 0;
        });
    });
  }

  useEffect(() => {
    const env = allNPERecords?.filter((ele: any) =>
      ele?.env.id == NPESelectedRow?.id ? ele : ""
    );
    setNpeData(env ? env[0] : "");

    //STEWART
    if (env) {
      tableRef?.current?.dataManager?.changePageSize(env[0]?.data?.length);
    }

    let isNccAvailable = true;
    let isOverLap = false;

    for (const key in allNPERecords) {
      if (allNPERecords.hasOwnProperty(key)) {
        if (allNPERecords[key].isNccAvailable == false) {
          isNccAvailable = false;
        }
        if (allNPERecords[key].isOverLap == true) {
          isOverLap = true;
          if(!NPEFirstOverlapRow)
            setNPEFirstOverlapRow(allNPERecords[key].env);
        }
      }
    }
    setIsNccAvailable(isNccAvailable);
    setIsOverLap(isOverLap);
    
    console.log('isNccAvailable', isNccAvailable);
    console.log('isOverLap', isOverLap);
    
    if (!isNccAvailable || isOverLap) {
      setSortearDisable(true);
    }
  }, [allNPERecords, NPESelectedRow]);

  async function getLastNpeDisponible({safraId, groupId, npefSearch}: any) {
    let body = {
      safraId: safraId,
      groupId: groupId,
      npefSearch: npefSearch,
    };
    const {status, response } = await experimentGenotipeService.getLastNpeDisponible(body);
    console.log('getLastNpeDisponible.response', response);
    return { maxNPE: response[0]?.maxnpe, count_npe_exists: response[0].count_npe_exists };
  }
  
  async function createExperimentGenotipe({
    experiment_genotipo,
    total_consumed,
    genotipo_treatment,
  }: any) {
    const gt = genotipo_treatment.reduce((unique: any, o: any) => {
      if (
        !unique.some(
          (obj: any) =>
            obj.id === o.id && obj.status_experiment === o.status_experiment
        )
      ) {
        unique.push(o);
      }
      return unique;
    }, []);

    const tempExperimentObj: any[] = [];
    
    experiment_genotipo.map((item: any) => {
      const data: any = {};
      data.id = Number(item.idExperiment);
      data.status = "SORTEADO";
      tempExperimentObj.push(data);
    });

    const experimentObj = tempExperimentObj.reduce((unique, o) => {
      if (
        !unique.some((obj: any) => obj.id === o.id && obj.status === o.status)
      ) {
        unique.push(o);
      }
      return unique;
    }, []);
    
    const npeToUpdate: any[] = [];
    
    allNPERecords.map(async (item: any) => {
    
      let npef = Number(item.env?.npef);
      let nextNPE = npef + 1; // 117 == 118
      
      // se tiver experimentos no env atual
      if(item.data.length > 0) {
        const temp = {
          id: item.env?.id,
          npef: item.env?.npef,
          groupId: item.env?.group?.id,
          safraId: item.env?.safraId,
          // npeQT:
          //   NPESelectedRow?.npeQT == 'N/A'
          //     ? null
          //     : NPESelectedRow?.npeQT - total_consumed,
          status: 3, // quando não houver experimentos não atualiza o status
          prox_npe: nextNPE,
        };
        
        npeToUpdate.push(temp);
      }
    });
    
    
    console.log('npeToUpdate: ', npeToUpdate); // atenção se não houver experimentos não atualiza o status do env
    console.log('experiment_genotipo.length', experiment_genotipo.length);

    // SEMPRE QUE FOR USAR FUNÇÃO ASSINCRONA USAR FOR PARA OBTER O RESULTADO ANTES DE EXECUTAR O RESTANTE DO CÓDIGO;
    for (const item of Object.values(npeToUpdate)) {
      const result = await getLastNpeDisponible({
        safraId: Number(item.safraId), 
        groupId: Number(item.groupId), 
        npefSearch: Number(item.prox_npe)
      });
      console.log('result', result, 'item:', item);
      
      if(result.maxNPE != null && result.count_npe_exists == 0) {
        item.prox_npe = result.maxNPE;
      }
    }

    for (let i = 0; i < npeToUpdate.length; i++) {
      const item = npeToUpdate[i];
      const result = await getLastNpeDisponible({
        safraId: Number(item.safraId),
        groupId: Number(item.groupId),
        npefSearch: Number(item.prox_npe)
      });
      console.log('for (let i = 0; i < npeToUpdate.length; i++)','result', result, 'item:', item);
    }
    
    console.log('npeToUpdate -- ATUALIZADO: ', npeToUpdate);
    
    if (experiment_genotipo.length > 0) {
      setLoading(true);

      await experimentGenotipeService
        .create({experiment_genotipo, gt, experimentObj, npeToUpdate})
        .then((response) => {
          console.log('response', response);
          if (response.status === 200) {
            Swal.fire({
              title: "Sorteio salvo com sucesso.",
              showDenyButton: false,
              showCancelButton: false,
              confirmButtonText: "Ok",
            }).then(() => {
              router.push("/operacao/ambiente");
            });
          } else {
            Swal.fire({
              title: "algo deu errado",
              showCancelButton: true,
            });
          }
        });
      setLoading(false);
    } else {
      Swal.fire("Nenhum experimento para sortear.");
    }
  }

  function validateConsumedData() {
    console.log("SortearDisable : ", SortearDisable);
    console.log("isNccAvailable : ", isNccAvailable);
    console.log("isOverLap : ", isOverLap);

    if (!SortearDisable) {
      const experiment_genotipo: any[] = [];
      const genotipo_treatment: any[] = [];

      allNPERecords?.map((npe: any) => {
        let npei = Number(npe.data[0]?.npei);
        
        let groupId: number = npe.env?.group?.id;
        
        npe.data.map((item: any) => {
          item.seq_delineamento?.map((sd: any) => {
            const gt = item.assay_list.genotype_treatment.filter(
              (x: any) => x.treatments_number == sd.nt
            )[0];

            const data: any = {};
            data.idSafra = gt.id_safra;
            data.idFoco = item.assay_list?.foco.id;
            data.idTypeAssay = item.assay_list?.type_assay.id;
            data.idTecnologia = item.assay_list?.tecnologia.id;
            data.idExperiment = item.id;
            data.gli = item.assay_list?.gli;
            data.rep = sd.repeticao;
            data.nt = sd.nt;
            data.npe = npei;
            data.idLote = gt?.id_lote;
            data.groupId = groupId; // NPESelectedRow.group.id
            data.idGenotipo = gt.genotipo?.id; // Added new field
            data.gli = item.assay_list?.gli;
            data.id_seq_delineamento = sd.id;
            data.nca = gt.lote?.ncc;
            data.status_t = gt.status;
            experiment_genotipo.push(data);
            npei++;

            const gt_new: any = {};
            gt_new.id = gt.id;
            gt_new.status_experiment = "EXP. SORTEADO";
            genotipo_treatment.push(gt_new);
          });
        });
      });
      
      // return;
      
      try {
      
        createExperimentGenotipe({
          experiment_genotipo,
          total_consumed: experiment_genotipo.length,
          genotipo_treatment,
        });
        
      } catch (e: any) {
        console.log('validateConsumedData -> e', e);
        Swal.fire({
          html: 'Erro ao sortear experimentos: ' + e,
          width: '800',
          didClose: () => {
            router.reload();
          },
        });
      }
      
    } else if (isNccAvailable == false && isOverLap == true) {
      const temp = NPEFirstOverlapRow;
      Swal.fire({
        title: "NPE Já usado !!!",
        html:
          `Existem NPE usados ​​entre <b>${npeUsedFrom}</b> e <b>${temp.npef}</b><br><br>` +
          `Estes foram selecionados para : <br><div style='text-align: center'><p style='text-align:left; max-width:255px; margin:auto;'>`+
          `<b> Foco : ${temp.nextNPE?.foco?.name}</b><br><b> Ensaio : ${temp.nextNPE?.type_assay?.name}</b><br>` +
          `<b> Local : ${temp.nextNPE?.local?.name_local_culture}</b><br><b>Epoca : ${temp.nextNPE?.epoca}</b><br>` +
          `<b>Tecnologia : ${temp.nextNPE?.tecnologia?.name}</b></p><br>` +
          `O próximo NPE disponível é <strong>${Number(temp.nextAvailableNPE) + 1}</strong><br>`+
          `<strong>Ncc não está presente nos registros</strong></div>`,
        icon: "warning",
        showCloseButton: true,
        closeButtonHtml:
          '<span style="background-color:#FF5349; color:#fff; width:35px; height:35px; border-radius:35px; font-size:23px;font-weight:600">x</span>',
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Acesse o NPE e atualize",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open("/config/ambiente", "_ blank");
          // router.push({
          //   pathname: "/config/npe",
          // });
        }
      });
    } else if (isNccAvailable == false) {
      Swal.fire({
        title: "Ncc não está presente nos registros",
        html: "<strong>Ncc não está presente nos registros, tente novamente após adicionar Ncc</strong>",
        icon: "warning",
        showCloseButton: true,
        closeButtonHtml:
          '<span style="background-color:#FF5349; color:#fff; width:35px; height:35px; border-radius:35px; font-size:23px;font-weight:600">x</span>',
        showCancelButton: true,
      });
    } else if (isOverLap == true) {
      const temp = NPEFirstOverlapRow;

      let infos = ``;
      if(typeof temp.nextNPE == 'object') {
        infos = `Estes foram selecionados para : <br><div style='text-align: center'><p style='text-align:left; max-width:255px; margin:auto;'>` +
          `<b> Foco : ${temp.nextNPE?.foco?.name}</b><br><b> Ensaio : ${temp.nextNPE?.type_assay?.name}</b><br>` +
          `<b> Local : ${temp.nextNPE?.local?.name_local_culture}</b><br><b>Epoca : ${temp.nextNPE?.epoca}</b><br>` +
          `<b>Tecnologia : ${temp.nextNPE?.tecnologia?.name}</b></p><br>`;
      }
      
      Swal.fire({
        title: "NPE Já usado !!!",
        html:
          `Existem NPE usados ​​entre <b>${npeUsedFrom}</b> e <b>${temp.npef}</b><br><br>` +
          infos + 
          `O próximo NPE disponível é <strong>${Number(temp.nextAvailableNPE) + 1}</strong></div>`,
        icon: "warning",
        showCloseButton: true,
        closeButtonHtml:
          '<span style="background-color:#FF5349; color:#fff; width:35px; height:35px; border-radius:35px; font-size:23px;font-weight:600">x</span>',
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Acesse o NPE e atualize",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open("/config/ambiente", "_ blank");
        }
      });
    }
  }

  useEffect(() => {
    getExperiments();
  }, []);

  useEffect(() => {
    setNPESelectedRow(selectedNPE[0]);
  }, []);

  useEffect(() => {
    setExperimentoNew(experimentos.slice(0, 10));
    if (NPESelectedRow) {
      selectedNPE.filter((x): any => x == NPESelectedRow)[0].npef =
        experimentos.length > 0
          ? experimentos[experimentos.length - 1].npef
          : NPESelectedRow.npef;
    }
  }, [experimentos]);

  function checkValidLote(data: any) {
    let count = 0;
    data?.assay_list?.genotype_treatment?.map((exp: any) => {
      if (exp.lote === null || exp.lote === "undefined") {
        count++;
      } else if (
        exp.lote.ncc == "" ||
        exp.lote.ncc == null ||
        exp.lote.ncc == undefined
      ) {
        count++;
      }
    });
    if (count > 0) {
      return false;
    }
    return true;
  }

  return (
    <>
      <Head>
        <title>Listagem de sorteios</title>
      </Head>

      {loading && <LoadingComponent />}

      <Content contentHeader={tabsOperationMenu} moduloActive="operacao">
        <main
          className="h-full w-full
                        flex flex-col
                        items-start
                        gap-0
                        overflow-y-hidden
                        "
        >
          <div
            className={`w-full ${
              selectedNPE?.length > 3 && "max-h-40 overflow-y-scroll"
            } mb-4`}
          >
            <MaterialTable
              style={{
                background: "#f9fafb",
                paddingBottom: selectedNPE?.length > 3 ? 0 : "5px",
              }}
              columns={columnNPE}
              data={selectedNPE}
              onRowClick={(evt, selectedRow: any) => {
                setNPESelectedRow(selectedRow);
                selectedRow.tableData.checked = true;
              }}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                  height: 40,
                },
                rowStyle: (rowData) => ({
                  backgroundColor:
                    NPESelectedRow?.tableData?.id === rowData.tableData.id
                      ? NPESelectedRow.npef >= NPESelectedRow.nextNPE.npei_i
                        ? "#de1e14"
                        : "#d3d3d3"
                      : rowData.npef >= rowData.nextNPE.npei_i
                      ? "#FF5349"
                      : "#f9fafb",
                  height: 40,
                }),
                search: false,
                filtering: false,
                selection: false,
                sorting: false,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
                paging: false,
                // selectionProps: handleNPERowSelection,
              }}
              components={{
                Toolbar: () => null,
              }}
            />
          </div>
          {NPESelectedRow ? (
            <div className="w-full h-full">
              <MaterialTable
                tableRef={tableRef}
                style={{ background: "#f9fafb" }}
                columns={columns}
                // data={experimentosNew}
                data={npeData?.data}
                options={{
                  showTitle: false,
                  //maxBodyHeight: `calc(100vh - 400px)`,
                  maxBodyHeight: `calc(100vh - 320px)`,
                  headerStyle: {
                    zIndex: 1,
                  },
                  rowStyle: (rowData) => ({
                    backgroundColor:
                      rowData.npef >= npeData?.env.nextNPE.npei_i
                        ? "#FF5349"
                        : checkValidLote(rowData)
                        ? "#f9fafb"
                        : "#ff8449",
                    height: 40,
                  }),
                  search: false,
                  filtering: false,
                  pageSize: itensPerPage,
                  paging: false, //PAGINACAO DESATIVADA TEMPORARIAMENTE
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

                      <strong className="text-600">Experimentos</strong>
                      <strong className="text-blue-600">
                        {/* Total registrado: {experimentos?.length} */}
                        Total registrado: {npeData?.data?.length}
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
                            title="Sortear"
                            value="Sortear"
                            bgColor={
                              SortearDisable ? "bg-gray-400" : "bg-blue-600"
                            }
                            textColor="white"
                            onClick={validateConsumedData}
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
                          onClick={() => handlePagination(currentPage - 10)}
                          bgColor="bg-blue-600"
                          textColor="white"
                          icon={<MdFirstPage size={18} />}
                          disabled={currentPage <= 1}
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
                          onClick={() => handlePagination(currentPage + 10)}
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
          ) : (
            ""
          )}
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
    )?.response[0]?.itens_per_page) ?? 10;

  const idSafra = Number(req.cookies.safraId);

  const filterBeforeEdit = "";
  const filterApplication = "";
  const pageBeforeEdit = 0;

  return {
    props: {
      itensPerPage,
      filterApplication,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
