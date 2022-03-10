import { ReactNode, useEffect, useState  } from 'react';
import MaterialTable from 'material-table';
import { FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from 'react-icons/fa';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { BiEdit, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FiUserPlus } from 'react-icons/fi';
import { MdFirstPage, MdLastPage } from 'react-icons/md';

import { userService } from "src/services";

import { Button } from '../index';

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
  
  const take = 5;
  const total = totalItems;
  const pages = Math.ceil(total / take);

  function handleStatusUser(id: number, status: any): void {
    if (status) {
      status = 1;
    } else {
      status = 0;
    }

    userService.updateUsers({id: id, status: status}).then((response) => {
        console.log('response', response)
    });
    console.log("id", id)
    console.log("status", status)
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

  const columns = [
    {
      title: "Avatar", 
      field: "avatar",
      sorting: false, 
      width: 0,
      exports: false, //export
      render: (rowData: IUsers) => (
        !rowData.avatar || rowData.avatar === '' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={rowData.avatar} alt={rowData.name} style={{ width: 50, height: 50, borderRadius: 99999 }} />
          ) : (
          <FaRegUserCircle size={32} />
        )
      )
    },
    {
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
    },
    {
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
    },
    { title: "Telefone", field: "tel", sorting: false },
    {
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
                href="atualizar-usuario"
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
                href="atualizar-usuario"
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
    },
  ];

  function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }

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
  }
  
  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage, pages, data]);

  return (
    <MaterialTable
      style={{ background: '#f9fafb' }}
      columns={columns}
      data={tableData}
      components={{
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
      options={{
        headerStyle: {
          backgroundColor: '#f9fafb',
        },
        search: false,
        filtering: false
        
      }}
      title={
        <div className='flex items-center w-screen h-20 gap-4 bg-gray-50'>
          <div className='h-10'>
            <Button 
              title="Cadastrar um usuário"
              value="Cadastrar um usuário"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
              href="novo-usuario"
              icon={<FiUserPlus />}
            />
          </div>

          <strong className='text-blue-600'>Total registrado: { totalItems }</strong>
        </div>
      }
    />
  )
}
