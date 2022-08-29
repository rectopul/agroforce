/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
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
import { experimentService, userPreferencesService } from '../../../../services';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  AccordionFilter,
  Button, CheckBox, Content,
  Input,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

export interface IData {
  // allItens: any;
  // totalItems: number;
  // itensPerPage: number;
  // filterApplication: object | any;
  // idExperiment: number;
  experimento: object | any,
  // pageBeforeEdit: string | any
}

// interface IGenerateProps {
//   name: string | undefined;
//   title: string | number | readonly string[] | undefined;
//   value: string | number | readonly string[] | undefined;
// }

interface IUpdateExperimento {
  id: number
  foco: string
  ensaio: string
  tecnologia: string
  gli: string
  experimentName: string
  bgm: number
  local: string
  delineamento: string
  repetition: number
  density: number
  drawOrder: number
  status: string
  eel: number
  nlp: number
  clp: number
  comments: string
}

export default function AtualizarLocal({
  experimento,
  // allItens,
  // totalItems,
  // itensPerPage,
  // filterApplication,
  // idExperiment,
  // pageBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'EXPERIMENTOS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();

  // const userLogado = JSON.parse(localStorage.getItem('user') as string);
  // const preferences = userLogado.preferences.materiais || {
  //   id: 0, table_preferences: 'repetitionExperience,
  // genotipo_name,
  // gmr,
  // bgm,
  // fase,
  // tecnologia,
  // treatments_number,
  // status,
  // nca,
  // npe,
  // sequence,
  // block,
  // statusParcial',
  // };
  // const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  // const [materiais, setMateriais] = useState<any>(() => allItens);
  // const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  // const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  // const [orderList, setOrder] = useState<number>(1);
  // const [setArrowOrder] = useState<any>('');
  // const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  // const [filter, setFilter] = useState<any>(filterApplication);
  // const [colorStar, setColorStar] = useState<string>('');
  // const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
  //   { name: 'CamposGerenciados[]', title: 'Rep. Exp', value: 'repetitionExperience' },
  //   { name: 'CamposGerenciados[]', title: 'Nome do genotipo', value: 'genotipo_name' },
  //   { name: 'CamposGerenciados[]', title: 'GMR', value: 'gmr' },
  //   { name: 'CamposGerenciados[]', title: 'BGM', value: 'bgm' },
  //   { name: 'CamposGerenciados[]', title: 'Fase', value: 'fase' },
  //   { name: 'CamposGerenciados[]', title: 'Cód. tec.', value: 'tecnologia' },
  //   { name: 'CamposGerenciados[]', title: 'Rep. trat.', value: 'treatments_number' },
  //   { name: 'CamposGerenciados[]', title: 'T', value: 'status' },
  //   { name: 'CamposGerenciados[]', title: 'NCA', value: 'nca' },
  //   { name: 'CamposGerenciados[]', title: 'NPE', value: 'npe' },
  //   { name: 'CamposGerenciados[]', title: 'Seq.', value: 'sequence' },
  //   { name: 'CamposGerenciados[]', title: 'Bloco', value: 'block' },
  //   { name: 'CamposGerenciados[]', title: 'Status parc.', value: 'statusParcial' },
  // ]);

  // const take: number = itensPerPage;
  // const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  // const pages = Math.ceil(total / take);

  const formik = useFormik<IUpdateExperimento>({
    initialValues: {
      id: experimento.id,
      foco: experimento.assay_list?.foco.name,
      ensaio: experimento.assay_list?.type_assay.name,
      tecnologia: `${experimento.assay_list?.tecnologia.cod_tec} ${experimento.assay_list?.tecnologia.name}`,
      gli: experimento.assay_list?.gli,
      experimentName: experimento?.experimentName,
      bgm: experimento.assay_list?.bgm,
      local: experimento.local?.name_local_culture,
      delineamento: experimento.delineamento?.name,
      repetition: experimento.repetition,
      density: experimento.density,
      drawOrder: experimento.drawOrder,
      status: experimento.status,
      eel: experimento.eel,
      nlp: experimento.nlp,
      clp: experimento.clp,
      comments: experimento.comments,
    },
    onSubmit: async (values) => {
      await experimentService.update({
        id: Number(values.id),
        eel: Number(values.eel),
        nlp: Number(values.nlp),
        clp: Number(values.clp),
        comments: values.comments,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Experimento atualizado com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });

  // async function handleOrder(column: string, order: string | any): Promise<void> {
  //   let typeOrder: any;
  //   let parametersFilter: any;
  //   if (order === 1) {
  //     typeOrder = 'asc';
  //   } else if (order === 2) {
  //     typeOrder = 'desc';
  //   } else {
  //     typeOrder = '';
  //   }

  //   if (filter && typeof (filter) !== 'undefined') {
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

  //   await materiaisService.getAll(`${parametersFilter}&skip=0&take=${take}`)
  //     .then(({ status, response }: any) => {
  //     if (status === 200) {
  //       setMateriais(response);
  //     }
  //   });

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
  //     sorting: false,
  //   };
  // }

  // function columnsOrder(columnsCampos: string) {
  //   const columnCampos: string[] = columnsCampos.split(',');
  //   const tableFields: any = [];

  //   Object.keys(columnCampos).forEach((item, index) => {
  //     if (columnCampos[index] === 'repetitionExperience') {
  //       tableFields.push(headerTableFactory('Rep. Exp', 'repetitionExperience'));
  //     }
  //     if (columnCampos[index] === 'genotipo_name') {
  //       tableFields.push(headerTableFactory('Nome do genotipo', 'genotipo_name'));
  //     }
  //     if (columnCampos[index] === 'gmr') {
  //       tableFields.push(headerTableFactory('GMR', 'gmr'));
  //     }
  //     if (columnCampos[index] === 'bgm') {
  //       tableFields.push(headerTableFactory('BGM', 'bgm'));
  //     }
  //     if (columnCampos[index] === 'fase') {
  //       tableFields.push(headerTableFactory('Fase', 'fase'));
  //     }
  //     if (columnCampos[index] === 'tecnologia') {
  //       tableFields.push(headerTableFactory('Cód. tec.', 'tecnologia'));
  //     }
  //     if (columnCampos[index] === 'treatments_number') {
  //       tableFields.push(headerTableFactory('Rep. trat.', 'treatments_number'));
  //     }
  //     if (columnCampos[index] === 'nca') {
  //       tableFields.push(headerTableFactory('NCA', 'nca'));
  //     }
  //     if (columnCampos[index] === 'npe') {
  //       tableFields.push(headerTableFactory('NPE', 'npe'));
  //     }
  //     if (columnCampos[index] === 'sequence') {
  //       tableFields.push(headerTableFactory('Seq.', 'sequence'));
  //     }
  //     if (columnCampos[index] === 'block') {
  //       tableFields.push(headerTableFactory('Bloco', 'block'));
  //     }
  //     if (columnCampos[index] === 'statusParcial') {
  //       tableFields.push(headerTableFactory('Status parc.', 'statusParcial'));
  //     }
  //   });
  //   return tableFields;
  // }

  // const columns = columnsOrder(camposGerenciados);

  // async function getValuesColumns(): Promise<void> {
  //   const els: any = document.querySelectorAll("input[type='checkbox'");
  //   let selecionados = '';
  //   for (let i = 0; i < els.length; i += 1) {
  //     if (els[i].checked) {
  //       selecionados += `${els[i].value},`;
  //     }
  //   }
  //   const totalString = selecionados.length;
  //   const campos = selecionados.substr(0, totalString - 1);
  //   if (preferences.id === 0) {
  //     await userPreferencesService.create({
  //       table_preferences: campos,
  //       userId: userLogado.id,
  //       module_id: 23,
  //     }).then((response) => {
  //       userLogado.preferences.materiais = {
  //         id: response.response.id,
  //         userId: preferences.userId,
  //         table_preferences: campos,
  //       };
  //       preferences.id = response.response.id;
  //     });
  //     localStorage.setItem('user', JSON.stringify(userLogado));
  //   } else {
  //     userLogado.preferences.materiais = {
  //       id: preferences.id,
  //       userId: preferences.userId,
  //       table_preferences: campos,
  //     };
  //     await userPreferencesService.update({
  //       table_preferences: campos,
  //       id: preferences.id,
  //     });
  //     localStorage.setItem('user', JSON.stringify(userLogado));
  //   }

  //   setStatusAccordion(false);
  //   setCamposGerenciados(campos);
  // }

  // function handleOnDragEnd(result: DropResult): void {
  //   setStatusAccordion(true);
  //   if (!result) return;

  //   const items = Array.from(generatesProps);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   const index: number = Number(result.destination?.index);
  //   items.splice(index, 0, reorderedItem);
  //   setGeneratesProps(items);
  // }

  // const downloadExcel = async (): Promise<void> => {
  //   if (!filterApplication.includes('paramSelect')) {
  //     filterApplication += `&paramSelect=${camposGerenciados}&id_experimento=${idExperiment}`;
  //   }
  //   await materiaisService.getAll(filterApplication).then((response) => {
  //     if (response.status === 200) {
  //       const newData = response.response.map((row: { status: any }) => {
  //         if (row.status === 0) {
  //           row.status = 'Inativo';
  //         } else {
  //           row.status = 'Ativo';
  //         }

  //         return row;
  //       });

  //       newData.map((item: any) => {
  //         item.foco = item.foco?.name;
  //         item.safra = item.safra?.safraName;
  //         return item;
  //       });

  //       const workSheet = XLSX.utils.json_to_sheet(newData);
  //       const workBook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(workBook, workSheet, 'materiais');

  //       // Buffer
  //       XLSX.write(workBook, {
  //         bookType: 'xlsx', // xlsx
  //         type: 'buffer',
  //       });
  //       // Binary
  //       XLSX.write(workBook, {
  //         bookType: 'xlsx', // xlsx
  //         type: 'binary',
  //       });
  //       // Download
  //       XLSX.writeFile(workBook, 'unidade-cultura.xlsx');
  //     }
  //   });
  // };

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
  //   await materiaisService.getAll(parametersFilter).then((response) => {
  //     if (response.status === 200) {
  //       setMateriais(response.response);
  //     }
  //   });
  // }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

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

  function updateFieldsFactory(name: string, title: string, values: any) {
    return (
      <div className="w-full h-7">
        <label className="block text-gray-900 text-sm font-bold mb-0">
          {name}
        </label>
        <Input
          id={title}
          name={title}
          onChange={formik.handleChange}
          value={values}
        />
      </div>
    );
  }

  return (
    <>
      <Head><title>Dados do experimento</title></Head>

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <form
          className="w-full bg-white shadow-md rounded px-4 pt-3 pb-3 mt-0"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-xl">Atualizar Lista de Experimento</h1>
          </div>

          <div className="w-full
            flex
            justify-around
            gap-0
            mt-0
            mb-4
          "
          >
            <div className="w-full flex justify-between items-start gap-5 mt-1">

              {fieldsFactory('Foco', 'foco', experimento.assay_list?.foco.name)}

              {fieldsFactory('Ensaio', 'type_assay', experimento.assay_list?.type_assay.name)}

              {fieldsFactory('Tecnologia', 'tecnologia', `${experimento.assay_list?.tecnologia.cod_tec} ${experimento.assay_list?.tecnologia.name}`)}

              {fieldsFactory('GLI', 'gli', experimento.assay_list?.gli)}

              {fieldsFactory('Experimento', 'experimentName', experimento.experimentName)}

              {fieldsFactory('BGM', 'bgm', experimento.assay_list?.bgm)}

              {fieldsFactory('Status do ensaio', 'status', experimento.assay_list?.status)}

            </div>

          </div>

          <div className="w-full
            flex
            justify-around
            gap-0
            mt-0
            mb-0
          "
          >
            <div className="w-full flex justify-between items-start gap-5 mt-3">

              {fieldsFactory('Lugar plantio', 'local', experimento.local?.name_local_culture)}

              {fieldsFactory('Delineamento', 'delineamento', experimento.delineamento?.name)}

              {fieldsFactory('Repetições', 'repetitionsNumber', experimento.repetitionsNumber)}

              {fieldsFactory('Densidade', 'density', experimento.density)}

              {fieldsFactory('Ordem de sorteio', 'orderDraw', experimento.orderDraw)}

              {fieldsFactory('Status do experimento', 'status', experimento.status)}

            </div>

          </div>

          <div className="rounded border-inherit" style={{ marginTop: 25 }}>
            <span>Características da quadra</span>
            <hr />
          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mt-2
            mb-0
          "
          >
            <div className="w-full h-f10 flex justify-between items-start gap-5">

              {updateFieldsFactory('NLP', 'nlp', formik.values.nlp)}
              {updateFieldsFactory('EEL', 'eel', formik.values.eel)}
              {updateFieldsFactory('CLP', 'clp', formik.values.clp)}
              {updateFieldsFactory('Observações', 'comments', formik.values.comments)}

              <div className="
            h-7 w-full
            flex
            gap-3
            justify-center
            mt-5
          "
              >
                <div className="w-40">
                  <Button
                    type="button"
                    value="Voltar"
                    bgColor="bg-red-600"
                    textColor="white"
                    icon={<IoMdArrowBack size={18} />}
                    onClick={() => { router.back(); }}
                  />
                </div>
                <div className="w-40">
                  <Button
                    type="submit"
                    value="Atualizar"
                    bgColor="bg-blue-600"
                    textColor="white"
                    icon={<RiOrganizationChart size={18} />}
                    onClick={() => { }}
                  />
                </div>
              </div>
            </div>

          </div>
        </form>
        <main className="h-4/6 w-full
          flex flex-col
          items-start
          gap-8
        "
        >

          {/* <div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={materiais}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
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
                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
                          <AccordionFilter title="Gerenciar Campos" grid={statusAccordion}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {
                                  (provided) => (
                                    <ul className="w-full h-full characters"
                                    {...provided.droppableProps}
                                     ref={provided.innerRef}>
                                      <div className="h-8 mb-3">
                                        <Button
                                          value="Atualizar"
                                          bgColor="bg-blue-600"
                                          textColor="white"
                                          onClick={getValuesColumns}
                                          icon={<IoReloadSharp size={20} />}
                                        />
                                      </div>
                                      {
                                        generatesProps.map((generate, index) => (
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
                                                  defaultChecked={camposGerenciados
                                                    .includes(generate.value as string)}
                                                />
                                              </li>
                                            )}
                                          </Draggable>
                                        ))
                                      }
                                      {provided.placeholder}
                                    </ul>
                                  )
                                }
                              </Droppable>
                            </DragDropContext>
                          </AccordionFilter>
                        </div>
                      </div>

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button title="Exportar planilha de materiais"
                        icon={<RiFileExcel2Line size={20} />}
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { downloadExcel(); }} />
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
                    {
                      Array(1).fill('').map((value, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))
                    }
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
          </div> */}
        </main>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0]?.itens_per_page ?? 5;

  const { token } = context.req.cookies;
  const pageBeforeEdit = context.req.cookies.pageBeforeEdit
    ? context.req.cookies.pageBeforeEdit : 0;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const idExperiment = Number(context.query.id);

  const { publicRuntimeConfig } = getConfig();

  const filterApplication = `filterStatus=1&$id_experimento=${idExperiment}`;

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
    },
  };
};
