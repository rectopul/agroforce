import { BaseSyntheticEvent, useEffect, useState } from "react";
import { BiEdit, BiSearchAlt } from "react-icons/bi";
import { FaRegEye, FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";

import { usePagination } from '../../hooks/usePagination';
import { useUsers } from "../../hooks/users";

import { Button } from "../Button";
import { Input } from "../Input";

export interface IUserProps {
  id: number;
  name: string,
  nickname: string;
  telefone: string | number;
  email: string;
  image?: string;
  status: boolean;
}

interface ITableProps {
  data: IUserProps[],
}

export function Table({ data }: ITableProps) {
  // const [users, setUsers] = useState<IUserProps[]>(() => data);
  const [items, setItems] = useState<IUserProps[]>(() => data);
  
  const { users, fetchUsers } = useUsers(10);
  const { actualPage, setActualPage } = usePagination();

  function handleStatusUser(id: number, status: boolean): void {
    const index = items.findIndex((user) => user.id === id);

    if (index === -1) {
      return;
    }

    setItems((oldUser) => {
      const copy = [...oldUser];

      copy[index].status = status;
      return copy;
    });
  }

  useEffect(() => {
    fetchUsers(actualPage)
  }, [actualPage]);

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

          <div className="flex 
            items-center 
            p-2
            px-4
            rounded-lg
            bg-blue-600
          ">
            <span className="text-white" >1</span>
          </div>

          <div className="w-2/4">
            <Input
              type="search"
              placeholder="Pesquisar..."
              icon={<BiSearchAlt size={18} />}
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
          
          <span className="flex items-center gap-1">
            Total:
            <strong className="text-blue-600">
              6 registro(s)
              </strong>
          </span>

          <div className="h-full flex gap-2">
            <Button
              icon={<FaRegEye size={20} />}
              onClick={() => {}}
              bgColor="bg-blue-600"
              textColor="white"
            />

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
                {users.map((person) => (
                  <tr key={person.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="h-10 w-10 rounded-full" src={person.avatar} alt={person.name} />
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

      <div className="flex justify-end gap-2 pr-2 py-5 bg-gray-50">
        {
          Array(5).fill('').map((_, index) => {
            return (
              <button key={index} onClick={() => setActualPage(index + 1)} disabled={index === actualPage - 1}
                className="
                z-10 bg-indigo-50 text-blue-600 relative inline-flex items-center px-4 py-2 text-sm font-medium
                
                rounded-lg
                border border-1 border-blue-600
                transition duration-700
                hover:bg-gray-300
              ">
                { index + 1 }
              </button>
            )                
          })
        }
      </div>
    </div>
  )
}
