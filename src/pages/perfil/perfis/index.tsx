import { profile } from "console";
import { removeCookies, setCookies } from "cookies-next";
import MaterialTable from "material-table";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import getConfig from "next/config";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow, BiSlider} from "react-icons/bi";
import { MdDateRange, MdFirstPage, MdLastPage } from "react-icons/md";
import Swal from "sweetalert2";
import { Button } from "../../../components/Button";
import { Content } from "../../../components/Content";
import {assayListService, profileService} from "../../../services";
import ComponentLoading from '../../../components/Loading';
import headerTableFactoryGlobal from "../../../shared/utils/headerTableFactory";
import { perm_can_do } from "../../../shared/utils/perm_can_do";
import {BsTrashFill} from "react-icons/bs";
import {AccordionFilter, FieldItemsPerPage, Input, ModalConfirmation, Select} from "../../../components";
import { useFormik } from 'formik';
import {tableGlobalFunctions} from "../../../helpers";

interface IFilter {
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export default function Perfis({
   allProfiles,
   totalItems,
   itensPerPage,
   filterApplication,
   pageBeforeEdit,
   filterBeforeEdit,
   typeOrderServer, // RR
   orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const tableRef = useRef<any>(null);
  const router = useRouter();

  const [profiles, setProfiles] = useState<any>(() => allProfiles);
  
  const [filter, setFilter] = useState<any>(filterApplication);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit)
  );
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == "desc" ? 1 : 2
  );
  const [arrowOrder, setArrowOrder] = useState<any>("");
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);
  const preferences = userLogado.preferences.profiles || {
    id: 0,
    table_preferences: "id,name,status",
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences
  );

  const [itemSelectedDelete, setItemSelectedDelete] = useState<any>(null);

  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);

    // parametersFilter = `${parametersFilter}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;
    
    const params = "";
    try {
      await profileService.getAll(parametersFilter).then((response) => {
        if (response.status === 200 || response.status === 400) {
          setProfiles(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(response.total >= take ? take : response.total);
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Falha ao buscar perfis",
        html: `Ocorreu um erro ao buscar perfis. Tente novamente mais tarde.`,
        width: "800",
      });
    }
  }

  // useEffect(() => {
  //   callingApi(currentPage);
  // }, [typeOrder, filter]);

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder, filter]);

  async function handleOrder(): Promise<void> {
    // teste
  }
  
  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(",");
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === "name") {
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
      if (columnCampos[index] === "status") {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function handlePagination(page: any): Promise<void> {
    await callingApi(filter, page); // handle pagination globly
  }

  function statusHeaderFactory() {
    return {
      title: "Ação",
      field: "status",
      sorting: false,
      searchable: false,
      filterPlaceholder: "Filtrar por status",
      render: (rowData: any) => (
        <div className="h-8 flex">
          <div className="h-7 mr-3">
            <Button
              icon={<BsTrashFill size={14} />}
              style={{ display: (!perm_can_do('/perfil/perfis', 'delete') && false) ? 'none' : '' }}
              title="Excluir perfil"
              onClick={() => { deleteConfirmItem(rowData); }}
              bgColor="bg-red-600"
              textColor="white"
            />
          </div>
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.name}`}
              style={{
                display: !perm_can_do("/perfil/perfis", "edit") ? "none" : "",
              }}
              onClick={() => {
                router.push(`/perfil/perfis/atualizar?id=${rowData.id}`);
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
          <div className="h-7 ml-3">
            <Button
              value="Permissões"
              title={`Permissões de ${rowData.name}`}
              style={{
                display: !perm_can_do("/perfil/perfis", "permissions")
                  ? "none"
                  : "",
              }}
              onClick={() => {
                router.push(`/perfil/perfis/permissoes?id=${rowData.id}`);
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
        </div>
      ),
    };
  }
  
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);

  async function deleteConfirmItem(item: any) {
    setItemSelectedDelete(item);
    setIsOpenModalConfirm(true);
  }

  async function deleteItem() {
    
    setIsOpenModalConfirm(false);
    
    setLoading(true);

    try {
      const {status, message} = await profileService.deleted({
        id: itemSelectedDelete?.id,
        userId: userLogado.id,
      });
      
      console.log('status', status, 'message', message);

      setLoading(false);
      
      if (status === 200) {
        
        handlePagination(currentPage);

        Swal.fire({
          html: message,
          width: '800',
        });
        
      } else {
        
        Swal.fire({
          html: message,
          width: '800',
        });
        
      }
    } catch (error) {
      
      setLoading(false);
      
      console.log('error', error);
      
      Swal.fire({
        title: "Falha ao buscar perfis",
        html: `Ocorreu um erro ao excluir este perfil. Tente novamente mais tarde. DETALHE: ${error}`,
        width: "800",
      });
      
    }
  }

  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams,
    );
    return parameter;
  }

  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const formik = useFormik<IFilter>({
    initialValues: {
      filterSearch: checkValue('filterSearch'),
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({ filterSearch }) => {
      const parametersFilter = `filterSearch=${filterSearch}`;

      setFilter(parametersFilter);
      setCurrentPage(0);

      await callingApi(parametersFilter);
      setLoading(false);
    },
  });

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Perfis</title>
      </Head>

      <ModalConfirmation
        isOpen={isOpenModalConfirm}
        text={`Tem certeza que deseja deletar o perfil ${itemSelectedDelete?.name}?`}
        onPress={deleteItem}
        onCancel={() => setIsOpenModalConfirm(false)}
      />
      
      <Content contentHeader={[]} moduloActive="config">
        <main className="h-full w-full flex flex-col items-start gap-4 overflow-y-hidden">

          <AccordionFilter title="Filtrar perfis" onChange={(_, e) => setStatusAccordionFilter(e)}>
            <div className="w-full flex gap-2">
              <form className="flex flex-col w-full items-center px-4 bg-white" onSubmit={formik.handleSubmit}>
                <div className="w-full h-full flex justify-center pb-0">
                  {/*<div className="h-6 w-1/2 ml-4">*/}
                  {/*  <label className="block text-gray-900 text-sm font-bold mb-1">Status</label>*/}
                  {/*  <Select*/}
                  {/*    name="filterStatus"*/}
                  {/*    onChange={formik.handleChange}*/}
                  {/*    // defaultValue={checkValue('filterStatus')}*/}
                  {/*    defaultValue={filterStatusBeforeEdit[13]}*/}
                  {/*    values={filtersStatusItem.map((id) => id)}*/}
                  {/*    selected="1"*/}
                  {/*  />*/}
                  {/*</div>*/}
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="Perfil"
                      defaultValue={checkValue('filterSearch')}
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
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
          
          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: "#f9fafb" }}
              columns={columns}
              data={profiles}
              options={{
                sorting: true,
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${statusAccordionFilter ? 410 : 320}px)`,
                headerStyle: {zIndex: 1},
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
                        title="Cadastrar perfil"
                        value="Cadastrar perfil"
                        bgColor="bg-blue-600"
                        textColor="white"
                        style={{
                          display: !perm_can_do("/perfil/perfis", "create")
                            ? "none"
                            : "",
                        }}
                        onClick={() => {
                          router.push("/perfil/perfis/cadastro");
                        }}
                        icon={<MdDateRange size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado: {itemsTotal}
                    </strong>
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
                        onClick={() => {
                          handlePagination(currentPage - 1);
                        }}
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
                        bgColor="bg-blue-600 RR"
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
  // Last page
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : "No";

  if (lastPageServer == undefined || lastPageServer == "No") {
    removeCookies("filterBeforeEdit", { req, res });
    removeCookies("pageBeforeEdit", { req, res });
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("lastPage", { req, res });
    removeCookies("urlPage", { req, res });
    removeCookies("itensPage", { req, res });
  }

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : "";

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : "asc";

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : "";

  const { token } = req.cookies;
  // const { cultureId } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/profile`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1`;

  removeCookies("filterBeforeEdit", { req, res });
  removeCookies("pageBeforeEdit", { req, res });
  removeCookies("takeBeforeEdit", { req, res });
  removeCookies("filterBeforeEditTypeOrder", { req, res });
  removeCookies("filterBeforeEditOrderBy", { req, res });
  removeCookies("lastPage", { req, res });

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  // v2
  const urlParameters: any = new URL(baseUrl);
  //urlParameters.search = new URLSearchParams("").toString();
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;
  
  console.log('urlParameters.toString()', urlParameters.toString());
  
  const { response: allProfiles, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions
  ).then((response) => response.json());

  return {
    props: {
      allProfiles,
      totalItems,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
    },
  };
};
