import { useState  } from 'react';
import MaterialTable from 'material-table';
import { Button } from '../Button';
import { FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { FiUserPlus } from 'react-icons/fi';

interface IUsers {
  id: number,
  name: string,
  login: string,
  telefone: string,
  email: string,
  avatar: string,
  status: boolean,
}

interface ITable {
  data: IUsers[];
}

export const TablePagination = ({data}: ITable) => {
  const [tableData, setTableData] = useState<IUsers[]>(data);

  function handleStatusUser(id: number, status: boolean): void {
    const index = tableData.findIndex((user) => user.id === id);

    if (index === -1) {
      return;
    }

    setTableData((oldUser) => {
      const copy = [...oldUser];

      copy[index].status = status;
      return copy;
    });
  }

  const columns = [
    { 
      title: "Avatar", 
      field: "avatar", 
      width: 0,
      filtering: false, 
      exports: false, //export
      render: (rowData: any) => (
        !rowData.avatar ? (
          <img src={rowData.avatar} alt={rowData.name} style={{ width: 50, height: 50, borderRadius: 99999 }} />
        ) : (
          <img src={rowData.avatar} alt={rowData.name} style={{ width: 50, height: 50, borderRadius: 99999 }} />
        )
      )
    },
    { title: "Name", field: "name", filterPlaceholder: "Filter by name", exports: false },
    { title: "Login", field: "login", filterPlaceholder: "Filter by login" },
    { title: "E-mail", field: "email", filterPlaceholder: "Filter by email" },
    { title: "Phone", field: "telefone", filterPlaceholder: "Filter by phone" },
    {
      title: "Status",
      field: "status", 
      searchable: false, 
      filterPlaceholder: "Filter by age" ,
      render: (rowData: any) => (
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
                  onClick={() => handleStatusUser(rowData.id, !rowData.status)}
                  bgColor="bg-red-800"
                  textColor="white"
                />
              </div>
            </div>
      )),
    },
  ];
  
  return (
    <MaterialTable
      columns={columns}
      data={tableData}
      options={{
        searchAutoFocus: true, filtering: true, paging: true, 
        pageSizeOptions:[5,10, 20, 25, 50, 100], pageSize: 5, paginationType: "stepped",
        exportButton: true,
        headerStyle: {
          backgroundColor: '#f9fafb',
        },
        search: true,
        exportFileName: "List Users"
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
          <strong className='text-blue-600'>Total registrado: {tableData.length}</strong>
        </div>
      }
    />
  )
}
