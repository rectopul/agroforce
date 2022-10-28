import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
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
import { MdDateRange, MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { removeCookies, setCookies } from "cookies-next";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
} from "../../../../components";
import { UserPreferenceController } from "../../../../controllers/user-preference.controller";
import { safraService, userPreferencesService } from "../../../../services";
import { tableGlobalFunctions } from "../../../../helpers";
import ITabs from "../../../../shared/utils/dropdown";
import headerTableFactoryGlobal from "../../../../shared/utils/headerTableFactory";

interface IFilter {
  filterStatus: object | any;
  filterSafra: string | any;
  filterYear: string | any;
  filterYearFrom: string | number;
  filterYearTo: string | number;
  filterStartDate: string | any;
  filterEndDate: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

interface ISafra {
  id: number;
  id_culture: number;
  safraName: string;
  year: number;
  plantingStartTime: string;
  plantingEndTime: string;
  main_safra: string;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allSafras: ISafra[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  cultureId: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
}

export default function Listagem({
  allSafras,
  totalItems,
  itensPerPage,
  filterApplication,
  cultureId,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns();
  // eslint-disable-next-line no-return-assign, no-param-reassign
  tabsDropDowns.map((tab) =>
    tab.titleTab === "TMG" ? (tab.statusTab = true) : (tab.statusTab = false)
  );

  const router = useRouter();
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.safra || {
    id: 0,
    table_preferences:
      "id,safraName,year,plantingStartTime,plantingEndTime,status",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const [safras, setSafras] = useState<ISafra[]>(() => allSafras);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit)
  );
  const [filtersParams, setFiltersParams] = useState<any>(filterBeforeEdit); // Set filter Parameter
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);

  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: "CamposGerenciados[]", title: "Safra", value: "safraName" },
    { name: "CamposGerenciados[]", title: "Ano", value: "year" },
    {
      name: "CamposGerenciados[]",
      title: "Período ideal de início de plantio",
      value: "plantingStartTime",
    },
    {
      name: "CamposGerenciados[]",
      title: "Período ideal do fim do plantio",
      value: "plantingEndTime",
    },
    { name: "CamposGerenciados[]", title: "Status", value: "status" },
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
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(null);
  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterSafra: checkValue("filterSafra"),
      filterYear: checkValue("filterYear"),
      filterYearTo: "",
      filterYearFrom: "",
      filterStartDate: "",
      filterEndDate: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({
      filterStatus,
      filterSafra,
      filterYearTo,
      filterYearFrom,
      filterStartDate,
      filterEndDate,
    }) => {
      // Call filter with there parameter
      // const parametersFilter = await tableGlobalFunctions.handleFilterParameter('safra', filterStatus || 1,cultureId, filterSafra, filterYearTo, filterYearFrom, filterStartDate, filterEndDate);

      // const parametersFilter = `filterStatus=${filterStatus || 1}&filterSafra=${filterSafra}&filterYear=${filterYearTo}&filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}&id_culture=${cultureId}`;
      //   await safraService
      //     .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //     .then((response) => {
      //       setFilter(parametersFilter);
      //       setSafras(response.response);
      //       setTotalItems(response.total);
      //       setCurrentPage(0);
      //     });

      const parametersFilter = `filterStatus=${
        filterStatus || 2
      }&filterSafra=${filterSafra}&filterYearTo=${filterYearTo}&filterYearFrom=${filterYearFrom}&filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}&id_culture=${cultureId}`;

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
    setCookies("filtersParams", parametersFilter);

    await safraService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400) {
        setSafras(response.response);
        setTotalItems(response.total);
        tableRef.current.dataManager.changePageSize(
          response.total >= take ? take : response.total
        );
      }
    });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleStatusSafra(
    idItem: number,
    data: ISafra
  ): Promise<void> {
    if (data.status === 1) {
      data.status = 0;
    } else {
      data.status = 1;
    }

    const index = safras.findIndex((safra) => safra.id === idItem);

    if (index === -1) {
      return;
    }

    await safraService.updateSafras({
      id: idItem,
      status: data.status,
    });

    setSafras((oldSafra) => {
      const copy = [...oldSafra];
      copy[index].status = data.status;
      return copy;
    });

    const { id, safraName, year, plantingStartTime, plantingEndTime, status } =
      safras[index];

    await safraService.updateSafras({
      id,
      safraName,
      year,
      plantingStartTime,
      plantingEndTime,
      status,
    });
  }

  // async function handleOrder(
  //   column: string,
  //   order: string | any,
  // ): Promise<void> {
  //   let typeOrder: any;
  //   let parametersFilter: any;
  //   if (order === 1) {
  //     typeOrder = 'asc';
  //   } else if (order === 2) {
  //     typeOrder = 'desc';
  //   } else {
  //     typeOrder = '';
  //   }
  //   setOrderBy(column);
  //   setOrderType(typeOrder);
  //   if (filter && typeof filter !== 'undefined') {
  //     if (typeOrder !== '') {
  //       parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
  //     } else {
  //       parametersFilter = filter;
  //     }
  //   } else if (typeOrder !== '') {
  //     parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
  //   } else {
  //     parametersFilter = filter;
  //   }

  //   await safraService
  //     .getAll(`${parametersFilter}&skip=0&take=${take}`)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         setSafras(response.response);
  //       }
  //     });

  //   if (orderList === 2) {
  //     setOrder(0);
  //     setArrowOrder(<AiOutlineArrowDown />);
  //   } else {
  //     setOrder(orderList + 1);
  //     if (orderList === 1) {
  //       setArrowOrder(<AiOutlineArrowUp />);
  //     } else {
  //       setArrowOrder('');
  //     }
  //   }
  // }

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
      title: "Status",
      field: "status",
      sorting: false,
      searchable: false,
      filterPlaceholder: "Filtrar por status",
      render: (rowData: ISafra) => (
        <div className="h-8 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.safraName}`}
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                setCookies("filterBeforeEditTypeOrder", typeOrder);
                setCookies("filterBeforeEditOrderBy", orderBy);
                setCookies("filtersParams", filtersParams);
                setCookies("lastPage", "atualizar");
                router.push(
                  `/config/tmg/safra/atualizar?id=${rowData.id}&currentPage=${currentPage}&${filtersParams}`
                );
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div style={{ width: 5 }} />
          {rowData.status ? (
            <div className="h-7">
              <Button
                title="Ativo"
                icon={<FaRegThumbsUp size={14} />}
                onClick={async () =>
                  handleStatusSafra(rowData.id, {
                    status: rowData.status,
                    ...rowData,
                  })
                }
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
          ) : (
            <div className="h-7">
              <Button
                title="Inativo"
                icon={<FaRegThumbsDown size={14} />}
                onClick={async () =>
                  handleStatusSafra(rowData.id, {
                    status: rowData.status,
                    ...rowData,
                  })
                }
                bgColor="bg-red-800"
                textColor="white"
              />
            </div>
          )}
        </div>
      ),
    };
  }

  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(",");
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === "safraName") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Safra",
            title: "safraName",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "year") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Ano",
            title: "year",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "plantingStartTime") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Período ideal início de plantio",
            title: "plantingStartTime",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "plantingEndTime") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Período ideal fim do plantio",
            title: "plantingEndTime",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[index] === "status") {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function handleOrder(
    column: string,
    order: string | any,
    name: string | any
  ): Promise<void> {
    // Gobal manage orders
    const { typeOrderG, columnG, orderByG, arrowOrder } =
      await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(name);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
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
          module_id: 3,
        })
        .then((response) => {
          userLogado.preferences.safra = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      userLogado.preferences.safra = {
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
    await safraService.getAll(filter).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: any) => {
          if (row.status === 0) {
            row.status = "Inativos" as any;
          } else {
            row.status = "Ativos" as any;
          }
          row.Nome = row.safraName;
          row.Ano = row.year;
          row.Início_Plantio = row.plantingStartTime;
          row.Fim_Plantio = row.plantingEndTime;
          row.Status = row.status;

          delete row.safraName;
          delete row.year;
          delete row.plantingStartTime;
          delete row.plantingEndTime;
          delete row.status;
          delete row.id;
          delete row.tableData;

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "safras");

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
        XLSX.writeFile(workBook, "Safras.xlsx");
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
      <Head>
        <title>Listagem de safras</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar safras">
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
                  "
                >
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      id="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={checkValue("filterStatus")}
                      // defaultValue={filterStatusBeforeEdit[13]}
                      values={filtersStatusItem.map((id) => id)}
                      selected="2"
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Safra
                    </label>

                    <Input
                      placeholder="Nome da Safra"
                      id="filterSafra"
                      name="filterSafra"
                      defaultValue={checkValue("filterSafra")}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Ano
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterYearFrom"
                        name="filterYearFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterYearTo"
                        name="filterYearTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  {/* <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Data do início do plantio
                    </label>
                    <Input
                      placeholder="____-__-__"
                      id="filterStartDate"
                      name="filterStartDate"
                      onChange={formik.handleChange}
                      className="shadow
                          appearance-none
                          bg-white bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          w-full
                          py-2 px-3
                          text-gray-900
                          leading-tight
                          focus:text-gray-700
                           focus:bg-white
                            focus:border-blue-600
                            focus:outline-none
                        "
                    />
                  </div> */}

                  {/* <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Data do fim do plantio
                    </label>
                    <Input
                      placeholder="____-__-__"
                      id="filterEndDate"
                      name="filterEndDate"
                      onChange={formik.handleChange}
                      className="shadow
                          appearance-none
                          bg-white bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          w-full
                          py-2 px-3
                          text-gray-900
                          leading-tight
                          focus:text-gray-700
                           focus:bg-white
                            focus:border-blue-600 focus:outline-none
                        "
                    />
                  </div> */}

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
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

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={safras}
              options={{
                sorting: true,
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
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
                    <div className="h-12">
                      <Button
                        title="Cadastrar safra"
                        value="Cadastrar safra"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {
                          router.push("safra/cadastro");
                        }}
                        icon={<MdDateRange size={20} />}
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
                                    <div className="h-8 mb-2">
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
                          title="Exportar planilha de safras"
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
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

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

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `filterStatus=1&id_culture=${cultureId}`;

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "desc";

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "safraName";

  const { token } = req.cookies;
  // const { cultureId } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/safra`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1&id_culture=${cultureId}`;

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });

  // RR
  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("lastPage", { req, res });

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allSafras, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions
  ).then((response) => response.json());

  return {
    props: {
      allSafras,
      totalItems,
      itensPerPage,
      filterApplication,
      cultureId,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
    },
  };
};
