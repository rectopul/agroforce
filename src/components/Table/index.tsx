import { useEffect, useState } from "react";
import { BiEdit, BiSearchAlt } from "react-icons/bi";
import { FaRegEye, FaEyeSlash, FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";

import { useGetUsers } from "src/hooks/useGetUsers";

import { SelectorPagination } from "../Pagination/Selector";
import { Button } from "../Button";
import { Input } from "../Input";
import { Pagination } from "../Pagination";

interface IUsers {
  id: number,
  name: string,
  login: string,
  telefone: string,
  email: string,
  avatar: string,
  status: boolean,
}

interface ITableProps {
  data: IUsers[],
}

export function Table({ data }: ITableProps) {  
  const [search, setSearch] = useState('');
  const [listAll, setListAll] = useState<boolean>(false);

  const {
    pages,
    currentItens,
    itensPerPage,
    setCurrentPage,
    setItensPerPage,
    setItems: setUsers
  } = useGetUsers();

  const handleFilterUserByName = (): IUsers[] => {
    if (!search || search === '') {
      return currentItens;
    } else {
      const lowerSearch = search.toLowerCase();
  
      const filterUserByName = data.filter((user) => user.name.toLowerCase().includes(lowerSearch));
  
      return filterUserByName;
    }
  };

  function handleStatusUser(id: number, status: boolean): void {
    const index = data.findIndex((user) => user.id === id);

    if (index === -1) {
      return;
    }

    setUsers((oldUser) => {
      const copy = [...oldUser];

      copy[index].status = status;
      return copy;
    });
  }

  const handleListUser = () => {
    if(listAll) {
      setItensPerPage(500);
    } else {
      setItensPerPage(5);
    }
  }

  useEffect(() => {
    setUsers(data);
    handleFilterUserByName();
    handleListUser()
  }, [data, search, listAll]);

  return (
    /* This example requires Tailwind CSS v2.0+ */
    <div className="flex flex-col">

      <div className="w-full
        flex
        justify-between
        p-4
        bg-gray-50
      ">
        <div className="
          w-full
          flex
          gap-4
        ">
          <div>
            <Button 
              title="Cadastrar um usuário"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
              href="novo-usuario"
              icon={<FiUserPlus />}
            />
          </div>

          <div className="w-2/4">
            <Input
              type="search"
              placeholder="Pesquisar..."
              icon={<BiSearchAlt size={18} />}
              value={search}
              onChange={(env) => setSearch(env.target.value)}
            />
          </div>
        </div>

        <div className="
          w-full
          flex
          justify-between
          items-center
          gb-gray-50
        ">
          <div className="w-24">
            <SelectorPagination 
              itensPerPage={itensPerPage}
              setItensPerPage={setItensPerPage}
              listAll={listAll}
            />
          </div>
 
          <span className="flex items-center gap-1">
            Total:
            <strong className="text-blue-600">
              {data.length} registro(s)
            </strong>
          </span>

          <div className="h-full flex gap-2">
            {
              listAll ? (
                <Button
                  icon={<FaRegEye size={20} />}
                  onClick={() => setListAll(false)}
                  bgColor="bg-blue-600"
                  textColor="white"
                />
              ) : (
                <Button
                  icon={<FaEyeSlash size={20} />}
                  onClick={() => setListAll(true)}
                  bgColor="bg-blue-600"
                  textColor="white"
                />
              )
            }

            <Button
              icon={<HiOutlineClipboardList size={20} />}
              onClick={() => {}}
              textColor="white"
              bgColor="bg-blue-600"
            />
          </div>
        </div>
      </div>
      <div className="-my-2 overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Login
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    E-mail
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Telefone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {handleFilterUserByName().map((person) => (
                  <tr key={person.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="h-10 w-10 rounded-full" src={person.avatar as string} alt={person.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.login}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800">
                        { person.email }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{person.telefone}</td>
                    <td className="flex gap-4 mt-4
                    ">
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

                      <div className="
                        h-10
                      ">
                        {
                          person.status ? (
                            <Button 
                              icon={<FaRegThumbsUp size={16} />}
                              onClick={() => handleStatusUser(person.id, !person.status)}
                              bgColor="bg-green-600"
                              textColor="white"
                            />
                          ) : (
                            <Button 
                              icon={<FaRegThumbsDown size={16} />}
                              onClick={() => handleStatusUser(person.id, !person.status)}
                              bgColor="bg-red-800"
                              textColor="white"
                            />
                          )
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pr-20 py-5 bg-gray-50">
        <Pagination setCurrentPage={setCurrentPage} pages={pages} />
      </div>
    </div>
  )
}
