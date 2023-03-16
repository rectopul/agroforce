/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  useEffect, useState, useRef, useMemo,
} from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoMdArrowBack } from 'react-icons/io';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiOrganizationChart } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { experimentGenotipeService } from 'src/services/experiment-genotipe.service';
import { ITreatment } from 'src/interfaces/listas/ensaio/genotype-treatment.interface';
import { removeCookies, setCookies } from 'cookies-next';
import {
  experimentService,
  userPreferencesService,
} from '../../../../services';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  InputMoney,
  FieldItemsPerPage,
  ManageFields,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';

export interface IData {
  // allItens: any;
  // totalItems: number;
  // itensPerPage: number;
  // filterApplication: object | any;
  // idExperiment: number;
  experimento: object | any;
  // pageBeforeEdit: string | any
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IUpdateExperimento {
  id: number;
  foco: string;
  ensaio: string;
  tecnologia: string;
  gli: string;
  experimentName: string;
  bgm: number;
  local: string;
  delineamento: string;
  repetition: number;
  density: number;
  drawOrder: number;
  status: string;
  nlp: number;
  clp: any;
  comments: string;
}

export default function AtualizarLocal({
  experimento,
  allItens,
  totalItems,
  itensPerPage,
  filterApplication,
  idExperiment,
  pageBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (tab.titleTab === 'EXPERIMENTOS'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const tableRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'experiment';
  const module_name = 'experimento';
  const module_id = 22;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'repetitionExperience,genotipo,gmr,bgm,fase,tecnologia,nt,rep,status,nca,npe,sequence,block,experiment';
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

  const [materiais, setMateriais] = useState<any>(() => allItens);
  const [treatments, setTreatments] = useState<ITreatment[] | any>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  // const [setArrowOrder] = useState<any>("");
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filtersParams, setFiltersParams] = useState<any>(''); // Set filter Parameter
  // const [colorStar, setColorStar] = useState<string>('');
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]',
      title: 'Rep Exp',
      value: 'repetitionExperience',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome do genotipo',
      value: 'genotipo',
    },
    { name: 'CamposGerenciados[]', title: 'GMR_ens', value: 'gmr' },
    { name: 'CamposGerenciados[]', title: 'BGM_ens', value: 'bgm' },
    { name: 'CamposGerenciados[]', title: 'Fase', value: 'fase' },
    { name: 'CamposGerenciados[]', title: 'Tecnologia', value: 'tecnologia' },
    { name: 'CamposGerenciados[]', title: 'NT', value: 'nt' },
    { name: 'CamposGerenciados[]', title: 'Rep. trat.', value: 'rep' },
    { name: 'CamposGerenciados[]', title: 'T', value: 'status_t' },
    { name: 'CamposGerenciados[]', title: 'NCA', value: 'nca' },
    { name: 'CamposGerenciados[]', title: 'NPE', value: 'npe' },
    // { name: "CamposGerenciados[]", title: "Seq.", value: "sorteio" },
    { name: 'CamposGerenciados[]', title: 'Bloco', value: 'block' },
    { name: 'CamposGerenciados[]', title: 'Status parc', value: 'status' },
  ]);

  const [take, setTake] = useState<any>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer);
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const formik = useFormik<IUpdateExperimento>({
    initialValues: {
      id: experimento.id,
      foco: experimento.assay_list?.foco.name,
      ensaio: experimento.assay_list?.type_assay.name,
      tecnologia: `${experimento?.assay_list?.tecnologia?.cod_tec || ''} ${
        experimento?.assay_list?.tecnologia?.name || ''
      }`,
      gli: experimento.assay_list?.gli,
      experimentName: experimento?.experimentName,
      bgm: experimento.assay_list?.bgm || '',
      local: experimento.local?.name_local_culture,
      delineamento: experimento.delineamento?.name,
      repetition: experimento.repetition,
      density: experimento.density,
      drawOrder: experimento.drawOrder,
      status: experimento.status,
      nlp: experimento.nlp,
      clp: parseFloat(experimento.clp)?.toFixed(2),
      comments: experimento.comments,
    },
    onSubmit: async (values) => {
      setLoading(true);
      await experimentService
        .update({
          id: Number(values.id),
          nlp: Number(values.nlp),
          clp: values.clp,
          comments: values.comments,
          userId: userLogado.id,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Experimento atualizado com sucesso!');
            router.back();
          } else {
            setLoading(false);
            Swal.fire(response.message);
          }
        });
    },
  });

  // Calling common API
  async function getTreatments(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    // setCookies('filterBeforeEdit', parametersFilter);
    // setCookies('filterBeforeEditTypeOrder', typeOrder);
    // setCookies('orderList', orderList);
    // setCookies('fieldOrder', fieldOrder);

    // parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    // setFiltersParams(parametersFilter);
    // setCookies('filtersParams', parametersFilter);

    await experimentGenotipeService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setTreatments(response.response);
          setTotaItems(response.total);
          tableRef?.current?.dataManager?.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
      });
  }

  useEffect(() => {
    const value = `idExperiment=${idExperiment}`;
    getTreatments(value);
  }, [idExperiment]);

  useEffect(() => {
    getTreatments(filter);
  }, [typeOrder]);

  useMemo(() => {
    handlePagination(currentPage);
  }, [take]);

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(columnG);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);

    // getTreatments(filter);
    typeOrderG !== '' ? (typeOrderG == 'desc' ? setOrder(1) : setOrder(2)) : '';
    setArrowOrder(arrowOrder);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }

  // function headerTableFactory(
  //   name: any,
  //   title: string,
  //   style: boolean = false,
  // ) {
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
  //     sorting: false,
  //     cellStyle: style ? { color: '#039be5', fontWeight: 'bold' } : {},
  //   };
  // }

  function formatDecimal(num: number) {
    return num ? Number(num).toFixed(1) : '';
  }

  function columnsOrder(columnsCampos: string) {
    const columnCampos: string[] = columnsCampos.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === 'repetitionExperience') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Rep Exp',
            title: 'rep',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'genotipo') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome do genotipo',
            title: 'genotipo.name_genotipo',
            orderList,
            fieldOrder,
            handleOrder,
            cellStyle: { color: '#039be5', fontWeight: 'bold' },
          }),
        );
      }
      if (columnCampos[index] === 'gmr') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'GMR_ens',
            title: 'genotipo.gmr',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => formatDecimal(rowData.genotipo.gmr),
          }),
        );
      }
      if (columnCampos[index] === 'bgm') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'BGM_ens',
            title: 'genotipo.bgm',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'fase') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Fase',
            title: 'genotipo.lote[0].fase',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'tecnologia') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Tecnologia',
            title: 'tecnologia.cod_tec',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'nt') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NT',
            title: 'nt',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'rep') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Rep trat',
            // title: "rep",
            title: 'experiment.assay_list.treatmentsNumber',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'status_t') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'T',
            title: 'status_t',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'nca') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NCA',
            title: 'nca',
            orderList,
            fieldOrder,
            handleOrder,
            cellStyle: { color: '#039be5', fontWeight: 'bold' },
          }),
        );
      }
      if (columnCampos[index] === 'npe') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NPE',
            title: 'npe',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      // if (columnCampos[index] === "sequence") {
      //   tableFields.push(
      //     headerTableFactory("Sequence", "sequencia_delineamento.sorteio")
      //   );
      // }
      if (columnCampos[index] === 'block') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Bloco',
            title: 'sequencia_delineamento.bloco',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status parc',
            // title: "experiment.status",
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
    });

    console.log(
      '======> PARENT: Ordenação das colunas: ',
      `'${columnsCampos}'`,
      tableFields,
    );

    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  // async function getValuesColumns(): Promise<void> {
  //   const els: any = document.querySelectorAll("input[type='checkbox']");
  //   let selecionados = "";
  //   for (let i = 0; i < els.length; i += 1) {
  //     if (els[i].checked) {
  //       selecionados += `${els[i].value},`;
  //     }
  //   }
  //   const totalString = selecionados.length;
  //   const campos = selecionados.substr(0, totalString - 1);
  //   if (preferences.id === 0) {
  //     await userPreferencesService
  //       .create({
  //         table_preferences: campos,
  //         userId: userLogado.id,
  //         module_id: 30,
  //       })
  //       .then((response) => {
  //         userLogado.preferences.parcelas = {
  //           id: response.response.id,
  //           userId: preferences.userId,
  //           table_preferences: campos,
  //         };
  //         preferences.id = response.response.id;
  //       });
  //     localStorage.setItem("user", JSON.stringify(userLogado));
  //   } else {
  //     userLogado.preferences.parcelas = {
  //       id: preferences.id,
  //       userId: preferences.userId,
  //       table_preferences: campos,
  //     };
  //     await userPreferencesService.update({
  //       table_preferences: campos,
  //       id: preferences.id,
  //     });
  //     localStorage.setItem("user", JSON.stringify(userLogado));
  //   }
  //
  //   setStatusAccordion(false);
  //   setCamposGerenciados(campos);
  // }

  // function handleOnDragEnd(result: DropResult): void {
  //   setStatusAccordion(true);
  //   if (!result) return;
  //
  //   const items = Array.from(generatesProps);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   const index: number = Number(result.destination?.index);
  //   items.splice(index, 0, reorderedItem);
  //   setGeneratesProps(items);
  // }

  const downloadExcel = async (): Promise<void> => {
    setLoading(true);

    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await experimentGenotipeService
      .getAll(filterParam)
      .then(({ status, response }) => {
        if (!response.A1) {
          Swal.fire('Nenhum dado para extrair');
          return;
        }
        if (status === 200) {
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, response, 'Parcelas');
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
          XLSX.writeFile(workBook, 'Parcelas.xlsx');
        } else {
          setLoading(false);
          Swal.fire(
            'Não existem registros para serem exportados, favor checar.',
          );
        }
      });
    setLoading(false);
  };

  // function handleTotalPages(): void {
  //   if (currentPage < 0) {
  //     setCurrentPage(0);
  //   } else if (currentPage >= pages) {
  //     setCurrentPage(pages - 1);
  //   }
  // }

  // async function handlePagination(): Promise<void> {
  //   const skip = currentPage * Number(take);
  //   let parametersFilter = `skip=${skip}&take=${take}`;

  //   if (filter) {
  //     parametersFilter = `${parametersFilter}&${filter}`;
  //   }
  //   // await materiaisService.getAll(parametersFilter).then((response) => {
  //   //   if (response.status === 200) {
  //   //     setMateriais(response.response);
  //   //   }
  //   // });
  // }

  // manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(page: any): Promise<void> {
    await getTreatments(filter, page); // handle pagination globly
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage, take]);

  function fieldsFactory(name: string, title: string, values: any) {
    return (
      <div className="w-full h-7">
        <label className="block text-gray-900 text-sm font-bold mb-0">
          {name}
        </label>
        <Input
          style={{ background: '#e5e7eb' }}
          disabled
          required
          id={title}
          name={title}
          value={values}
        />
      </div>
    );
  }

  function updateFieldsFactory(
    name: string,
    title: string,
    values: any,
    type: string = 'text',
  ) {
    return (
      <div className="w-1/4 h-7 mt-7">
        <label className="block text-gray-900 text-sm font-bold mb-0">
          {name}
        </label>
        <Input
          id={title}
          name={title}
          type={type}
          onChange={formik.handleChange}
          value={values}
        />
      </div>
    );
  }

  function updateFieldMoney(name: string, title: string, values: any) {
    return (
      <div className="w-1/4 h-7 mt-7">
        <label className="block text-gray-900 text-sm font-bold mb-0">
          {name}
        </label>
        <InputMoney
          id={title}
          name={title}
          onChange={(e) => formik.setFieldValue(title, e)}
          value={values}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dados do experimento</title>
      </Head>

      {loading && <ComponentLoading text="" />}

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <AccordionFilter
          title=""
          grid
          full
          onChange={(_, e) => setStatusAccordionFilter(e)}
        >
          <form
            className="w-full bg-white px-0 pt-0 pb-0 mt-0"
            onSubmit={formik.handleSubmit}
          >
            <div className="w-full flex justify-between items-start">
              <h1 className="text-xl">Atualizar Lista de Experimento</h1>
            </div>

            <div
              className="w-full
            flex
            justify-around
            gap-0
            mt-0
            mb-4
          "
            >
              <div className="w-full flex justify-between items-start gap-5 mt-1">
                {fieldsFactory(
                  'Foco',
                  'foco',
                  experimento.assay_list?.foco.name,
                )}

                {fieldsFactory(
                  'Ensaio',
                  'type_assay',
                  experimento.assay_list?.type_assay.name,
                )}

                {fieldsFactory(
                  'Tecnologia',
                  'tecnologia',
                  `${experimento.assay_list?.tecnologia.cod_tec} ${experimento.assay_list?.tecnologia.name}`,
                )}

                {fieldsFactory('GLI', 'gli', experimento.assay_list?.gli)}

                {fieldsFactory(
                  'Experimento',
                  'experimentName',
                  experimento.experimentName,
                )}

                {fieldsFactory('BGM', 'bgm', experimento.assay_list?.bgm)}

                {fieldsFactory(
                  'Status do ensaio',
                  'status',
                  experimento.assay_list?.status,
                )}
              </div>
            </div>

            <div
              className="w-full
            flex
            justify-around
            gap-0
            mt-0
            mb-0
          "
            >
              <div className="w-full flex justify-between items-start gap-5 mt-3">
                {fieldsFactory(
                  'Lugar plantio',
                  'local',
                  experimento.local?.name_local_culture,
                )}

                {fieldsFactory(
                  'Delineamento',
                  'delineamento',
                  experimento.delineamento?.name,
                )}

                {fieldsFactory(
                  'Repetições',
                  'repetitionsNumber',
                  experimento.repetitionsNumber,
                )}

                {fieldsFactory('Densidade', 'density', experimento.density)}

                {fieldsFactory(
                  'Ordem de sorteio',
                  'orderDraw',
                  experimento.orderDraw,
                )}

                {fieldsFactory(
                  'Status do experimento',
                  'status',
                  experimento.status,
                )}
              </div>
            </div>

            <div className="rounded border-inherit" style={{ marginTop: 25 }}>
              <span>Características da quadra</span>
              <hr />
            </div>

            <div
              className="w-full
            flex
            justify-around
            gap-6
            mt-2
            mb-0
          "
            >
              <div className="w-full h-f10 flex justify-between items-start gap-5">
                {updateFieldsFactory('NLP', 'nlp', formik.values.nlp, 'number')}

                {/* {updateFieldMoney('EEL', 'eel', formik.values.eel)} */}
                {updateFieldMoney('CLP', 'clp', formik.values.clp)}

                {/* <input
                style={{ border: 1, borderColor: '#000', width: 200 }}
                className="shadow
        appearance-none
        bg-white bg-no-repeat
        border border-solid border-gray-300
        rounded
        w-full
        py-1 px-2
        text-gray-900
        text-xs
        leading-tight
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
                id="eel"
                name="eel"
                value={formik.values.clp}
                onChange={formik.handleChange}
                onKeyUp={formatarMoeda}
              /> */}

                <div className="w-full flex flex-col h-20">
                  <label className="block text-gray-900 text-sm font-bold mb-0">
                    Observações
                  </label>
                  <textarea
                    className="shadow
                              appearance-none
                              bg-white bg-no-repeat
                              border border-solid border-gray-300
                              rounded
                              w-full
                              py-1 px-2
                              text-gray-900
                              text-xs
                              leading-tight
                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    rows={3}
                    id="comments"
                    name="comments"
                    onChange={formik.handleChange}
                    value={formik.values.comments}
                  />
                </div>

                <div
                  className="
            h-7 w-full
            flex
            gap-3
            justify-end
            mt-12
          "
                >
                  <div className="w-40">
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
                  <div className="w-40">
                    <Button
                      type="submit"
                      value="Atualizar"
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<RiOrganizationChart size={18} />}
                      onClick={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </AccordionFilter>

        <main
          className="h-auto w-full
          flex flex-col
          items-start
          gap-8
          overflow-y-hidden
        "
        >
          <div style={{ marginTop: '1%' }} className="w-full h-auto">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={treatments}
              options={{
                showTitle: false,
                // maxBodyHeight: "calc(100vh - 550px)",
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 600 : 320
                }px)`,
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
                    <div className="flex flex-row items-center w-full">
                      <div className="flex flex-1 justify-center">
                        <strong className="text-blue-600">
                          Total registrado:
                          {' '}
                          {itemsTotal}
                        </strong>
                        {/* <span style={{ fontSize: 9, width:300 }}> */}
                        {/*  {JSON.stringify(preferences.table_preferences)} */}
                        {/*  {JSON.stringify(generatesProps)} */}
                        {/*  {JSON.stringify(preferences)} */}
                        {/*  /!*{JSON.stringify(userLogado)}*!/ */}

                        {/* </span> */}
                      </div>
                      <div className="flex flex-1 mb-6 justify-end">
                        <FieldItemsPerPage
                          widthClass="w-1/3"
                          selected={take}
                          onChange={setTake}
                        />
                      </div>
                    </div>

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
                          console.log('callback', 'setStatusAccordion', e);
                          setStatusAccordion(e);
                        }}
                        OnSetGeneratesProps={(e: any) => {
                          console.log('callback', 'setGeneratesProps', e);
                          setGeneratesProps(e);
                        }}
                        OnSetCamposGerenciados={(e: any) => {
                          console.log('callback', 'setCamposGerenciados', e);
                          setCamposGerenciados(e);
                        }}
                        OnColumnsOrder={(e: any) => {
                          console.log('callback', 'columnsOrder', e);
                          columnsOrder(e);
                        }}
                        OnSetUserLogado={(e: any) => {
                          console.log('callback', 'setUserLogado', e);
                          setUserLogado(e);
                        }}
                        OnSetPreferences={(e: any) => {
                          console.log('callback', 'setPreferences', e);
                          setPreferences(e);
                        }}
                      />

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de materiais"
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
  query,
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 5;

  const { token } = req.cookies;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const idExperiment = Number(query.id);

  const { publicRuntimeConfig } = getConfig();

  const filterApplication = `idExperiment=${idExperiment}`;

  // const filterApplication = `id_experimento=${idExperiment}`;

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';

  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : '';

  // removeCookies('filterBeforeEdit', { req, res });
  // removeCookies('pageBeforeEdit', { req, res });

  // RR
  // removeCookies('filterBeforeEditTypeOrder', { req, res });
  // removeCookies('filterBeforeEditOrderBy', { req, res });
  // removeCookies('lastPage', { req, res });

  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/experiment`;
  const experimento = await fetch(
    `${baseUrlShow}/${idExperiment}`,
    requestOptions,
  ).then((response) => response.json());

  const allItens: any = [];
  const totalItems = 0;

  return {
    props: {
      allItens,
      totalItems,
      itensPerPage,
      filterApplication,
      idExperiment,
      experimento,
      pageBeforeEdit,
      orderByserver, // RR
      typeOrderServer, // RR
    },
  };
};
