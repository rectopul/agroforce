import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import Head from "next/head";
import router from "next/router";
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
import { BsDownload } from "react-icons/bs";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiSettingsFill } from "react-icons/ri";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { layoutQuadraService, userPreferencesService } from "src/services";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ButtonToogleConfirmation,
} from "../../../../components";
import * as ITabs from "../../../../shared/utils/dropdown";
import { functionsUtils } from "../../../../shared/utils/functionsUtils";
import { tableGlobalFunctions } from "../../../../helpers";
import headerTableFactoryGlobal from "../../../../shared/utils/headerTableFactory";
import ComponentLoading from "../../../../components/Loading";

interface ILayoultProps {
  id: number | any;
  id_culture: number | any;
  esquema: string | any;
  semente_metros: number | any;
  disparos: number | any;
  divisor: number | any;
  largura: number | any;
  comp_fisico: number | any;
  comp_parcela: number | any;
  comp_corredor: number | any;
  t4_inicial: number | any;
  t4_final: number | any;
  df_inicial: number | any;
  df_final: number | any;
  created_by: number;
  local: string | any;
  status: number;
}

interface IFilter {
  filterStatus: object | any;
  filterCodigo: string | any;
  filterEsquema: string | any;
  filterTiros: string | any;
  filterDisparos: string | any;
  filterShotsFrom: string | any;
  filterShotsTo: string | any;
  filterPopFrom: string | any;
  filterPopTo: string | any;
  filterParcelFrom: string | any;
  filterParcelTo: string | any;
  filterPlantadeira: string | any;
  filterParcelas: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  layouts: ILayoultProps[];
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  local: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  cultureId: number | any;
  typeOrderServer: any | string;
  orderByserver: any | string;
}

