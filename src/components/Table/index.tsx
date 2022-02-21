import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from "react-icons/fa";

import { Button } from "../Button";

export interface IUserProps {
  id: number;
  name: string,
  nickname: string;
  telefone: string | number;
  email: string;
  image: string;
  status: boolean;
}

interface ITableProps {
  data: IUserProps[],
}


export function Table({ data }: ITableProps) {
  const [users, setUsers] = useState<IUserProps[]>(() => data);

  function handleStatusUser(id: number, status: boolean): void {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return;
    }

    setUsers((oldUser) => {
      const copy = [...oldUser];

      copy[index].status = status;
      return copy;
    });
  }

  return (
    /* This example requires Tailwind CSS v2.0+ */
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                  <tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="h-10 w-10 rounded-full" src={person.image} alt={person.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.nickname}</div>
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
    </div>
  )
}
