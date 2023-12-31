/* eslint-disable camelcase */
import { useFormik } from 'formik';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, ReactNode, useEffect } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import MaterialTable from 'material-table';
import {
  Button,
  Content,
  Input,
  AccordionFilter,
  CheckBox,
  Select,
  ManageFields,
} from 'src/components';
import Swal from 'sweetalert2';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import { BiEdit, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from 'react-icons/ri';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import {
  userPreferencesService,
  layoutChildrenService,
  quadraService,
} from 'src/services';
import * as XLSX from 'xlsx';
import * as ITabs from '../../../../shared/utils/dropdown';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';

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
  layoutChildren: any[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  id_layout: number;
  layout: any;
}

export default function Atualizarquadra({
  layoutChildren,
  totalItems,
  itensPerPage,
  filterApplication,
  id_layout,
  layout,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();
  const [loading, setLoading] = useState<boolean>(false);

  tabsDropDowns.map((tab) => (tab.titleTab === 'QUADRAS'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const formik = useFormik<any>({
    initialValues: {
      id: layout.id,
      parcelas: layout.parcelas,
      plantadeira: layout.plantadeira,
      esquema: layout.esquema,
      tiros: layout.tiros,
      disparos: layout.disparos,
    },
    onSubmit: async (values) => {
      await quadraService
        .update({
          id: layout.id,
          cod_quadra: values.cod_quadra,
          id_culture: values.id_culture,
          id_safra: values.id_safra,
          local_preparo: values.local_preparo,
          local_plantio: values.local_plantio,
          larg_q: values.larg_.larg_q,
          comp_p: values.larg_.comp_p,
          linha_p: values.larg_.linha_p,
          comp_c: values.larg_.comp_c,
          esquema: values.larg_.esquema,
          tiros: values.tiros,
          disparos: values.larg_.disparos,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Genótipo atualizado com sucesso!');
            router.back();
          } else {
            Swal.fire(response.message);
          }
        });
    },
  });

  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'layout_children';
  const module_name = 'layout_children';
  const module_id = 19;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,sl,sc,s_aloc,tiro,cj,disparo,dist,st,spc,scolheita,tipo_parcela';
  const preferencesDefault = {
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  };

  const [preferences, setPreferences] = useState<any>(
    userLogado.preferences[identifier_preference] || preferencesDefault,
  );

  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [disparos, setDisparos] = useState<any[]>(() => layoutChildren);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'SL', value: 'sl' },
    { name: 'CamposGerenciados[]', title: 'sSCc', value: 'sc' },
    { name: 'CamposGerenciados[]', title: 'S Aloc', value: 's_aloc' },
    { name: 'CamposGerenciados[]', title: 'Tiro', value: 'tiro' },
    { name: 'CamposGerenciados[]', title: 'CJ', value: 'cj' },
    { name: 'CamposGerenciados[]', title: 'Disparo', value: 'disparo' },
    { name: 'CamposGerenciados[]', title: 'Dist', value: 'dist' },
    { name: 'CamposGerenciados[]', title: 'ST', value: 'st' },
    { name: 'CamposGerenciados[]', title: 'SPC', value: 'spc' },
    { name: 'CamposGerenciados[]', title: 'SColheita', value: 'scolheita' },
    {
      name: 'CamposGerenciados[]',
      title: 'Tipo Parcela',
      value: 'tipo_parcela',
    },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [fieldOrder, setFieldOrder] = useState<any>('');

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const columns = columnsOrder(camposGerenciados);

  // function headerTableFactory(name: any, title: string) {
  //   return {
  //     title: (
  //       <div className="flex items-center">
  //         <button className="font-medium text-gray-900" onClick={() => handleOrder(title, orderList)}>
  //           {name}
  //         </button>
  //       </div>
  //     ),
  //     field: title,
  //     sorting: false,
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

  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'sl') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'SL',
            title: 'sl',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'sc') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'SC',
            title: 'sc',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 's_aloc') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'S Aloc',
            title: 's_aloc',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'tiro') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tiro',
            title: 'tiro',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'cj') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'CJ',
            title: 'cj',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'disparo') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Disparos',
            title: 'disparo',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'dist') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Dist',
            title: 'dist',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'st') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'ST',
            title: 'st',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'spc') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'SPC',
            title: 'spc',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'scolheita') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'SColheira',
            title: 'scolheita',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'tipo_parcela') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tipo Parcela',
            title: 'tipo_parcela',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
    });
    return tableFields;
  }

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
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_layout=${id_layout}`;
    } else {
      parametersFilter = filter;
    }

    await layoutChildrenService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then((response) => {
        if (response.status === 200) {
          setDisparos(response.response);
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
          sle_id: 19,
        })
        .then((response) => {
          userLogado.preferences.layout_children = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.layout_children = {
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
    await layoutChildrenService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: any) => {
          if (row.status === 0) {
            row.status = 'Inativo';
          } else {
            row.status = 'Ativo';
          }

          row.ESQUEMA = row.Layout.esquema;
          row.PLANTADEIRA = row.Layout.plantadeira;
          row.SL = row.sl;
          row.SC = row.sc;
          row.S_ALOC = row.s_aloc;
          row.TIRO = row.tiro;
          row.DISPARO = row.disparo;
          row.DIST = row.dist;
          row.ST = row.st;
          row.CJ = row.cj;
          row.SPC = row.spc;
          row.S_COLHEITA = row.scolheita;
          row.TIPO_PARCELA = row.tipo_parcela;

          delete row.Layout;
          delete row.id;
          delete row.sl;
          delete row.sc;
          delete row.s_aloc;
          delete row.tiro;
          delete row.disparo;
          delete row.dist;
          delete row.st;
          delete row.cj;
          delete row.spc;
          delete row.scolheita;
          delete row.tipo_parcela;
          delete row.status;
          delete row.id_layout;

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Esquema');

        // Buffer
        const buf = XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'buffer',
        });
        // Binary
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'binary',
        });
        // Download
        XLSX.writeFile(workBook, 'Esquema.xlsx');
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
      parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await layoutChildrenService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setDisparos(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  function updateFieldFactory(title: any, name: any) {
    return (
      <div className="w-full h-6">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          *
          {name}
        </label>
        <Input
          style={{ background: '#e5e7eb' }}
          disabled
          required
          id={title}
          name={title}
          value={layout[title]}
        />
      </div>
    );
  }

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Atualizar layout quadra</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="w-full flex flex-col items-start shadow-md gap-0 overflow-y-hidden">
          <form
            className="w-full bg-white shadow-md rounded px-4 pt-3 pb-3 mt-2"
            onSubmit={formik.handleSubmit}
          >
            <h1 className="text-xl">Atualizar layout quadra</h1>

            <div className="w-full flex justify-between items-start gap-5 mt-2">
              {updateFieldFactory('esquema', 'Código esquema')}

              {updateFieldFactory('plantadeira', 'Plantadeiras')}
            </div>
            <div className="w-full flex justify-between items-start gap-5 mt-10">
              {updateFieldFactory('tiros', 'Tiros')}

              {updateFieldFactory('disparos', 'Disparos')}

              {updateFieldFactory('parcelas', 'Parcelas')}

              <div
                style={{ minWidth: 150, maxWidth: 150 }}
                className="h-7 flex gap-3 justify-center mt-6"
              >
                <div className="w-30" />
                <Button
                  type="button"
                  value="Voltar"
                  bgColor="bg-red-600"
                  textColor="white"
                  icon={<IoMdArrowBack size={18} />}
                  onClick={() => router.back()}
                />
              </div>
            </div>
          </form>
          <div style={{ marginTop: '1%' }} className="w-full h-full">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={disparos}
              options={{
                showTitle: false,
                maxBodyHeight: 'calc(100vh - 460px)',
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
                    <div className="h-12" />
                    <strong className="text-blue-600">
                      Total registrado:
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
                          title="Exportar planilha de disparos"
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 10;

  const { token } = context.req.cookies;

  const { publicRuntimeConfig } = getConfig();
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const baseUrl = `${publicRuntimeConfig.apiUrl}/layout-quadra`;
  const apiQuadra = await fetch(
    `${baseUrl}/${context.query.id}`,
    requestOptions,
  );
  const layout = await apiQuadra.json();

  const baseUrlDisparos = `${publicRuntimeConfig.apiUrl}/layout-children`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const urlParameters: any = new URL(baseUrlDisparos);
  urlParameters.search = new URLSearchParams(param).toString();
  const id_layout = Number(context.query.id);

  const filterApplication = `filterStatus=1&id_layout=${id_layout}`;

  const api = await fetch(
    `${baseUrlDisparos}?id_layout=${id_layout}`,
    requestOptions,
  );

  const { response: layoutChildren, total: totalItems } = await api.json();

  return {
    props: {
      layout,
      layoutChildren,
      totalItems,
      itensPerPage,
      filterApplication,
      id_layout,
    },
  };
};
