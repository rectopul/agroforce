import { ReactNode, useState  } from 'react';
import MaterialTable from 'material-table';
import { FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { FiUserPlus } from 'react-icons/fi';

import { Button } from '../index';
import { useGetUsers } from 'src/hooks/useGetUsers';

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string | ReactNode,
  status: boolean,
}

interface ITable {
  data: IUsers[];
}

export const TablePagination = ({ data }: ITable) => {
  const {
    pages,
    setCurrentPage,
  } = useGetUsers();
  
  const [tableData, setTableData] = useState<IUsers[]>(() => data);

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
  };

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
          <FaRegUserCircle size={32} />
        )
      )
    },
    { title: "Nome", field: "name", filterPlaceholder: "Filtrar por nome", exports: false },
    // { title: "Login", field: "login", filterPlaceholder: "Filter by login" },
    { title: "E-mail", field: "email", filterPlaceholder: "Filtrar por email" },
    { title: "Telefone", field: "tel", filterPlaceholder: "Filtrar por contato" },
    {
      title: "Status",
      field: "status",
      searchable: false,
      filterPlaceholder: "Filtrar por status",
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
        )
      ),
    },
  ];
  
  return (
    <MaterialTable
      style={{ background: '#f9fafb' }}
      columns={columns}
      data={tableData}
      components={{
        Pagination: props => (
          Array(pages).fill('').map((_, index) => (
            <>
              <div key={index}
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
                  onClick={() => setCurrentPage(index)}
                  value={`${index + 1}`}
                  bgColor="bg-blue-600"
                  textColor="white"
                />
              </div>
            </>
          ))
        ) as any
      }}
      options={{
        headerStyle: {
          backgroundColor: '#f9fafb',
        },
        search: false,
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

          <strong className='text-blue-600'>Total registrado: { tableData.length }</strong>
        </div>
      }
    />
  )
}
