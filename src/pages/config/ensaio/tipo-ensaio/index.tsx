/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import { RiFileExcel2Line, RiOrganizationChart } from "react-icons/ri";
import * as XLSX from "xlsx";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { typeAssayService, userPreferencesService } from "../../../../services";
import { UserPreferenceController } from "../../../../controllers/user-preference.controller";
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from "../../../../components";
import * as ITabs from "../../../../shared/utils/dropdown";

interface ITypeAssayProps {
  id: number;
  name: string;
  envelope?: [];
  created_by: number;
  status: number;
}

interface IFilter {
  filterStatus: string;
  filterName: string;
  filterProtocolName: string;
  orderBy: string;
  typeOrder: string;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allTypeAssay: ITypeAssayProps[];
  totalItems: number;
  filter: string;
  itensPerPage: number;
  filterApplication: object;
  idCulture: number;
  idSafra: string;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string;
}

export default function TipoEnsaio({
  allTypeAssay,
  itensPerPage,
  filterApplication,
  totalItems,
  idCulture,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) =>
    tab.titleTab === "ENSAIO" ? (tab.statusTab = true) : (tab.statusTab = false)
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.tipo_ensaio || {
    id: 0,
    table_preferences: "id,name,protocol_name,envelope,status",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );

  const [typeAssay, setTypeAssay] = useState<ITypeAssayProps[]>(
    () => allTypeAssay
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit)
  );
  const [orderList, setOrder] = useState<number>(1);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: "CamposGerenciados[]",
      title: "Favorito ",
      value: "id",
      defaultChecked: () => camposGerenciados.includes("id"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome",
      value: "name",
      defaultChecked: () => camposGerenciados.includes("name"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome do Protocolo",
      value: "protocol_name",
      defaultChecked: () => camposGerenciados.includes("protocol_name"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Quant. de sementes por envelope",
      value: "envelope",
      defaultChecked: () => camposGerenciados.includes("envelope"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Status",
      value: "status",
      defaultChecked: () => camposGerenciados.includes("status"),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>("");
  const router = useRouter();
  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: "",
      filterName: "",
      filterProtocolName: "",
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({ filterStatus, filterName, filterProtocolName }) => {
      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterName=${filterName}&filterProtocolName=${filterProtocolName}&id_culture=${idCulture}&id_safra=${idSafra}`;
      setFiltersParams(parametersFilter);
      setCookies("filterBeforeEdit", filtersParams);
      await typeAssayService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response) => {
          setFilter(parametersFilter);
          setTypeAssay(response.response);
          setTotalItems(response.total);
          setCurrentPage(0);
        });
    },
  });

  const filters = [
    { id: 2, name: "Todos" },
    { id: 1, name: "Ativos" },
    { id: 0, name: "Inativos" },
  ];

  const filterStatus = filterBeforeEdit.split("");

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

    await typeAssayService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then((response) => {
        if (response.status === 200) {
          setTypeAssay(response.response);
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
  }

  async function handleStatus(id: number, status: any): Promise<void> {
    let newStatus: any;
    if (status) {
      newStatus = 1;
    } else {
      newStatus = 0;
    }

    await typeAssayService.update({ id, newStatus });

    const index = typeAssay.findIndex(
      (typeAssayIndex) => typeAssayIndex.id === id
    );

    if (index === -1) {
      return;
    }

    setTypeAssay((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = newStatus;
      return copy;
    });
  }

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

  function statusHeaderFactory() {
    return {
      title: "Status",
      field: "status",
      sorting: false,
      searchable: false,
      filterPlaceholder: "Filtrar por status",
      render: (rowData: ITypeAssayProps) =>
        rowData.status ? (
          <div className="h-7 flex">
            <div className="h-7">
              <Button
                icon={<BiEdit size={14} />}
                title={`Atualizar ${rowData.name}`}
                onClick={() => {
                  setCookies("pageBeforeEdit", currentPage?.toString());
                  setCookies("filterBeforeEdit", filtersParams);
                  router.push(
                    `/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`
                  );
                }}
                bgColor="bg-blue-600"
                textColor="white"
              />
            </div>
            <div style={{ width: 5 }} />
            <div>
              <Button
                icon={<FaRegThumbsUp size={14} />}
                onClick={() => handleStatus(rowData.id, !rowData.status)}
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
          </div>
        ) : (
          <div className="h-7 flex">
            <div className="h-7">
              <Button
                icon={<BiEdit size={14} />}
                onClick={() => {}}
                bgColor="bg-blue-600"
                textColor="white"
                href={`/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`}
              />
            </div>
            <div style={{ width: 5 }} />
            <div>
              <Button
                icon={<FaRegThumbsDown size={14} />}
                onClick={() => handleStatus(rowData.id, !rowData.status)}
                bgColor="bg-red-800"
                textColor="white"
              />
            </div>
          </div>
        ),
    };
  }

  function colums(columnsOrder: any): any {
    const columnOrder: any = columnsOrder.split(",");
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item) => {
      if (columnOrder[item] === "id") {
        tableFields.push(idHeaderFactory());
      }
      if (columnOrder[item] === "name") {
        tableFields.push(headerTableFactory("Nome", "name"));
      }
      if (columnOrder[item] === "protocol_name") {
        tableFields.push(
          headerTableFactory("Nome do Protocolo", "protocol_name")
        );
      }
      if (columnOrder[item] === "envelope") {
        tableFields.push(
          headerTableFactory(
            "Quant. de sementes por envelope",
            "envelope.seeds"
          )
        );
      }
      if (columnOrder[item] === "status") {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = colums(camposGerenciados);

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
          module_id: 9,
        })
        .then((response) => {
          userLogado.preferences.tipo_ensaio = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      userLogado.preferences.tipo_ensaio = {
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
    await typeAssayService
      .getAll(filterApplication)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((row: any) => {
            const newRow = row;
            newRow.envelope = row.envelope.seeds;
            newRow.status = row.status === 0 ? "Inativo" : "Ativo";
            return newRow;
          });

          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, "Tipo_Ensaio");

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
          XLSX.writeFile(workBook, "Tipo_Ensaio.xlsx");
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
    let parametersFilter = `skip=${skip}&take=${take}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await typeAssayService
      .getAll(parametersFilter)
      .then(({ status, response }) => {
        if (status === 200) {
          setTypeAssay(response);
        }
      });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem Tipos de Ensaio</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar tipos de ensaio">
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
                  pb-2
                "
                >
                  <div className="h-6 w-1/2 ml-4">
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
                  </div>

                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome"
                      max="40"
                      id="filterName"
                      name="filterName"
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome do Protocolo
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome do Protocolo"
                      max="40"
                      id="filterProtocolName"
                      name="filterProtocolName"
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
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
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={typeAssay}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: "#f9fafb" },
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
                    <div className="h-12">
                      <Button
                        title="Cadastrar Tipo Ensaio"
                        value="Cadastrar Tipo Ensaio"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {}}
                        href="/config/ensaio/tipo-ensaio/cadastro"
                        icon={<RiOrganizationChart size={20} />}
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
                          title="Exportar planilha de ensaios"
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
                        onClick={() => setCurrentPage(currentPage + 10)}
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
  // eslint-disable-next-line max-len
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : "filterStatus=1";
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/type-assay`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}&id_culture=${idCulture}&id_safra=${idSafra}`
    : `filterStatus=1&id_culture=${idCulture}&id_safra=${idSafra}`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}&id_safra=${idSafra}`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allTypeAssay, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions
  ).then((response) => response.json());

  return {
    props: {
      allTypeAssay,
      totalItems,
      itensPerPage,
      filterApplication,
      idCulture,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
