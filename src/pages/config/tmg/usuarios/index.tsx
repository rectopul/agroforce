import { useFormik } from "formik";
import MaterialTable from "material-table";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
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
import * as XLSX from "xlsx";

import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { removeCookies, setCookies } from "cookies-next";
import { tableGlobalFunctions } from "src/helpers";
import Swal from "sweetalert2";
import { userPreferencesService, userService } from "../../../../services";
import { handleFormatTel } from "../../../../shared/utils/tel";
import headerTableFactoryGlobal from "../../../../shared/utils/headerTableFactory";
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
import { UserPreferenceController } from "../../../../controllers/user-preference.controller";
import ComponentLoading from "../../../../components/Loading";

interface IUsers {
  id: number;
  name: string;
  cpf: string;
  login: string;
  tel: string;
  avatar: string;
  status: boolean;
}
interface IFilter {
  filterStatus: object | any;
  filterName: string | any;
  filterLogin: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allUsers: IUsers[];
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
}

export default function Listagem({
  allUsers,
  itensPerPage,
  filterApplication,
  totalItems,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const tabsDropDowns = TabsDropDowns("config");

  tabsDropDowns.map((tab) =>
    tab.titleTab === "TMG" &&
    tab.data.map((i) => i.labelDropDown === "Usuários")
      ? (tab.statusTab = true)
      : (tab.statusTab = false)
  );

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.usuario || {
    id: 0,
    table_preferences: "id,avatar,name,tel,login,status",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );
  const router = useRouter();
  const [users, setUsers] = useState<IUsers[]>(() => allUsers);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit)
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: "CamposGerenciados[]",
      title: "Avatar",
      value: "avatar",
      defaultChecked: () => camposGerenciados.includes("avatar"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Nome",
      value: "name",
      defaultChecked: () => camposGerenciados.includes("name"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Login",
      value: "login",
      defaultChecked: () => camposGerenciados.includes("login"),
    },
    {
      name: "CamposGerenciados[]",
      title: "Telefone",
      value: "tel",
      defaultChecked: () => camposGerenciados.includes("tel"),
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
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == "desc" ? 1 : 2
  );
  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const filters = [
    { id: 2, name: "Todos" },
    { id: 1, name: "Ativos" },
    { id: 0, name: "Inativos" },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split("");
  const columns = colums(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterName: checkValue("filterName"),
      filterLogin: checkValue("filterLogin"),
      orderBy: "",
      typeOrder: "",
    },
    onSubmit: async ({ filterStatus, filterName, filterLogin }) => {
      // Call filter with there parameter
      // const parametersFilter = await tableGlobalFunctions.handleFilterParameter('usuarios', filterStatus || 1, filterName, filterLogin);

      // setFiltersParams(parametersFilter);
      // setCookiess('filterBeforeEdit', filtersParams);

      // await userService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setUsers(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });

      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterName=${filterName}&filterLogin=${filterLogin}`;

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

    //parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies("filtersParams", parametersFilter);

    await userService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setUsers(response.response);
          setTotalItems(response.total); // Set new total records
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
  //           onClick={() => handleOrder(title, orderList, name)}
  //         >
  //           {name}
  //         </button>
  //         {fieldOrder === name && (
  //           <div className="pl-2">
  //             {orderList !== 0 ? (
  //               orderList === 1 ? (
  //                 <AiOutlineArrowDown size={15} />
  //               ) : (
  //                 <AiOutlineArrowUp size={15} />
  //               )
  //             ) : null}
  //           </div>
  //         )}
  //       </div>
  //     ),
  //     field: title,
  //     sorting: false,
  //   };
  // }

  function headerTableTelFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button
            className="font-medium text-gray-900"
            onClick={() => handleOrder(title, orderList, name)}
          >
            {name}
          </button>
          {fieldOrder === name && (
            <div className="pl-2">
              {orderList !== 0 ? (
                orderList === 1 ? (
                  <AiOutlineArrowDown size={15} />
                ) : (
                  <AiOutlineArrowUp size={15} />
                )
              ) : null}
            </div>
          )}
        </div>
      ),
      field: title,
      sorting: false,
      render: (rowData: IUsers) => handleFormatTel(rowData.tel),
    };
  }

  async function handleStatus(data: any): Promise<void> {
    // if (data.status === 1) {
    //   data.status = 0;
    // } else {
    //   data.status = 1;
    // }

    // const index = users.findIndex((user) => user.id === data?.id);

    await userService.update({
      id: data?.id,
      status: data.status == 1 ? 0 : 1,
      created_by: userLogado.id,
    });

    // if (index === -1) return;

    // setUsers((oldUser) => {
    //   const copy = [...oldUser];
    //   copy[index].status = data.status;
    //   return copy;
    // });

    // const { id, name, login, tel, status, avatar } = users[index];

    // await userService.update({
    //   id,
    //   name,
    //   login,
    //   tel,
    //   status,
    //   avatar,
    //   created_by: userLogado.id,
    // });

    handlePagination(currentPage);
  }

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
      field: "status",
      sorting: false,
      searchable: false,
      filterPlaceholder: "Filtrar por status",
      render: (rowData: IUsers) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.name}`}
              onClick={() => {
                setCookies("pageBeforeEdit", currentPage?.toString());
                setCookies("filterBeforeEdit", filter);
                setCookies("filterBeforeEditTypeOrder", typeOrder);
                setCookies("filterBeforeEditOrderBy", orderBy);
                setCookies("filtersParams", filtersParams);
                setCookies("itensPage", itensPerPage);
                setCookies("lastPage", "atualizar");
                setCookies("takeBeforeEdit", take);
                router.push(`/config/tmg/usuarios/atualizar?id=${rowData.id}`);
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div style={{ width: 5 }} />
          <div className="h-7">
            <ButtonToogleConfirmation
              data={rowData}
              text="o usuário"
              keyName="name"
              onPress={handleStatus}
            />
          </div>
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

      if (columnCampos[item] === "avatar") {
        tableFields.push({
          title: "Avatar",
          field: "avatar",
          sorting: false,
          width: 0,
          exports: false,
          render: (rowData: IUsers) =>
            !rowData.avatar || rowData.avatar === "" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="https://media-exp1.licdn.com/dms/image/C4E0BAQGtzqdAyfyQxw/company-logo_200_200/0/1609955662718?e=2147483647&v=beta&t=sfA6x4MWOhWda5si7bHHFbOuhpz4ZCTdeCPtgyWlAag"
                alt={rowData.name}
                style={{ width: 30, height: 30, borderRadius: 99999 }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={rowData.avatar}
                alt={rowData.name}
                style={{ width: 30, height: 30, borderRadius: 99999 }}
              />
            ),
        });
      }
      if (columnCampos[item] === "name") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Nome",
            title: "name",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }

      if (columnCampos[item] === "login") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Login",
            title: "login",
            orderList,
            fieldOrder,
            handleOrder,
          })
        );
      }
      if (columnCampos[item] === "tel") {
        tableFields.push(
          headerTableFactoryGlobal({
            name: "Telefone",
            title: "tel",
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: IUsers) => handleFormatTel(rowData.tel),
          })
        );
        // tableFields.push({
        //   title: "Telefone",
        //   field: "tel",
        //   sorting: false,
        //   render: (rowData: IUsers) => handleFormatTel(rowData.tel),
        // });
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
    name: string
  ): Promise<void> {
    // // Manage orders of colunms
    // const parametersFilter = await tableGlobalFunctions.handleOrderGlobal(column, order, filter, 'safra');

    // const value = await tableGlobalFunctions.skip(currentPage, parametersFilter);

    // await userService
    //   .getAll(value)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setUsers(response.response);
    //       setFiltersParams(parametersFilter);
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
    typeOrderG !== "" ? (typeOrderG == "desc" ? setOrder(1) : setOrder(2)) : "";
    setOrderBy(columnG);
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
          module_id: 1,
        })
        .then((response) => {
          userLogado.preferences.usuario = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      userLogado.preferences.usuario = {
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
    if (!filterApplication.includes("paramSelect")) {
      // filterApplication += `&paramSelect=${camposGerenciados}`;
    }

    await userService.getAll(filter).then((response) => {
      if (response.status === 200) {
        /* const newData = users.map((row: { avatar: any; status: any }) => {
          delete row.avatar;
          if (row.status === 0) {
            row.status = 'Inativo';
          } else {
            row.status = 'Ativo';
          }
          return row;
        }); */

        const dataExcel: any = response.response;
        dataExcel.forEach((line: any) => {
          if (line.status === 0) {
            line.status = "Inativo";
          } else {
            line.status = "Ativo";
          }

          line.LOGIN = line.login;
          line.NOME = line.name;
          line.TEL = line.tel;
          line.STATUS = line.status;
          line.CPF = line.cpf;

          delete line.avatar;
          delete line.id;
          delete line.email;
          delete line.name;
          delete line.tel;
          delete line.login;
          delete line.cpf;
          delete line.status;
        });

        const workSheet = XLSX.utils.json_to_sheet(dataExcel);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "usuarios");

        // Buffer
        const buf = XLSX.write(workBook, {
          bookType: "xlsx", // xlsx || csv
          type: "buffer",
        });
        // Binary
        XLSX.write(workBook, {
          bookType: "xlsx", // xlsx || csv
          type: "binary",
        });
        // Download xlsx || csv
        XLSX.writeFile(workBook, "Usuários.xlsx");
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
    // // manage using comman function
    // const { parametersFilter, currentPages } = await tableGlobalFunctions.handlePaginationGlobal(currentPage, take, filtersParams);

    // await userService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setUsers(response.response);
    //     setTotalItems(response.total); // Set new total records
    //     setCurrentPage(currentPages); // Set new current page
    //     setTimeout(removestate, 7000); // Remove State
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

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-6 w-1/2 ml-4">
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

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Listagem de usuários</title>
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
            title="Filtrar usuários"
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
                  <div className="h-6 w-1/2 ml-4">
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

                  {filterFieldFactory("filterName", "Nome")}
                  {filterFieldFactory("filterLogin", "Login")}

                  <FieldItemsPerPage selected={take} onChange={setTake} />

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
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

          {/* overflow-y-scroll */}
          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={users}
              options={{
                sorting: true,
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
                        title="Cadastrar usuário"
                        value="Cadastrar usuário"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {
                          setCookies("pageBeforeEdit", currentPage?.toString());
                          setCookies("filterBeforeEdit", filter);
                          setCookies("filterBeforeEditTypeOrder", typeOrder);
                          setCookies("filterBeforeEditOrderBy", orderBy);
                          setCookies("filtersParams", filtersParams);
                          setCookies("takeBeforeEdit", take);
                          setCookies("lastPage", "cadastro");
                          router.push("usuarios/cadastro");
                        }}
                        icon={<FiUserPlus size={20} />}
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
                          title="Exportar planilha de usuários"
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
  const { token } = req.cookies;
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
    removeCookies("filtersParams", { req, res });
    removeCookies("itensPage", { req, res });
  }

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : "filterStatus=1";
  const filterApplication = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : "filterStatus=1";

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "asc";

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "name";

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });
  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("takeBeforeEdit", { req, res });
  removeCookies("lastPage", { req, res });
  removeCookies("filtersParams", { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const users = await fetch(urlParameters.toString(), requestOptions);
  const { response: allUsers, total: totalItems } = await users.json();

  return {
    props: {
      allUsers,
      totalItems,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