export default function Listagem({
  layouts,
  itensPerPage,
  filterApplication,
  totalItems,
  local,
  pageBeforeEdit,
  filterBeforeEdit,
  cultureId,
  orderByserver,
  typeOrderServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) =>
    tab.titleTab === "QUADRAS"
      ? (tab.statusTab = true)
      : (tab.statusTab = false)
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.layout_quadra || {
    id: 0,
    table_preferences: "id,esquema,plantadeira,tiros,disparos,parcelas,status",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );

  const [quadras, setQuadra] = useState<ILayoultProps[]>(() => layouts);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit)
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == "desc" ? 1 : 2
  );
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);

  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito ',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: "CamposGerenciados[]",
      title: "Esquema ",
      value: "esquema",
      defaultChecked: () => camposGerenciados.includes("esquema"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Plantadeira ",
      value: "plantadeira",
      defaultChecked: () => camposGerenciados.includes("local"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Tiros",
      value: "tiros",
      defaultChecked: () => camposGerenciados.includes("divisor"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Disparos",
      value: "disparos",
      defaultChecked: () => camposGerenciados.includes("disparos"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Parcelas",
      value: "parcelas",
      defaultChecked: () => camposGerenciados.includes("largura"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Ação",
      value: "status",
      defaultChecked: () => camposGerenciados.includes("status"),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] =
    useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>("");
  // const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>("");
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const columns = colums(camposGerenciados);

  const filters = [
    { id: 2, name: "Todos" },
    { id: 1, name: "Ativos" },
    { id: 0, name: "Inativos" },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split("");

  const formik = useFormik<IFilter>({
    initialValues: {
      filterShotsFrom: "",
      filterShotsTo: "",
      filterPopFrom: "",
      filterPopTo: "",
      filterParcelFrom: "",
      filterParcelTo: "",
      filterStatus: filterStatusBeforeEdit[13],
      filterCodigo: "",
      filterEsquema: "",
      filterDisparos: "",
      filterTiros: "",
      filterPlantadeira: "",
      filterParcelas: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterStatus,
      filterEsquema,
      filterDisparos,
      filterTiros,
      filterPlantadeira,
      filterParcelas,
      filterShotsTo,
      filterShotsFrom,
      filterPopTo,
      filterPopFrom,
      filterParcelTo,
      filterParcelFrom,
    }) => {
      if (!functionsUtils?.isNumeric(filterPopFrom)) {
        return Swal.fire("O campo Tiros não pode ter ponto ou vírgula.");
      }
      if (!functionsUtils?.isNumeric(filterShotsTo)) {
        return Swal.fire("O campo Tiros não pode ter ponto ou vírgula.");
      }
      if (!functionsUtils?.isNumeric(filterShotsFrom)) {
        return Swal.fire("O campo Disparos não pode ter ponto ou vírgula.");
      }
      if (!functionsUtils?.isNumeric(filterShotsTo)) {
        return Swal.fire("O campo Disparos não pode ter ponto ou vírgula.");
      }
      if (!functionsUtils?.isNumeric(filterParcelFrom)) {
        return Swal.fire("O campo Parcelas não pode ter ponto ou vírgula.");
      }
      if (!functionsUtils?.isNumeric(filterParcelTo)) {
        return Swal.fire("O campo Parcelas não pode ter ponto ou vírgula.");
      }

      const parametersFilter = `filterStatus=${filterStatus}&filterEsquema=${filterEsquema}&filterDisparos=${filterDisparos}&filterTiros=${filterTiros}&filterPlantadeira=${filterPlantadeira}&filterParcelas=${filterParcelas}&filterShotsTo=${filterShotsTo}&filterShotsFrom=${filterShotsFrom}&filterPopTo=${filterPopTo}&filterPopFrom=${filterPopFrom}&filterParcelTo=${filterParcelTo}&filterParcelFrom=${filterParcelFrom}`;
      // setFiltersParams(parametersFilter);
      // setCookies('filterBeforeEdit', filtersParams);
      // await layoutQuadraService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setTotaItems(response.total);
      //     setFilter(parametersFilter);
      //     setQuadra(response.response);
      //   });

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

    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies("filtersParams", parametersFilter);

    await layoutQuadraService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setQuadra(response.response);
          setTotaItems(response.total);
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

  // function headerTableFactory(name: any, title: string) {
  //   return {
  //     title: (
  //       <div className="flex items-center">
  //         <button
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
      field: "status",
      sorting: false,
      searchable: false,
      filterPlaceholder: "Filtrar por status",
      render: (rowData: ILayoultProps) => (
        <div className="flex">
          {rowData.status ? (
            <div className="h-7 flex">
              <div className="h-7">
                <Button
                  title={`Atualizar ${rowData.esquema}`}
                  icon={<BiEdit size={14} />}
                  bgColor="bg-blue-600"
                  textColor="white"
                  onClick={() => {
                    setCookies("pageBeforeEdit", currentPage?.toString());
                    setCookies("filterBeforeEdit", filter);
                    setCookies("filterBeforeEditTypeOrder", typeOrder);
                    setCookies("filterBeforeEditOrderBy", orderBy);
                    setCookies("filtersParams", filtersParams);
                    setCookies("lastPage", "atualizar");
                    router.push(
                      `/config/quadra/layout-quadra/atualizar?id=${rowData.id}`
                    );
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="h-7 flex">
              <div className="h-7">
                <Button
                  title={`Atualizar ${rowData.esquema}`}
                  icon={<BiEdit size={14} />}
                  bgColor="bg-blue-600"
                  textColor="white"
                  onClick={() => {
                    setCookies("pageBeforeEdit", currentPage?.toString());
                    setCookies("filterBeforeEdit", filter);
                    setCookies("filterBeforeEditTypeOrder", typeOrder);
                    setCookies("filterBeforeEditOrderBy", orderBy);
                    setCookies("filtersParams", filtersParams);
                    setCookies("lastPage", "atualizar");
                    router.push(
                      `/config/quadra/layout-quadra/atualizar?id=${rowData.id}`
                    );
                  }}
                />
              </div>
            </div>
          )}
          <div className="ml-1" />
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

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(",");
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item: any) => {
      // if (columnCampos[item] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[item] === "esquema") {
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

      if (columnCampos[item] === "local") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Local",
            title: "local",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }

      if (columnCampos[item] === "plantadeira") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Plantadeiras",
            title: "plantadeira",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }

      if (columnCampos[item] === "tiros") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Tiros",
            title: "tiros",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "disparos") {
        tableFields.push(
          headerTableFactoryGlobal({
            type: "int",
            name: "Disparos",
            title: "disparos",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "parcelas") {
        tableFields.push(
          headerTableFactoryGlobal({
            type: "int",
            name: "Parcelas",
            title: "parcelas",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "status") {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
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

    // await layoutQuadraService
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
          module_id: 5,
        })
        .then((response) => {
          userLogado.preferences.layout_quadra = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      userLogado.preferences.layout_quadra = {
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

  async function handleStatus(data: any): Promise<void> {
    const parametersFilter = `filterStatus=${1}&id_culture=${
      userLogado.userCulture.cultura_selecionada
    }&esquema=${data.esquema}&status=${1}`;
    // if (data.status == 0) {

    await layoutQuadraService.getAll(parametersFilter).then((response) => {
      if (response.total > 0) {
        Swal.fire(
          "Layout não pode ser atualizada pois já existe um layout cadastrada com essas informações ativo"
        );
        router.push("");
      } else {
        layoutQuadraService.update({
          id: data?.id,
          status: data?.status == 1 ? 0 : 1,
        });

        handlePagination(currentPage);

        // const index = quadras.findIndex(
        //   (layout: any) => layout.id === data?.id
        // );

        // if (index === -1) return;

        // setQuadra((oldSafra: any) => {
        //   const copy = [...oldSafra];
        //   copy[index].status = data?.status == 1 ? 0 : 1;
        //   return copy;
        // });

        // const { id, status } = quadras[index];
      }
    });
    // } else {
    //   if (data.status === 0) {
    //     data.status = 1;
    //   } else {
    //     data.status = 0;
    //   }
    //   await layoutQuadraService.update({
    //     id: idLayoutQuadra,
    //     status: data.status,
    //   });

    //   const index = quadras.findIndex(
    //     (layout: any) => layout.id === idLayoutQuadra
    //   );

    //   if (index === -1) {
    //     return;
    //   }

    //   setQuadra((oldSafra: any) => {
    //     const copy = [...oldSafra];
    //     copy[index].status = data.status;
    //     return copy;
    //   });

    //   const { id, status } = quadras[index];
    // }
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

    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await layoutQuadraService.getAll(filterParam).then(({ status, response }) => {
      if (response.status === 200) {

        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, "quadras");

        // Buffer
        const buf = XLSX.write(workBook, {
          bookType: "xlsx", // xlsx
          type: "buffer",
        });
        // Binary
        XLSX.write(workBook, {
          bookType: "xlsx", // xlsx
          type: "binary",
        });
        // Download
        XLSX.writeFile(workBook, "Layout_Quadra.xlsx");
      } else {
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

  async function handlePagination(page: any): Promise<void> {
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
    // await layoutQuadraService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setQuadra(response.response);
    //   }
    // });

    await callingApi(filter, page); // handle pagination globly
  }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams
    );
    return parameter;
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="w-1/3 ml-2">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          id={title}
          defaultValue={checkValue(title)}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem dos Layout</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >
          <AccordionFilter
            title="Filtrar layouts de quadras"
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
                  pb-0
                "
                >
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatusBeforeEdit[13]}
                      // defaultValue={checkValue('filterStatus')}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div>

                  {filterFieldFactory("filterEsquema", "Esquema")}

                  {filterFieldFactory("filterPlantadeira", "Plantadeiras")}

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Tiros
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterPopFrom"
                        name="filterPopFrom"
                        defaultValue={checkValue("filterPopFrom")}
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        type="number"
                        placeholder="Até"
                        id="filterPopTo"
                        name="filterPopTo"
                        defaultValue={checkValue("filterPopFrom")}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Disparos
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterShotsFrom"
                        name="filterShotsFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterShotsTo"
                        name="filterShotsTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Parcelas
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="De"
                        id="filterParcelFrom"
                        name="filterParcelFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="number"
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterParcelTo"
                        name="filterParcelTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
                    <Button
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
              data={quadras}
              options={{
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 400 : 320
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
                        title="Importar"
                        value="Importar"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {
                          window.open(
                            "/listas/rd?importar=layout_quadra",
                            "_blank"
                          );
                        }}
                        icon={<RiFileExcel2Line size={20} />}
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
                          title="Exportar planilha de layout quadra"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
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
                          href="layout-quadra/importar-planilha/config-planilha"
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
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage =
    (await (
      await PreferencesControllers.getConfigGerais()
    )?.response[0]?.itens_per_page) ?? 10;

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

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "desc";

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "esquema";

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : "filterStatus=1";

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });
  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("lastPage", { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/layout-quadra`;
  const urlParameters: any = new URL(baseUrl);

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  // const filterApplication = `filterStatus=1&id_culture=${cultureId}`;
  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : "filterStatus=1";

  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const layout = await fetch(urlParameters.toString(), requestOptions);
  const { response: layouts, total: totalItems } = await layout.json();

  return {
    props: {
      layouts,
      totalItems,
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
