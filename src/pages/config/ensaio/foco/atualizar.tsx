/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import { capitalize } from '@mui/material';
import { setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { BiEdit, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FaSortAmountUpAlt } from 'react-icons/fa';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineFileSearch,
  AiTwotoneStar,
} from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  AccordionFilter,
  CheckBox,
  Button,
  Content,
  Input,
  ManageFields,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { groupService, userPreferencesService } from '../../../../services';
import { focoService } from '../../../../services/foco.service';
import * as ITabs from '../../../../shared/utils/dropdown';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';

export interface IUpdateFoco {
  id: number;
  name: string;
  created_by: number;
}

interface IData {
  allItens: any;
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  idFoco: number;
  idSafra: number;
  foco: IUpdateFoco;
  pageBeforeEdit: string | any;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

export default function Atualizar({
  foco,
  allItens,
  totalItems,
  itensPerPage,
  filterApplication,
  idFoco,
  idSafra,
  pageBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'group';
  const module_name = 'grupos';
  const module_id = 20;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,safra,name,group,action';
  const preferencesDefault = {
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  };

  const [preferences, setPreferences] = useState<any>(
    userLogado.preferences[identifier_preference] || preferencesDefault,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  function validateInputs(values: any) {
    // for of values and trim fields typeof string
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim();
      }
    }
    if (!values.name) {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = 'red';
    } else {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = '';
    }
  }

  const formik = useFormik<IUpdateFoco>({
    initialValues: {
      id: foco.id,
      name: foco.name,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire(
          'Preencha todos os campos obrigatórios destacados em vermelho.',
        );
        setLoading(false);
        return;
      }

      try {
        await focoService
          .update({
            id: foco.id,
            name: (formik.values.name?.trim()),
            id_culture: Number(culture),
            created_by: userLogado.id,
          })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire('Foco atualizado com sucesso!');
              setLoading(false);
              router.back();
            } else {
              setLoading(false);
              Swal.fire(response.message);
            }
          });
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao atualizar foco',
          html: `Ocorreu um erro ao atualizar foco. Tente novamente mais tarde.`,
          width: '800',
        });
      }
    },
  });

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [grupos, setGrupos] = useState<any>(() => allItens);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const itemsTotal = totalItems;
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Safra', value: 'safra' },
    { name: 'CamposGerenciados[]', title: 'Grupo', value: 'group' },
    { name: 'CamposGerenciados[]', title: 'Ação', value: 'action' },
  ]);
  const filter = filterApplication;
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [orderType, setOrderType] = useState<string>('');
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }
    setOrderBy(column);
    setOrderType(typeOrder);
    if (filter && typeof filter !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_foco${idFoco}`;
    } else {
      parametersFilter = filter;
    }

    await groupService
      .getAll(`${parametersFilter}&skip=0&take=${take}&id_safra=${idSafra}`)
      .then((response: any) => {
        if (response.status === 200) {
          setGrupos(response.response);
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
        setArrowOrder('');
      }
    }

    // setFieldOrder(columnG);
  }

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
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (colorStar === '#eba417' ? (
        <div className="h-7 flex">
          <div>
            <button
              type="button"
              className="w-full h-full flex items-center justify-center border-0"
              onClick={() => setColorStar('')}
            >
              <AiTwotoneStar size={20} color="#eba417" />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-7 flex">
          <div>
            <button
              type="button"
              className="w-full h-full flex items-center justify-center border-0"
              onClick={() => setColorStar('#eba417')}
            >
              <AiTwotoneStar size={20} />
            </button>
          </div>
        </div>
      )),
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Ação',
      field: 'action',
      sorting: false,
      render: (rowData: any) => (!rowData.npe.length ? (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={16} />}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                router.push(`grupo/atualizar?id=${rowData.id}`);
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
        </div>
      ) : (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={16} />}
              title="Grupo já associado a uma NPE"
              disabled
              bgColor="bg-gray-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
        </div>
      )),
    };
  }

  function columnsOrder(columnOrder: string) {
    const columnCampos: string[] = columnOrder.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'safra') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Safra',
            title: 'safra.safraName',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'group') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Grupo',
            title: 'group',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'action') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = '';
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
          module_id: 20,
        })
        .then((response) => {
          userLogado.preferences.group = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.group = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
      };
      await userPreferencesService.update({
        table_preferences: campos,
        id: preferences.id,
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
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
    await groupService
      .getAll(filterApplication)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((row: any) => {
            const newRow = row;

            newRow.SAFRA = row.safra.safraName;
            newRow.GRUPO = Number(row.group);
            newRow.FOCO = row.foco.name;

            delete newRow.npe;
            delete newRow.safra;
            delete newRow.foco;
            delete newRow.id_foco;
            delete newRow.group;
            delete newRow.id;
            return newRow;
          });

          // newData.map((item: any) => {
          //   item.foco = item.foco?.name;
          //   item.safra = item.safra?.safraName;
          //   return item;
          // });

          const workSheet = XLSX.utils.json_to_sheet(newData);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, 'group');

          // Buffer
          XLSX.write(workBook, {
            bookType: 'xlsx', // xlsx
            type: 'buffer',
          });
          // Binary
          XLSX.write(workBook, {
            bookType: 'xlsx', // xlsx
            type: 'binary',
          });
          // Download
          XLSX.writeFile(workBook, 'grupos.xlsx');
        } else {
          Swal.fire('Nenhum dado para extrair');
        }
      });
    setLoading(false);
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
      parametersFilter = `skip=${skip}&take=${take}&id_safra=${idSafra}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}&id_safra=${idSafra}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await groupService.getAll(parametersFilter).then((response: any) => {
      if (response.status === 200) {
        setGrupos(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Atualizar foco</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="w-full
          shadow-md
          flex flex-col
          items-start
          gap-0
          overflow-y-hidden
        "
        >
          <form
            className="w-full bg-white shadow-md rounded p-4"
            onSubmit={formik.handleSubmit}
          >
            <h1 className="text-xl">Atualizar foco</h1>

            <div
              className="w-1/2
              flex
              justify-around
              gap-6
              mt-2
              mb-4
          "
            >
              <div className="w-full">
                <label className="block text-gray-900 text-sm font-bold mb-1">
                  Nome
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  max="50"
                  placeholder="Foco"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div>
            </div>

            <div
              className="
              h-7 w-full
              flex
              gap-3
              justify-center
              mt-4
            "
            >
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
                  type="submit"
                  value="Atualizar"
                  bgColor="bg-blue-600"
                  textColor="white"
                  icon={<AiOutlineFileSearch size={20} />}
                  onClick={() => {
                    setLoading(true);
                  }}
                />
              </div>
            </div>
          </form>

          <div style={{ marginTop: '1%' }} className="w-full h-auto">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={grupos}
              options={{
                showTitle: false,
                maxBodyHeight: 'calc(100vh - 435px)',
                headerStyle: {
                  zIndex: 1,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
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
                        title={
                          grupos.length
                            ? 'Grupo ja cadastrado na safra'
                            : 'Cadastrar grupo'
                        }
                        // title="Cadastrar grupo"
                        value={`${
                          grupos.length
                            ? 'Grupo ja cadastrado na safra'
                            : 'Cadastrar grupo'
                        }`}
                        // value="Cadastrar grupo"
                        bgColor={grupos.length ? 'bg-gray-400' : 'bg-blue-600'}
                        // bgColor="bg-blue-600"
                        textColor="white"
                        disabled={grupos.length}
                        onClick={() => {
                          router.push(`grupo/cadastro?id_foco=${idFoco}`);
                        }}
                        icon={<FaSortAmountUpAlt size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <ManageFields
                        statusAccordionExpanded={false}
                        generatesPropsDefault={generatesProps}
                        camposGerenciadosDefault={camposGerenciadosDefault}
                        preferences={preferences}
                        preferencesDefault={preferencesDefault}
                        userLogado={userLogado}
                        label="Gerenciar Campos"
                        table={table}
                        module_name={module_name}
                        module_id={module_id}
                        identifier_preference={identifier_preference}
                        OnSetStatusAccordion={(e: any) => {
                          setStatusAccordion(e);
                        }}
                        OnSetGeneratesProps={(e: any) => {
                          setGeneratesProps(e);
                        }}
                        OnSetCamposGerenciados={(e: any) => {
                          setCamposGerenciados(e);
                        }}
                        OnColumnsOrder={(e: any) => {
                          columnsOrder(e);
                        }}
                        OnSetUserLogado={(e: any) => {
                          setUserLogado(e);
                        }}
                        OnSetPreferences={(e: any) => {
                          setPreferences(e);
                        }}
                      />

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de grupos"
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
                      .fill('')
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
  query,
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 5;

  const { token } = req.cookies;
  const idSafra = req.cookies.safraId;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const idFoco = Number(query.id);
  const filterApplication = `&id_foco=${idFoco}`;

  const { publicRuntimeConfig } = getConfig();
  const baseUrlGrupo = `${publicRuntimeConfig.apiUrl}/grupo`;
  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/foco`;

  const { response: allItens, total: totalItems } = await fetch(
    `${baseUrlGrupo}?id_foco=${idFoco}&id_safra=${idSafra}`,
    requestOptions,
  ).then((response) => response.json());

  const { response: foco } = await fetch(
    `${baseUrlShow}/${idFoco}`,
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allItens,
      totalItems,
      itensPerPage,
      filterApplication,
      idFoco,
      idSafra,
      foco,
      pageBeforeEdit,
    },
  };
};
