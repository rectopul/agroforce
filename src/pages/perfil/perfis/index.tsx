import { profile } from 'console';
import { removeCookies, setCookies } from 'cookies-next';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BiEdit, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { MdDateRange, MdFirstPage, MdLastPage } from 'react-icons/md';
import { Button } from '../../../components/Button';
import { Content } from '../../../components/Content';
import { profileService } from '../../../services';
import headerTableFactoryGlobal from '../../../shared/utils/headerTableFactory';

export default function Perfis({
  allProfiles,
  totalItems,
  itensPerPage,
  pageBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const tableRef = useRef<any>(null);
  const router = useRouter();

  const [profiles, setProfiles] = useState<any>(() => allProfiles);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [itemsTotal, setTotalItems] = useState<number>(totalItems);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);
  const preferences = userLogado.preferences.profiles || {
    id: 0,
    table_preferences:
      'id,name,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  async function callingApi(page: any = 0) {
    setCurrentPage(page);
    const params = '';
    await profileService
      .getAll(params)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setProfiles(response.response);
          setTotalItems(response.total);
          tableRef.current.dataManager.changePageSize(
            // response.total >= take ? take : response.total,
            20,
          );
        }
      });
  }

  useEffect(() => {
    callingApi(currentPage);
  }, [typeOrder]);

  async function handleOrder(): Promise<void> {
    // teste
  }

  async function handlePagination(page: any): Promise<void> {
    await callingApi(page); // handle pagination globly
  }

  function statusHeaderFactory() {
    return {
      title: 'Ação',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: any) => (
        <div className="h-8 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.name}`}
              onClick={() => {
                router.push(
                  `/perfil/perfis/permissoes?id=${rowData.id}`,
                );
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>

        </div>
      ),
    };
  }

  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'name') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome',
            title: 'name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  return (
    <>
      <Head>
        <title>Perfis</title>
      </Head>
      <Content contentHeader={[]} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
          overflow-y-hidden
        "
        >

          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={profiles}
              options={{
                sorting: true,
                showTitle: false,
                headerStyle: {
                  zIndex: 1,
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
                        title="Cadastrar perfil"
                        value="Cadastrar perfil"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {
                          router.push('perfil/perfis/cadastro');
                        }}
                        icon={<MdDateRange size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>
                  </div>
                ),
                Pagination: (props) => (
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
                      .fill('')
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
  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('itensPage', { req, res });
  }

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : '';

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'asc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  const { token } = req.cookies;
  // const { cultureId } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/profile`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : '';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams('').toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allProfiles, total: totalItems } = await fetch(
    urlParameters.toString(),
    requestOptions,
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
