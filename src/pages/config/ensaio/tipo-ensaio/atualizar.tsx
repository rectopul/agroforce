/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import { BiEdit, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoMdArrowBack } from 'react-icons/io';
import { RiFileExcel2Line, RiOrganizationChart } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import MaterialTable from 'material-table';
import { FaSortAmountUpAlt } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { envelopeService, userPreferencesService, typeAssayService } from '../../../../services';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import * as ITabs from '../../../../shared/utils/dropdown';
import {
  AccordionFilter,
  Button, CheckBox, Content,
  Input,
} from '../../../../components';

interface ITypeAssayProps {
  name: any;
  id: number | any;
  protocol_name: string;
  created_by: number;
  status: number;
}

interface IData {
  allEnvelopes: any;
  totalItens: number;
  itensPerPage: number;
  filterApplication: object | any;
  typeAssay: object | any;
  idSafra: number | any
  idTypeAssay: number;
  pageBeforeEdit: string | any
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

export default function AtualizarTipoEnsaio({
  typeAssay,
  idTypeAssay,
  idSafra,
  allEnvelopes,
  totalItens,
  itensPerPage,
  filterApplication,
  pageBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.envelope || { id: 0, table_preferences: 'id,seeds,safra,status' };
  const itemsTotal = totalItens;
  const filter = filterApplication;

  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const [seeds, setSeeds] = useState<any>(() => allEnvelopes);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Quant. de sementes por envelope', value: 'seeds' },
    { name: 'CamposGerenciados[]', title: 'Safra', value: 'safra' },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
  ]);
  const [colorStar, setColorStar] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  function validateInputs(values: any) {
    if (!values.name) { const inputName: any = document.getElementById('name'); inputName.style.borderColor = 'red'; } else { const inputName: any = document.getElementById('name'); inputName.style.borderColor = ''; }
  }

  const router = useRouter();
  const formik = useFormik<ITypeAssayProps>({
    initialValues: {
      id: typeAssay.id,
      name: typeAssay.name,
      protocol_name: typeAssay.protocol_name,
      created_by: userLogado.id,
      status: 1,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire('Preencha todos os campos obrigatórios');
        return;
      }

      await typeAssayService.update({
        id: values.id,
        name: values.name,
        protocol_name: values.protocol_name,
        created_by: Number(userLogado.id),
        status: 1,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Tipo de Ensaio atualizado com sucesso!');
          router.push('/config/ensaio/tipo-ensaio');
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });

  async function handleOrder(column: string, order: string | any): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }

    if (filter && typeof (filter) !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_safra=${idSafra}`;
    } else {
      parametersFilter = filter;
    }

    await envelopeService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setSeeds(response.response);
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
      title: (
        <div className="flex items-center">
          {arrowOrder}
        </div>
      ),
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (
        colorStar === '#eba417'
          ? (
            <div className="h-10 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('')}
                >
                  <AiTwotoneStar size={25} color="#eba417" />
                </button>
              </div>
            </div>
          )
          : (
            <div className="h-10 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('#eba417')}
                >
                  <AiTwotoneStar size={25} />
                </button>
              </div>
            </div>
          )
      ),
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Status',
      field: 'status',
      sorting: false,
      render: (rowData: any) => (
        <div className="h-10 flex">
          <div className="h-10">
            <Button
              icon={<BiEdit size={16} />}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                router.push(`envelope/atualizar?id=${rowData.id}`);
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
          </div>
        </div>
      ),

    };
  }

  function columnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      if (columnOrder[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnOrder[index] === 'seeds') {
        tableFields.push(headerTableFactory('Quant. de sementes por envelope', 'seeds'));
      }
      if (columnOrder[index] === 'safra') {
        tableFields.push(headerTableFactory('Safra', 'safra.safraName'));
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns() {
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
      await userPreferencesService.create({
        table_preferences: campos,
        userId: userLogado.id,
        module_id: 24,
      }).then((response) => {
        userLogado.preferences.seeds = {
          id: response.response.id,
          userId: preferences.userId,
          table_preferences: campos,
        };
        preferences.id = response.response.id;
      });
      localStorage.setItem(
        'user',
        JSON.stringify(userLogado),
      );
    } else {
      userLogado.preferences.seeds = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
      };
      await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
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
    await envelopeService.getAll(filterApplication).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((row: any) => {
          if (row.status === 0) {
            row.status = 'Inativo';
          } else {
            row.status = 'Ativo';
          }
          row.type_assay = row.type_assay?.name;
          row.safra = row.safra?.safraName;

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'seeds');

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
        XLSX.writeFile(workBook, 'Envelopes.xlsx');
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
    await envelopeService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setSeeds(response.response);
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
        <title>Atualizar Tipo Ensaio</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Atualizar Tipo Ensaio</h1>
          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-4
          "
          >
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome
              </label>
              <Input
                type="text"
                placeholder="Nome"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome
              </label>
              <Input
                type="text"
                placeholder="Protocolo"
                id="protocol_name"
                name="protocol_name"
                style={{ background: '#e5e7eb' }}
                disabled
                onChange={formik.handleChange}
                value={formik.values.protocol_name}
              />
            </div>
          </div>

          <div className="
            h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          "
          >
            <div className="w-30">
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
        </form>
        <main className="h-4/6 w-full
          flex flex-col
          items-start
          gap-8
        "
        >

          <div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={seeds}
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
                    <div className="h-12">
                      <Button
                        title="Cadastrar Quant. de sementes por envelope"
                        value="Cadastrar Quant. de sementes por envelope"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { router.push(`envelope/cadastro?id_type_assay=${idTypeAssay}`); }}
                        icon={<FaSortAmountUpAlt size={20} />}
                      />
                    </div>

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
                                      {
                                        generatesProps.map((generate, index) => (
                                          <Draggable
                                            key={index}
                                            draggableId={String(generate.title)}
                                            index={index}
                                          >
                                            {(dragProps) => (
                                              <li
                                                ref={dragProps.innerRef}
                                                {
                                                ...dragProps.draggableProps}
                                                {
                                                ...dragProps.dragHandleProps}
                                              >
                                                <CheckBox
                                                  name={generate.name}
                                                  title={generate.title?.toString()}
                                                  value={generate.value}
                                                  defaultChecked={
                                                    camposGerenciados.includes(
                                                      generate.value as string,
                                                    )
                                                  }
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
                        <Button title="Exportar planilha de quant. de sementes por envelope" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 5;

  const { token } = context.req.cookies;
  const idSafra = context.req.cookies.safraId;
  const pageBeforeEdit = context.req.cookies.pageBeforeEdit
    ? context.req.cookies.pageBeforeEdit : 0;

  const { publicRuntimeConfig } = getConfig();
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const idTypeAssay = Number(context.query.id);

  const filterApplication = `filterStatus=1&id_safra=${idSafra}&id_type_assay=${idTypeAssay}`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const baseUrlEnvelope = `${publicRuntimeConfig.apiUrl}/envelope`;
  const urlParameters: any = new URL(baseUrlEnvelope);
  urlParameters.search = new URLSearchParams(param).toString();

  const {
    response: allEnvelopes,
    total: totalItens,
  } = await fetch(`${baseUrlEnvelope}?id_type_assay=${idTypeAssay}`, requestOptions).then((response) => response.json());

  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/type-assay`;
  const typeAssay = await fetch(`${baseUrlShow}/${context.query.id}`, requestOptions).then((response) => response.json());

  return {
    props: {
      allEnvelopes,
      totalItens,
      itensPerPage,
      filterApplication,
      idTypeAssay,
      idSafra,
      typeAssay,
      pageBeforeEdit,
    },
  };
};
