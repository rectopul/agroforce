import { useEffect, useState  } from 'react';
import MaterialTable from 'material-table';
import { FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from 'react-icons/fa';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { BiEdit, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FiUserPlus } from 'react-icons/fi';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import * as XLSX from 'xlsx';

import { userService } from "src/services";

import { AccordionFilter, Button } from '../index';
import { RiFileExcel2Line } from 'react-icons/ri';
import { CheckBox } from '../CheckBox';

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string | any,
  status: boolean,
}

interface ITable {
  data: IUsers[];
  totalItems: Number | any;
  filterAplication: object | any;
}

export const TablePagination = ({ data, totalItems, filterAplication }: ITable) => {
  const [tableData, setTableData] = useState<IUsers[]>(() => data);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderName, setOrderName] = useState<number>(0);
  const [orderEmail, setOrderEmail] = useState<number>(0);
  const [arrowName, setArrowName] = useState<any>('');
  const [arrowEmail, setArrowEmail] = useState<any>('');
  const [camposGerenciados, setCamposGerenciados] = useState<any>('avatar,name,email,cpf,tel,status');

  const take = 5;
  const total = totalItems;
  const pages = Math.ceil(total / take);

  function colums(camposGerenciados: any) {
    let ObjetCampos: any = camposGerenciados.split(',');
    var arrOb: any = [];

    Object.keys(ObjetCampos).forEach((item) => {
      if (ObjetCampos[item] == 'avatar') {
        arrOb.push({
          title: "Avatar", 
          field: "avatar",
          sorting: false, 
          width: 0,
          exports: false,
          render: (rowData: IUsers) => (
            !rowData.avatar || rowData.avatar === '' ? (
              <FaRegUserCircle size={32} />
              ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={rowData.avatar} alt={rowData.name} style={{ width: 50, height: 50, borderRadius: 99999 }} />
            )
          )
        });
      } 
      if (ObjetCampos[item] == 'name') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowName }
              <button className='font-medium text-gray-900' onClick={() => handleOrderName('name', orderName)}>
                Nome
              </button>
            </div>
          ),
          field: "name",
          sorting: false
        },);
      }
      
      if (ObjetCampos[item] == 'email') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowEmail }
              <button className='font-medium text-gray-900' onClick={() => handleOrderEmail('email', orderEmail)}>
                E-mail
              </button>
            </div>
          ), 
          field: "email",
          sorting: false
        },);
      }
      if (ObjetCampos[item] == 'tel') {
        arrOb.push({ title: "Telefone", field: "tel", sorting: false })
      }
      if (ObjetCampos[item] == 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: IUsers) => (
            rowData.status ? (
              <div className='h-10 flex'>
                <div className="
                  h-10
                ">
                  <Button 
                    icon={<FaRegUserCircle size={16} />}
                    onClick={() =>{}}
                    bgColor="bg-yellow-500"
                    textColor="white"
                    href="perfil"
                  />
                </div>
                <div className="
                  h-10
                ">
                  <Button 
                    icon={<BiEdit size={16} />}
                    onClick={() =>{}}
                    bgColor="bg-blue-600"
                    textColor="white"
                    href={`/config/tmg/usuarios/atualizar-usuario?id=${rowData.id}`}
                  />
                </div>
                <div>
                  <Button 
                    icon={<FaRegThumbsUp size={16} />}
                    onClick={() => handleStatusUser(rowData.id, !rowData.status)}
                    bgColor="bg-green-600"
                    textColor="white"
                  />
                </div>
              </div>
            ) : (
              <div className='h-10 flex'>
                <div className="
                  h-10
                ">
                  <Button 
                    icon={<FaRegUserCircle size={16} />}
                    onClick={() =>{}}
                    bgColor="bg-yellow-500"
                    textColor="white"
                    href="perfil"
                  />
                </div>
                <div className="
                  h-10
                ">
                  <Button 
                    icon={<BiEdit size={16} />}
                    onClick={() =>{}}
                    bgColor="bg-blue-600"
                    textColor="white"
                    href={`/config/tmg/usuarios/atualizar-usuario?id=${rowData.id}`}
                  />
                </div>
                <div>
                  <Button 
                    icon={<FaRegThumbsDown size={16} />}
                    onClick={() => handleStatusUser(
                      rowData.id, !rowData.status
                    )}
                    bgColor="bg-red-800"
                    textColor="white"
                  />
                </div>
              </div>
            )
          ),
        })
      }
    });
    return arrOb;
  };

  function getValuesComluns() {
    var els:any = document.querySelectorAll("input[type='checkbox'");
    var selecionados = '';
    for (var i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += els[i].value + ',';
      }
    }                           
    setCamposGerenciados(selecionados);
  };

  function handleStatusUser(id: number, status: any): void {
    if (status) {
      status = 1;
    } else {
      status = 0;
    }
    userService.updateUsers({id: id, status: status}).then((response) => {
  
    });
    const index = tableData.findIndex((user) => user.id === id);

    if (index === -1) {
      return;
    }

    setTableData((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = status;
      return copy;
    });
  };

  function handleOrderEmail(column: string, order: string | any): void {
    let typeOrder: any; 
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }

    if (filterAplication && typeof(filterAplication) != undefined) {
      if (typeOrder != '') {
        parametersFilter = filterAplication + "&orderBy=" + column + "&typeOrder=" + typeOrder;
      } else {
        parametersFilter = filterAplication;
      }
    } else {
      if (typeOrder != '') {
        parametersFilter = "orderBy=" + column + "&typeOrder=" + typeOrder;
      } else {
        parametersFilter = filterAplication;
      }
    }

    userService.getAll(parametersFilter + "&skip=0&take=5").then((response) => {
      if (response.status == 200) {
        setTableData(response.response)
      }
    })
    if (orderEmail === 2) {
      setOrderEmail(0);
      setArrowEmail(<AiOutlineArrowDown />);
    } else {
      setOrderEmail(orderEmail + 1);
      if (orderEmail === 1) {
        setArrowEmail(<AiOutlineArrowUp />);
      } else {
        setArrowEmail('');
      }
    }
  };

  function handleOrderName(column: string, order: string | any): void {
    if (orderName === 2) {
      setOrderName(0);
      setArrowName(<AiOutlineArrowUp />);
    } else {
      setOrderName(orderName + 1);
      if (order === 1) {
        setArrowName(<AiOutlineArrowDown />);
      } else {
        setArrowName('');
      }
    }
  };

  const columns = colums(camposGerenciados);

  function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  };

  async function handlePagination() {
    let skip = currentPage * take;
    let parametersFilter = "skip=" + skip + "&take=" + take;

    if (filterAplication) {
      parametersFilter = parametersFilter + "&" + filterAplication;
    }
    await userService.getAll(parametersFilter).then((response) => {
      if (response.status == 200) {
        setTableData(response.response);
      }
    });
  };

  const downloadExcel = () => {
    var totalString = camposGerenciados.length;
    let campos = camposGerenciados.substr(0, totalString- 1)
    if (filterAplication) {
      filterAplication += `&paramSelect=${campos}`;
    }
    
    userService.getAll(filterAplication).then((response) => {
      if (response.status == 200) {
        const newData = response.response.map((row: { avatar: any; status: any }) => {
          delete row.avatar;

          if (row.status === 0) {
            row.status = "Inativo";
          } else {
            row.status = "Ativo";
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "usuarios");
    
        // Buffer
        let buf = XLSX.write(workBook, {
          bookType: "csv", //xlsx
          type: "buffer",
        });
        // Binary
        XLSX.write(workBook, {
          bookType: "csv", //xlsx
          type: "binary",
        });
        // Download
        XLSX.writeFile(workBook, "Usuários.csv");
      }
    });
  };
  
  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage, pages, data]);

  return (
    <MaterialTable
      style={{ background: '#f9fafb' }}
      columns={columns}
      data={tableData}
      options={{
        showTitle: false,
        headerStyle: {
          zIndex: 20
        },
        rowStyle: { background: '#f9fafb', zIndex: 20 },
        search: false,
        filtering: false
      }}
      components={{
        Toolbar: () => (
          <div
          className='w-full max-h-96	
            flex
            items-center
            justify-between
            gap-4
            bg-gray-50
            py-2
            px-5
            border-solid border-b
            border-gray-200
          '>
            <div className='h-12'>
              <Button 
                title="Cadastrar um usuário"
                value="Cadastrar um usuário"
                bgColor="bg-blue-600"
                textColor="white"
                onClick={() => {}}
                href="usuarios/cadastro"
                icon={<FiUserPlus />}
              />
            </div>

            <strong className='text-blue-600'>Total registrado: { totalItems }</strong>

            <div className='h-full flex items-center gap-2
            '>
              <div className="border-solid border-2 border-blue-600 rounded">
                <div className="w-64">
                  <AccordionFilter title='Gerenciar Campos'>
                    <CheckBox name="CamposGerenciados[]" title='Avatar' value={'avatar'} />
                    <CheckBox name="CamposGerenciados[]" title='Nome' value={'name'} />
                    <CheckBox name="CamposGerenciados[]" title='E-mail' value={'email'} />
                    <CheckBox name="CamposGerenciados[]" title='Telefone' value={'tel'} />
                    <CheckBox name="CamposGerenciados[]" title='Status' value={'status'} />
                    <div className="h-8 mt-2">
                    <Button value="Atualizar" bgColor='bg-blue-600' textColor='white' onClick={getValuesComluns} />
                    </div>
                  </AccordionFilter>
                </div>
              </div>

              <div className='h-12 flex items-center justify-center w-full'>
               <Button icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {downloadExcel()}} />
              </div>
            </div>
          </div>
        ),
        Pagination: props => (
          <>
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
                <>
                    <Button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      value={`${currentPage + 1}`}
                      bgColor="bg-blue-600"
                      textColor="white"
                      disabled={true}
                    />
                </>
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
              disabled={currentPage + 1>= pages}
            />
          </div>
          </>
        ) as any
      }}
    />
  )
}
